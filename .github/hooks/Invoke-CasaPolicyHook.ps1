$ErrorActionPreference = 'Stop'

function Write-HookResult {
    param(
        [hashtable]$Result
    )

    $json = $Result | ConvertTo-Json -Depth 10 -Compress
    [Console]::Out.Write($json)
    exit 0
}

function Get-HookInput {
    $raw = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($raw)) {
        return $null
    }

    return $raw | ConvertFrom-Json
}

function Resolve-WorkspaceRelativePath {
    param(
        [string]$Candidate,
        [string]$WorkspaceRoot
    )

    if ([string]::IsNullOrWhiteSpace($Candidate)) {
        return $null
    }

    $trimmed = $Candidate.Trim().Trim('"')
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return $null
    }

    if ($trimmed -match '^(https?|file|vscode):') {
        return $null
    }

    if ($trimmed.IndexOf([Environment]::NewLine, [System.StringComparison]::Ordinal) -ge 0) {
        return $null
    }

    try {
        if ([System.IO.Path]::IsPathRooted($trimmed)) {
            $fullPath = [System.IO.Path]::GetFullPath($trimmed)
            $rootPath = [System.IO.Path]::GetFullPath($WorkspaceRoot)
            if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
                return $null
            }

            $relative = $fullPath.Substring($rootPath.Length).TrimStart('\\', '/')
            return ($relative -replace '\\', '/')
        }
    }
    catch {
        return $null
    }

    $normalized = $trimmed -replace '\\', '/'
    if ($normalized.StartsWith('./', [System.StringComparison]::Ordinal)) {
        $normalized = $normalized.Substring(2)
    }

    if ($normalized -match '[\*\?<>|]') {
        return $null
    }

    if ($normalized -match '^\.github/' -or $normalized -match '^[^\s]+\.[A-Za-z0-9]+$' -or $normalized -match '^[^\s]+/[^\s]+\.[A-Za-z0-9]+$') {
        return $normalized
    }

    return $null
}

function Add-ToolInputPaths {
    param(
        $Value,
        [string]$WorkspaceRoot,
        [System.Collections.Generic.HashSet[string]]$Paths
    )

    if ($null -eq $Value) {
        return
    }

    if ($Value -is [string]) {
        $candidate = Resolve-WorkspaceRelativePath -Candidate $Value -WorkspaceRoot $WorkspaceRoot
        if ($candidate) {
            [void]$Paths.Add($candidate)
        }

        return
    }

    if ($Value -is [System.Collections.IDictionary]) {
        foreach ($key in $Value.Keys) {
            Add-ToolInputPaths -Value $Value[$key] -WorkspaceRoot $WorkspaceRoot -Paths $Paths
        }

        return
    }

    if ($Value -is [System.Collections.IEnumerable] -and -not ($Value -is [string])) {
        foreach ($item in $Value) {
            Add-ToolInputPaths -Value $item -WorkspaceRoot $WorkspaceRoot -Paths $Paths
        }

        return
    }

    foreach ($property in $Value.PSObject.Properties) {
        Add-ToolInputPaths -Value $property.Value -WorkspaceRoot $WorkspaceRoot -Paths $Paths
    }
}

function Get-ToolInputPaths {
    param(
        $HookInput,
        [string]$WorkspaceRoot
    )

    $paths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    Add-ToolInputPaths -Value $HookInput.tool_input -WorkspaceRoot $WorkspaceRoot -Paths $paths
    return @($paths)
}

function Test-EditLikeTool {
    param(
        [string]$ToolName
    )

    if ([string]::IsNullOrWhiteSpace($ToolName)) {
        return $false
    }

    return $ToolName -match '(?i)(edit|write|create|replace|delete|patch|rename|move|file)'
}

function Test-GovernancePath {
    param(
        [string]$RelativePath
    )

    return $RelativePath -like '.github/agents/*.agent.md' -or
        $RelativePath -like '.github/hooks/*' -or
        $RelativePath -eq '.github/copilot-instructions.md' -or
        $RelativePath -eq '.github/README.md'
}

function Test-AgentFile {
    param(
        [string]$FullPath,
        [string]$RelativePath
    )

    $issues = New-Object System.Collections.Generic.List[string]
    $content = Get-Content -Raw -Encoding UTF8 -Path $FullPath

    if ($content -notmatch '(?m)^name:\s+') {
        $issues.Add("$RelativePath icinde zorunlu 'name' frontmatter alani eksik.")
    }

    if ($content -notmatch '(?m)^description:\s+') {
        $issues.Add("$RelativePath icinde zorunlu 'description' frontmatter alani eksik.")
    }

    if ($content -notmatch '(?m)^target:\s+vscode\s*$') {
        $issues.Add("$RelativePath icinde 'target: vscode' korunmali.")
    }

    if ($content -notmatch '(?m)^tools:\s+\[') {
        $issues.Add("$RelativePath icinde 'tools' listesi eksik.")
    }

    if ($content -notmatch '(?m)^agents:\s+\[') {
        $issues.Add("$RelativePath icinde 'agents' listesi eksik.")
    }

    if ($content -notmatch '## Yasak Kararlar') {
        $issues.Add("$RelativePath icinde '## Yasak Kararlar' bolumu eksik.")
    }

    if ($content -notmatch '## Zorunlu Onaylar') {
        $issues.Add("$RelativePath icinde '## Zorunlu Onaylar' bolumu eksik.")
    }

    if ($content -match "(?m)^agents:\s+\[[^\]]*'[a-z0-9-]+'") {
        $issues.Add("$RelativePath icindeki 'agents' listesinde slug yerine gorunen agent adlari kullanilmali.")
    }

    if ($content -match '(?m)^\s+agent:\s+[a-z0-9-]+\s*$') {
        $issues.Add("$RelativePath icindeki 'handoffs.agent' alanlarinda slug yerine gorunen agent adlari kullanilmali.")
    }

    return $issues
}

function Test-HookConfigFile {
    param(
        [string]$FullPath,
        [string]$RelativePath
    )

    $issues = New-Object System.Collections.Generic.List[string]

    try {
        $json = Get-Content -Raw -Encoding UTF8 -Path $FullPath | ConvertFrom-Json
    }
    catch {
        $issues.Add("$RelativePath gecerli JSON degil: $($_.Exception.Message)")
        return $issues
    }

    if (-not $json.hooks) {
        $issues.Add("$RelativePath icinde 'hooks' nesnesi eksik.")
        return $issues
    }

    foreach ($eventName in @('PreToolUse', 'PostToolUse')) {
        if (-not $json.hooks.$eventName) {
            $issues.Add("$RelativePath icinde '$eventName' hook'u tanimli olmali.")
        }
    }

    return $issues
}

function Test-GovernanceFiles {
    param(
        [string[]]$RelativePaths,
        [string]$WorkspaceRoot
    )

    $issues = New-Object System.Collections.Generic.List[string]

    foreach ($relativePath in $RelativePaths) {
        $fullPath = Join-Path -Path $WorkspaceRoot -ChildPath ($relativePath -replace '/', '\\')
        if (-not (Test-Path -LiteralPath $fullPath)) {
            continue
        }

        if ($relativePath -like '.github/agents/*.agent.md') {
            foreach ($issue in (Test-AgentFile -FullPath $fullPath -RelativePath $relativePath)) {
                $issues.Add($issue)
            }

            continue
        }

        if ($relativePath -like '.github/hooks/*.json') {
            foreach ($issue in (Test-HookConfigFile -FullPath $fullPath -RelativePath $relativePath)) {
                $issues.Add($issue)
            }
        }
    }

    return $issues
}

$hookInput = Get-HookInput
if ($null -eq $hookInput) {
    exit 0
}

$workspaceRoot = if ([string]::IsNullOrWhiteSpace($hookInput.cwd)) { Get-Location | Select-Object -ExpandProperty Path } else { $hookInput.cwd }
$allPaths = Get-ToolInputPaths -HookInput $hookInput -WorkspaceRoot $workspaceRoot
$governancePaths = @($allPaths | Where-Object { Test-GovernancePath -RelativePath $_ })

if ($hookInput.hookEventName -eq 'PreToolUse' -and (Test-EditLikeTool -ToolName $hookInput.tool_name) -and $governancePaths.Count -gt 0) {
    $pathList = ($governancePaths | Sort-Object -Unique) -join ', '
    Write-HookResult @{
        systemMessage = 'Casa governance files icin acik review gereklidir.'
        hookSpecificOutput = @{
            hookEventName = 'PreToolUse'
            permissionDecision = 'ask'
            permissionDecisionReason = 'Governance dosyalarinda degisiklik yapmadan once acik inceleme gerekir.'
            additionalContext = "Yuksek hassasiyetli dosyalar: $pathList"
        }
    }
}

if ($hookInput.hookEventName -eq 'PostToolUse' -and $governancePaths.Count -gt 0) {
    $issues = Test-GovernanceFiles -RelativePaths ($governancePaths | Sort-Object -Unique) -WorkspaceRoot $workspaceRoot
    if ($issues.Count -gt 0) {
        $issueText = ($issues | ForEach-Object { "- $_" }) -join "`n"
        Write-HookResult @{
            decision = 'block'
            reason = 'Casa governance policy kontrolu basarisiz oldu.'
            systemMessage = 'Casa policy hook ihlal tespit etti ve ek duzeltme istiyor.'
            hookSpecificOutput = @{
                hookEventName = 'PostToolUse'
                additionalContext = "Casa yonetisim policy ihlalleri tespit edildi:`n$issueText`nBu ihlalleri duzeltmeden gorevi tamamlanmis sayma."
            }
        }
    }
}

exit 0
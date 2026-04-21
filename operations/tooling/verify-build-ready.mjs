import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLING_ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(TOOLING_ROOT, '..', '..');
const APP_ROUTES_PATH = 'apps/web/src/app/app.routes.ts';
const EXPECTED_FIREBASE_PATHS = {
  firestoreIndexes: 'firestore.indexes.json',
  firestoreRules: 'firestore.rules',
  functionsSource: '../apps/functions',
  storageRules: 'storage.rules',
};
const REQUIRED_FIREBASE_EMULATORS = ['auth', 'firestore', 'functions', 'storage'];
const EXPECTED_DEFAULT_ROUTE_REDIRECTS = [
  {
    scopePath: ['auth'],
    redirectTo: 'login',
  },
  {
    scopePath: ['auth', 'onboarding'],
    redirectTo: 'welcome',
  },
  {
    scopePath: ['app'],
    redirectTo: 'learn',
  },
  {
    scopePath: ['ops'],
    redirectTo: 'content',
  },
];

const REQUIRED_FILES = [
  'package.json',
  'tsconfig.base.json',
  '.gitignore',
  'firebase/firebase.json',
  'operations/tooling/load-environment-file.mjs',
  'operations/tooling/README.md',
  'operations/tooling/resolve-firebase-project.mjs',
  'operations/tooling/validate-environment-binding.mjs',
  'operations/tooling/verify-build-ready.mjs',
  'operations/environments/dev/firebase.env.example',
  'operations/environments/staging/firebase.env.example',
  'operations/environments/prod/firebase.env.example',
  'apps/web/package.json',
  'apps/web/angular.json',
  'apps/web/tsconfig.json',
  'apps/web/tsconfig.app.json',
  'apps/web/src/index.html',
  'apps/web/src/main.ts',
  'apps/web/src/styles.css',
  'apps/web/src/app/app.component.ts',
  'apps/web/src/app/app.config.ts',
  APP_ROUTES_PATH,
  'apps/web/src/app/shells/public-shell.component.ts',
  'apps/web/src/app/shells/auth-onboarding-shell.component.ts',
  'apps/web/src/app/shells/app-shell.component.ts',
  'apps/web/src/app/shells/ops-shell.component.ts',
  'apps/web/src/app/routes/placeholder-page.component.ts',
  'apps/functions/package.json',
  'apps/functions/tsconfig.json',
  'apps/functions/src/index.ts',
  'apps/functions/src/modules/ops/models/build-ready-response.model.ts',
  'apps/functions/src/modules/ops/application/build-ready.service.ts',
  'apps/functions/src/modules/ops/handlers/build-ready.handler.ts',
];

const REQUIRED_ROOT_SCRIPTS = [
  'build',
  'build:web',
  'build:functions',
  'serve:web',
  'typecheck:web',
  'typecheck:functions',
  'typecheck',
  'env:check:local',
  'env:check:dev',
  'env:check:staging',
  'env:check:prod',
  'verify:build-ready',
  'emulators:start',
];

const REQUIRED_WEB_SCRIPTS = ['build', 'serve', 'typecheck'];
const REQUIRED_FUNCTION_SCRIPTS = ['build', 'typecheck'];
const REQUIRED_WORKSPACES = ['apps/web', 'apps/functions'];

const missingItems = [];
const invalidItems = [];

const getRepositoryPath = (relativePath) => path.join(REPOSITORY_ROOT, relativePath);

const readJson = (relativePath) => {
  const absolutePath = getRepositoryPath(relativePath);

  try {
    return JSON.parse(readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    invalidItems.push(`${relativePath}: ${(error instanceof Error ? error.message : String(error))}`);
    return null;
  }
};

const readText = (relativePath) => {
  const absolutePath = getRepositoryPath(relativePath);

  if (!existsSync(absolutePath)) {
    return null;
  }

  try {
    return readFileSync(absolutePath, 'utf8');
  } catch (error) {
    invalidItems.push(`${relativePath}: ${(error instanceof Error ? error.message : String(error))}`);
    return null;
  }
};

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractObjectBlockAtIndex = (source, markerIndex) => {
  const blockStart = source.lastIndexOf('{', markerIndex);

  if (blockStart === -1) {
    return null;
  }

  let depth = 0;

  for (let index = blockStart; index < source.length; index += 1) {
    const character = source[index];

    if (character === '{') {
      depth += 1;
    }

    if (character === '}') {
      depth -= 1;

      if (depth === 0) {
        return {
          content: source.slice(blockStart, index + 1),
          end: index + 1,
        };
      }
    }
  }

  return null;
};

const extractObjectBlockMatching = (source, markerPattern) => {
  const markerIndex = source.search(markerPattern);

  if (markerIndex === -1) {
    return null;
  }

  const block = extractObjectBlockAtIndex(source, markerIndex);
  return block?.content ?? null;
};

const findObjectBlocksMatching = (source, markerPattern) => {
  const matchingBlocks = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const markerOffset = source.slice(searchFrom).search(markerPattern);

    if (markerOffset === -1) {
      break;
    }

    const block = extractObjectBlockAtIndex(source, searchFrom + markerOffset);

    if (!block) {
      break;
    }

    matchingBlocks.push(block.content);
    searchFrom = block.end;
  }

  return matchingBlocks;
};

const createRoutePathPattern = (routePath) =>
  new RegExp(`path:\\s*['\"]${escapeForRegExp(routePath)}['\"]`);

const getRouteScopeBlock = (source, scopePath) => {
  let scopeBlock = source;

  for (const routePath of scopePath) {
    const nextScopeBlock = extractObjectBlockMatching(scopeBlock, createRoutePathPattern(routePath));

    if (!nextScopeBlock) {
      return null;
    }

    scopeBlock = nextScopeBlock;
  }

  return scopeBlock;
};

const validateDefaultRouteRedirect = (source, { scopePath, redirectTo }) => {
  const scopeLabel = scopePath.join('/');
  const scopeBlock = getRouteScopeBlock(source, scopePath);

  if (!scopeBlock) {
    invalidItems.push(`${APP_ROUTES_PATH}: missing route block for ${scopeLabel}`);
    return;
  }

  const redirectPattern = new RegExp(`redirectTo:\\s*['\"]${escapeForRegExp(redirectTo)}['\"]`);
  const hasExpectedRedirect = findObjectBlocksMatching(scopeBlock, /path:\s*(?:''|"")/).some(
    (routeBlock) => /pathMatch:\s*['\"]full['\"]/.test(routeBlock) && redirectPattern.test(routeBlock),
  );

  if (!hasExpectedRedirect) {
    invalidItems.push(`${APP_ROUTES_PATH}: expected default redirect ${scopeLabel} -> ${redirectTo}`);
  }
};

for (const relativePath of REQUIRED_FILES) {
  if (!existsSync(getRepositoryPath(relativePath))) {
    missingItems.push(relativePath);
  }
}

const rootPackageJson = readJson('package.json');
const webPackageJson = readJson('apps/web/package.json');
const functionsPackageJson = readJson('apps/functions/package.json');
const angularJson = readJson('apps/web/angular.json');
const webTsconfigJson = readJson('apps/web/tsconfig.json');
const webAppTsconfigJson = readJson('apps/web/tsconfig.app.json');
const functionsTsconfigJson = readJson('apps/functions/tsconfig.json');
const baseTsconfigJson = readJson('tsconfig.base.json');
const firebaseJson = readJson('firebase/firebase.json');
const appRoutesSource = readText(APP_ROUTES_PATH);
const gitignoreSource = readText('.gitignore');

const hasScript = (packageJson, scriptName) => typeof packageJson?.scripts?.[scriptName] === 'string';
const hasDependency = (packageJson, dependencyName) => typeof packageJson?.dependencies?.[dependencyName] === 'string';

for (const workspaceName of REQUIRED_WORKSPACES) {
  if (!rootPackageJson?.workspaces?.includes(workspaceName)) {
    invalidItems.push(`package.json: missing workspace ${workspaceName}`);
  }
}

for (const scriptName of REQUIRED_ROOT_SCRIPTS) {
  if (!hasScript(rootPackageJson, scriptName)) {
    invalidItems.push(`package.json: missing script ${scriptName}`);
  }
}

for (const scriptName of REQUIRED_WEB_SCRIPTS) {
  if (!hasScript(webPackageJson, scriptName)) {
    invalidItems.push(`apps/web/package.json: missing script ${scriptName}`);
  }
}

for (const scriptName of REQUIRED_FUNCTION_SCRIPTS) {
  if (!hasScript(functionsPackageJson, scriptName)) {
    invalidItems.push(`apps/functions/package.json: missing script ${scriptName}`);
  }
}

if (!hasDependency(functionsPackageJson, 'firebase-functions')) {
  invalidItems.push('apps/functions/package.json: missing dependency firebase-functions');
}

if (!hasDependency(functionsPackageJson, 'firebase-admin')) {
  invalidItems.push('apps/functions/package.json: missing dependency firebase-admin');
}

if (functionsPackageJson?.engines?.node !== '20') {
  invalidItems.push('apps/functions/package.json: engines.node must be 20');
}

if (!rootPackageJson?.devDependencies?.['firebase-tools']) {
  invalidItems.push('package.json: missing devDependency firebase-tools');
}

if (!angularJson?.projects?.['casa-web']) {
  invalidItems.push('apps/web/angular.json: missing casa-web project');
}

if (!webTsconfigJson?.extends || !webAppTsconfigJson?.extends || !functionsTsconfigJson?.extends || !baseTsconfigJson?.compilerOptions || !firebaseJson?.emulators) {
  invalidItems.push('One or more config files are missing expected structural keys.');
}

if (firebaseJson) {
  if (firebaseJson.firestore?.rules !== EXPECTED_FIREBASE_PATHS.firestoreRules) {
    invalidItems.push(
      `firebase/firebase.json: firestore.rules must be ${EXPECTED_FIREBASE_PATHS.firestoreRules}`,
    );
  }

  if (firebaseJson.firestore?.indexes !== EXPECTED_FIREBASE_PATHS.firestoreIndexes) {
    invalidItems.push(
      `firebase/firebase.json: firestore.indexes must be ${EXPECTED_FIREBASE_PATHS.firestoreIndexes}`,
    );
  }

  if (firebaseJson.storage?.rules !== EXPECTED_FIREBASE_PATHS.storageRules) {
    invalidItems.push(
      `firebase/firebase.json: storage.rules must be ${EXPECTED_FIREBASE_PATHS.storageRules}`,
    );
  }

  if (firebaseJson.functions?.source !== EXPECTED_FIREBASE_PATHS.functionsSource) {
    invalidItems.push(
      `firebase/firebase.json: functions.source must be ${EXPECTED_FIREBASE_PATHS.functionsSource}`,
    );
  }

  for (const emulatorName of REQUIRED_FIREBASE_EMULATORS) {
    if (!firebaseJson.emulators?.[emulatorName]) {
      invalidItems.push(`firebase/firebase.json: missing emulator ${emulatorName}`);
    }
  }

  if (firebaseJson.emulators?.hosting && !firebaseJson.hosting) {
    invalidItems.push('firebase/firebase.json: hosting emulator requires hosting config');
  }
}

if (!gitignoreSource?.split(/\r?\n/u).some((line) => line.trim() === 'operations/environments/**/.env')) {
  invalidItems.push('.gitignore: missing ignore rule operations/environments/**/.env');
}

if (appRoutesSource) {
  for (const routeRedirect of EXPECTED_DEFAULT_ROUTE_REDIRECTS) {
    validateDefaultRouteRedirect(appRoutesSource, routeRedirect);
  }
}

if (missingItems.length > 0 || invalidItems.length > 0) {
  console.error('[verify-build-ready] Structural verification failed.');

  if (missingItems.length > 0) {
    console.error('[verify-build-ready] Missing files:');

    for (const relativePath of missingItems) {
      console.error(`- ${relativePath}`);
    }
  }

  if (invalidItems.length > 0) {
    console.error('[verify-build-ready] Invalid configuration:');

    for (const item of invalidItems) {
      console.error(`- ${item}`);
    }
  }

  process.exit(1);
}

console.log('[verify-build-ready] Structural verification passed.');
console.log('[verify-build-ready] Root workspace, app manifests, Firebase config, and environment examples are present.');
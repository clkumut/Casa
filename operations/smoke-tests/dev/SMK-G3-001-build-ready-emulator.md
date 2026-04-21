# SMK-G3-001 Build Ready Emulator Smoke

## Kayit Kimligi

| Alan | Deger |
| --- | --- |
| Smoke ID | SMK-G3-001 |
| Tarih | 2026-04-21 |
| Ortam | Local emulator / Dev smoke family |
| Bagli Work Package | [../../../docs/delivery/work-packages/WP-002-repo-and-environment-scaffold.md](../../../docs/delivery/work-packages/WP-002-repo-and-environment-scaffold.md) |
| Bagli Evidence | [../../../docs/evidence/gates/EVD-G3-001-build-ready.md](../../../docs/evidence/gates/EVD-G3-001-build-ready.md) |
| Yurutucu | CTO |

## Kapsam

WP-002 scaffold asamasinda tam feature yolculuklari henuz acik degildir. Bu smoke kaydi, local Firebase Emulator Suite startup'inin ve `buildReady` HTTP function endpoint'inin calistigini kanitlar.

## Calistirilan Komutlar

1. `npm run emulators:start`
2. `Invoke-WebRequest -Uri "http://127.0.0.1:5001/demo-casa-local/us-central1/buildReady"`

## Sonuc Ozeti

- Auth, Functions, Firestore ve Storage emulatorleri basariyla kalkti.
- `buildReady` function `http://127.0.0.1:5001/demo-casa-local/us-central1/buildReady` adresinde initialize oldu.
- HTTP cevap `200` dondu.
- JSON payload `status: ok`, `scope: structural-scaffold` ve toolchain check alanlarini dogruladi.

## Gozlemler

- Firebase CLI, host Node `24` ile Functions `engines.node = 20` arasinda warning verdi; buna ragmen function emulator yuklendi ve smoke cevabi alindi.
- Bu kayit full feature smoke degil; G3 build-ready kapsamindaki minimum emulator runtime kanitidir.

## Cikti Ozetleri

```text
All emulators ready! It is now safe to connect your app.
functions[us-central1-buildReady]: http function initialized (http://127.0.0.1:5001/demo-casa-local/us-central1/buildReady).
```

```json
{
  "status": "ok",
  "workspace": "casa",
  "service": "functions",
  "scope": "structural-scaffold",
  "timestamp": "2026-04-21T20:35:02.859Z",
  "checks": {
    "environmentBinding": "env-var-based",
    "workspaceManifest": true,
    "webToolchain": true,
    "functionsToolchain": true
  }
}
```
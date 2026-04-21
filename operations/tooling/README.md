# Tooling

Bu klasor, WP-002 ve G3 build-ready hazirligi icin repo seviyesinde kullanilan yardimci scriptleri barindirir.

## Scriptler

- `load-environment-file.mjs`: `local`, `dev`, `staging` ve `prod` hedefleri icin `operations/environments/<env>/.env` dosyasini varsa yukler. `local` icin no-op davranir ve mevcut `process.env` degerlerini ezmez.
- `resolve-firebase-project.mjs`: `local`, `dev`, `staging` ve `prod` hedefleri icin Firebase proje kimligini cozer. `local` icin guvenli sentinel `demo-casa-local` kullanilir. `dev`, `staging` ve `prod` icin ilgili environment variable zorunludur.
- `validate-environment-binding.mjs`: Bir ortam icin gerekli Firebase binding degiskenlerinin tanimli olup olmadigini kontrol eder. Local ortamda gercek proje kimligi beklemez.
- `verify-build-ready.mjs`: Root workspace manifestleri, web/functions toolchain manifestleri, Firebase config dosyalari ve environment example dosyalarinin fiziksel olarak mevcut oldugunu dogrular.

`resolve-firebase-project.mjs` ve `validate-environment-binding.mjs` once ilgili `.env` dosyasini yuklemeyi dener; CI veya shell uzerinden tanimli `process.env` degerleri varsa bunlari korur.

## Beklenen Kullanim

Root klasorde `npm install` sonrasinda asagidaki komutlar kullanilir:

- `npm run verify:build-ready`
- `npm run env:check:local`
- `npm run env:check:dev`
- `npm run env:check:staging`
- `npm run env:check:prod`
- `npm run emulators:start`

Gercek ortam degerleri `operations/environments/<env>/.env` dosyasindan veya CI secret ortamindan saglanabilir.

Analytics kullaniliyorsa `CASA_FIREBASE_MEASUREMENT_ID_<ENV>` degiskeni opsiyonel olarak korunabilir; validate akisi bunu zorunlu tutmaz.

Bu scriptler yapisal hazirlik saglar; emulator smoke ve gate kaniti ayrica toplanmalidir.
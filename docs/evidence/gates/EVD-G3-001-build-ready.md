# EVD-G3-001 Build Ready

## Kayit Kimligi

| Alan | Deger |
| --- | --- |
| EVD ID | EVD-G3-001 |
| Gate | G3 Build Ready |
| Durum | Pass |
| Bagli ORD | [../../orders/ORD-002-repo-and-environment-scaffold.md](../../orders/ORD-002-repo-and-environment-scaffold.md) |
| Bagli Work Package | [../../delivery/work-packages/WP-002-repo-and-environment-scaffold.md](../../delivery/work-packages/WP-002-repo-and-environment-scaffold.md) |
| Bagli Approval | [../../approvals/gates/APR-G3-001-build-ready.md](../../approvals/gates/APR-G3-001-build-ready.md) |
| Tarih | 2026-04-21 |
| Sahip | Tech Lead |

## Durum Ozeti

Workspace manifestleri, Angular web toolchain girisleri, Functions build girisleri ve environment binding scaffold'i repo icinde toplandi. `npm install`, `npm run env:check:local`, `npm run verify:build-ready`, `npm run typecheck` ve `npm run build` komut ciktilari toplandi. Local Firebase Emulator Suite basariyla kalkti ve `buildReady` endpoint smoke cevabi kayda girdi. Tech Lead, DevOps ve QA review'lari blocker bulmadi; G3 Build Ready evidence paketi onay zincirinden gecti.

## Mevcut Gozlemler

- `apps`, `firebase` ve `operations` klasorleri mevcut.
- `firebase` baseline artefact'lari repo icinde yer aliyor.
- Root `package.json`, `tsconfig.base.json` ve `.gitignore` ile workspace script girisleri gozleniyor.
- `operations/tooling` altinda `resolve-firebase-project`, `validate-environment-binding` ve `verify-build-ready` scriptleri gozleniyor.
- `verify-build-ready` Firebase config semantigini, Functions bagimlilik hizasini (`firebase-functions`, `firebase-admin`, `engines.node`) ve varsayilan route redirect guard'larini (`auth/login`, `auth/onboarding/welcome`, `app/learn`, `ops/content`) statik olarak kontrol ediyor.
- `apps/web` altinda Angular standalone shell/router scaffold'i ile build, serve ve typecheck manifestleri gozleniyor; varsayilan redirectler `auth`, `auth/onboarding`, `app` ve `ops` altinda tanimli.
- `apps/functions` altinda build/typecheck manifestleri ve `buildReady` ops HTTP handler scaffold'i gozleniyor.
- Local emulator scripti icin `demo-casa-local` sentinel project kullaniliyor; dev/staging/prod ortam kimlikleri environment variable ile baglanacak sekilde tanimlaniyor.
- Root bagimlilik kurulumu tamamlandi; host ortaminda Node `24.14.0` ve npm `11.9.0` ile `npm install` basarili calisti.
- `npm run env:check:local`, `npm run verify:build-ready`, `npm run typecheck` ve `npm run build` komutlari basariyla gecti.
- `npm run emulators:start` auth, functions, firestore ve storage emulatorlerini ayaga kaldirdi; `buildReady` endpoint'i `http://127.0.0.1:5001/demo-casa-local/us-central1/buildReady` adresinde initialize oldu.
- `buildReady` smoke istegi HTTP `200` ve `status: ok` payload'i ile dondu.

## Calistirilmis Dogrulama Kaydi

| Komut | Sonuc | Not |
| --- | --- | --- |
| `npm install` | Pass | Bagimliliklar yuklendi; `@casa/functions` icin host Node `24` ve `engines.node = 20` uyari notu goruldu |
| `npm run env:check:local` | Pass | Local sentinel project `demo-casa-local` dogrulandi |
| `npm run verify:build-ready` | Pass | Root workspace, Firebase config ve app manifestleri dogrulandi |
| `npm run typecheck` | Pass | Web ve Functions TypeScript denetimi temiz gecti |
| `npm run build` | Pass | Angular web bundle ve Functions derlemesi tamamlandi |

## Emulator ve Smoke Kaydi

- Emulator runtime kaniti ve HTTP smoke sonucu [../../../operations/smoke-tests/dev/SMK-G3-001-build-ready-emulator.md](../../../operations/smoke-tests/dev/SMK-G3-001-build-ready-emulator.md) kaydinda tutulur.
- Emulator Suite startup sonucu auth (`9099`), firestore (`8080`), functions (`5001`), storage (`9199`) ve Emulator UI (`4000`) portlariyla toplandi.
- `buildReady` endpoint'i scope icinde olan minimum G3 runtime smoke sinyalini verdi.

## Risk ve Notlar

- Firebase Functions emulatoru host Node `24` ile calisti; proje `engines.node = 20` bekledigi icin local/CI ortam standardizasyonu review notu olarak izlenmelidir.
- Dev, staging ve prod ortam degerleri repo icinde tutulmaz; [../../ops/firebase-environments.md](../../ops/firebase-environments.md) ve `operations/environments/*/firebase.env.example` uzerinden secret manager veya CI baglantisi beklenir.

## Sign-Off Sonucu

| Rol | Sonuc | Not |
| --- | --- | --- |
| Tech Lead | Approved | Teknik blocker bulunmadi |
| DevOps | Approved | Environment ve emulator readiness yeterli bulundu |
| QA | Approved | WP-002 scope'una uygun minimal smoke yeterli bulundu |

## Gerekli Kanitlar

- Gercek environment binding ve ortam ayrimi kaniti
- `npm run verify:build-ready` ve gerekli env check komutlarinin calistirilmis cikti kaydi
- Emulator calistirma ve smoke sonuc kayitlari
- G3 checklist'ine bagli eksiklerin kapatildigini gosteren notlar

## Acik Eksikler

- G3 gate sonucunu engelleyen acik eksik kalmadi.

## Sonraki Adim

- Plan sirasina gore WP-003 Auth and Onboarding execution girisine gecilir.
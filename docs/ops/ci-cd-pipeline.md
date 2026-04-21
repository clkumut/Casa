# CI/CD Pipeline

## Hedef

CI/CD, V1'in build, test, rule, emulator ve release kanit gereksinimlerini otomatiklestirir. Deploy sadece derleme basarisi ile degil; evidence ve approval zinciriyle birlikte ilerler.

## Pipeline Asamalari

| Asama | Amaç | Zorunlu Cikis |
| --- | --- | --- |
| Source validation | Dokuman ve repo policy kontrolu | Governance uyumsuzlugu yok |
| Web quality | Lint, type-check, unit test | Angular katmani temiz |
| Function quality | Lint, unit, integration | Trusted write mantigi temiz |
| Rules and indexes | Rule testleri, index senkronu | Yetki davranisi dogru |
| Emulator smoke | Kritik user journey | Auth, lesson, quest, purchase akislari gecti |
| Staging deploy | Release adayi | EVD kaydi icin teknik cikti |
| Approval hold | QA, Security, PM sign-off | APR baglantisi hazir |
| Production deploy | G5 sonrasi canli cikis | Release evidence tamam |

## Tetikleyiciler

- Pull request: kalite ve emulator asamalari
- Main veya release branch'e terfi: staging deploy adayi
- Manual approved release: production deploy

## Artefact Ciktilari

- Test raporlari
- Rule test raporlari
- Emulator smoke ozeti
- Deploy ozeti
- EVD referans kimligi

## Basarisizlik Davranisi

- Rule testi kalirsa pipeline deploy etmez.
- Emulator smoke kalirsa staging veya prod deploy'a gecilmez.
- Approval hold eksikse production adimi bloke kalir.

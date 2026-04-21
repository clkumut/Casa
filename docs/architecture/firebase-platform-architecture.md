# Firebase Platform Architecture

## Platform Prensibi

Firebase, Casa V1'in hem uygulama veri omurgasi hem de trusted backend katmanidir. Auth, Firestore, Functions, Storage, Analytics ve Emulator Suite birlikte ele alinir; hicbir kritik akista placeholder veya ara backend varsayilmaz.

## Servis Bazli Rolu

| Servis | Rol |
| --- | --- |
| Firebase Authentication | Kimlik dogrulama, session, custom claims |
| Firestore | Katalog, kullanici snapshot, projection, event ve edge belgeleri |
| Cloud Functions | Trusted writes, scheduler, projection refresh, publish flow |
| Storage | Ses dosyalari, gorsel varliklar, ogrenme medya asset'leri |
| Analytics | Funnel, retention, feature usage ve release sonrasi olcum |
| Emulator Suite | Yerel auth, firestore, functions, storage ve rules dogrulamasi |

## Auth Mimarisi

- V1 kimlik kaynagi Firebase Authentication'dir.
- Uygulama icindeki rol farklari custom claim ile temsil edilir: `learner`, `opsPublisher`, `opsReleaseManager`, `platformAdmin`.
- Firestore kurallari kimlik ve claim bazli ayrim yapar.
- Onboarding tamamlanma durumu auth claim yerine user snapshot'ta tutulur; route guard buna gore hareket eder.

## Firestore Kullanimi

- Katalog verileri versiyonlu ve publish durumda tutulur.
- Kullaniciya ozel durumlar snapshot veya projection olarak saklanir.
- Her trusted komut once event veya command belgesi uretir, sonra function snapshot/projection gunceller.
- Heavy hesaplamalar istemciye birakilmaz.

## Cloud Functions Kategorileri

| Kategori | Sorumluluk |
| --- | --- |
| Callable commands | Lesson completion, quest claim, purchase, social accept |
| Event processors | Completion event -> progression/XP/achievement update |
| Scheduled jobs | League rollover, streak repair, projection cleanup |
| Ops flows | Content publish, catalog activation, release evidence hooks |

## Rules ve Indexes

- Firestore rules `published catalog read`, `self snapshot read`, `limited self preference write`, `ops claim write` cizgisiyle kurulur.
- Composite index ihtiyaclari leaderboard, quest lookup, practice queue ve catalog order query'leri etrafinda tanimlanir.
- Rules testleri emulator icinde gate kosuludur.

## Storage Stratejisi

- ElifBa ses dosyalari, lesson medya varliklari ve ops tarafindan yayinlanan gorseller Storage'da tutulur.
- Storage path yapisi katalog kimligi ve surum bilgisiyle izlenebilir olur.
- Public ve authenticated asset erisimi ayri rule sinirlarina sahip olur.

## Emulator Yaklasimi

- Yerel calismada Auth, Firestore, Functions ve Storage emulator birlikte kalkar.
- Seed veri emulator'e ayni katalog/snapshot sinifiyla yuklenir.
- Non-prod veri stratejisi production PII kopyalamadan pseudonymous test kullanicilari uretir.

## Analytics Yaklasimi

- Ogrenme funnel'i: landing -> register/login -> onboarding -> first lesson -> first quest claim
- Gunluk kullanim: active day, streak carry, practice recovery, shop purchase, social accept
- Analytics parametreleri PII icermez; content ve unit kimlikleri teknik anahtar olarak tasinir.

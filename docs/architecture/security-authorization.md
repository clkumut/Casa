# Security and Authorization

## Guvenlik Hedefi

V1, Firebase merkezli mimari icinde en az ayricalik, trusted write ve veri minimizasyonu ilkeleriyle calisir. Kimlik dogrulama Firebase Authentication, veri yetkisi Firestore Rules, kritik mutasyonlar Cloud Functions ile korunur.

## Rol Modeli

| Rol | Kaynak | Yetki |
| --- | --- | --- |
| Anonymous | Auth olmayan | PublicShell ve sinirli public catalog read |
| Learner | Auth + default claim | Kendi snapshot'larini okuma, sinirli profil/tercih yazimi |
| OpsPublisher | Custom claim | Katalog taslak ve publish akisina erisim |
| OpsReleaseManager | Custom claim | Release ve operational readiness akisina erisim |
| PlatformAdmin | Custom claim | Acil operasyon, audit gorunumu, role yonetimi |

## Route Yetkilendirmesi

- PublicShell: auth gerekmez
- AuthOnboardingShell: login/register guest-only, onboarding auth zorunlu
- AppShell: auth zorunlu, onboarding tamamlanmadiysa onboarding'e geri yonlendirilir
- OpsShell: auth + ops claim zorunlu

## Firestore Rule Cizgisi

| Veri Sinifi | Okuma | Yazma |
| --- | --- | --- |
| Published catalog | Public veya auth'lu read, ihtiyaca gore sinirli | OpsPublisher/PlatformAdmin |
| User profile snapshot | Sadece sahibi | Sinirli self-write + function write |
| Progression, right rail, quest, achievement, inventory | Sadece sahibi | Yalniz function |
| League projections | Auth'lu read | Yalniz function/scheduler |
| Social edges | Ilgili kullanicilarin sinirli read'i | Yalniz function |
| Ops event ve audit | Ops roller | Ops function |

## Trusted Mutation Listesi

- Lesson completion ve XP yazimi
- Streak hesaplama ve guncelleme
- Hearts azaltma ve geri yukleme
- Gems kazanma ve harcama
- Quest claim ve reward dagitimi
- Purchase, inventory unlock ve aktif kozmetik secimi
- Friend request acceptance, decline, block ve social stats guncellemesi
- Leaderboard ve league projection hesaplari

## Veri Koruma Kurallari

- Production PII non-prod ortamlara kopyalanmaz.
- Analytics olaylari acik e-posta, tam ad veya serbest metin tasimaz.
- Ops ve audit olaylari actor kimligini ve hedef ref'i izler.
- Storage asset kurallari public ve authenticated varliklari ayirir.

## Guvenlik Testleri

| Alan | Zorunlu Test |
| --- | --- |
| Firestore rules | Self-read/write, cross-user deny, ops claim allow |
| Functions auth | Auth zorunlulugu, role dogrulamasi, idempotency |
| Analytics | PII alan kontrolu |
| Social graph | Yetkisiz accept/decline denemelerinin reddi |
| Shop and economy | Negative balance ve duplicate claim engeli |

## Audit ve Incident Hazirligi

- Ops veya guvenlik etkili her islem `ops_audit_events` altina kaydedilir.
- Release oncesi guvenlik onayi G5 gate'in zorunlu imzalarindan biridir.
- Tespit edilen ihlal, risk register ve APR kaydina capraz referansla islenir.

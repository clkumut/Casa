# WP-005 Trusted Learning Completion

## Amac

Ders tamamlama, ilerleme, XP ve heart ekonomisini trusted write modeline bagli sekilde calisan bir ogrenme kapanis zincirine donusturmek.

## Durum

`Planned`

## Bagli Emir

- Henuz atanmadi. Resmi execution icin yeni ORD acilacak.

## Dayandigi Kararlar

- ADR-004 Firebase Trusted Write Model
- ADR-005 Firestore Document Granularity and Projections
- ADR-006 Curriculum Prerequisite Graph and V1 Cut
- ADR-007 Gamification Economy Quest League Projections
- ADR-008 Security Rules and Role Model

## Kapsam

- Lesson completion trusted write akisi
- Progression ve ogrenme durumu guncellemeleri
- XP ve heart ekonomi yansimalari

## Kapsam Disi

- Quest, shop ve league odul dagitimi
- Sosyal graph etkileri

## Bagimliliklar

- [WP-003-auth-and-onboarding.md](./WP-003-auth-and-onboarding.md)
- [WP-004-curriculum-catalog-and-learning-map.md](./WP-004-curriculum-catalog-and-learning-map.md)

## Baslangic Kriterleri

- Auth akislarinin guvenli kullanici baglami saglanmis olmali
- Curriculum katalogu ve learning map delivery olarak hazir olmali

## Cikis Kriterleri

- Trusted write akislarinin veri ve guvenlik sinirlari uygulanmis olmali
- Lesson completion sonucu progression ve ekonomi etkileri gozlenebilir olmali
- Ilgili test ve audit kanitlari toplanmis olmali

## Beklenen Kanitlar

- Trusted write entegrasyon kaniti
- Progression ve economy smoke kayitlari
- Rule ve audit log dogrulamasi

## Gerekli Onaylar

- Tech Lead
- Security
- QA

## Notlar

- Bu slice V1 cekirdegidir; onceki work package'lar tamamlanmadan baslatilmaz.
- Resmi ORD henuz acilmadigi icin WP durumu governance geregi `Planned` seviyesinde kalir.
- Teknik temel dilimi olarak `completeLesson` callable export edildi; idempotent request anahtari ile `learning_completion_events`, `progressionSnapshots/default` ve `rightRailSnapshots/default` guncelleme zinciri acildi.
- Lesson execution route icinde ilk challenge gate ve minimal completion CTA'si baglandi; sonraki delivery adimi challenge motoru, emulator smoke ve guvenlik sign-off'unu tamamlamaktir.
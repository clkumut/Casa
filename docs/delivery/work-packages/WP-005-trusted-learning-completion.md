# WP-005 Trusted Learning Completion

## Amac

Ders tamamlama, ilerleme, XP ve heart ekonomisini trusted write modeline bagli sekilde calisan bir ogrenme kapanis zincirine donusturmek.

## Durum

`In Progress`

## Bagli Emir

- [../../orders/ORD-004-trusted-learning-completion.md](../../orders/ORD-004-trusted-learning-completion.md)
- [../../evidence/gates/EVD-G4-001-wp-005-close.md](../../evidence/gates/EVD-G4-001-wp-005-close.md)
- [../../approvals/gates/APR-G4-001-wp-005-close.md](../../approvals/gates/APR-G4-001-wp-005-close.md)

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
- Resmi ORD acildi; WP-005 execution sirasinda emulator smoke ve sign-off kaniti toplanacak.
- Teknik temel dilimi olarak `completeLesson` callable export edildi; idempotent request anahtari ile `learning_completion_events`, `progressionSnapshots/default` ve `rightRailSnapshots/default` guncelleme zinciri acildi.
- `SMK-WP-005-001` smoke kaydi ile `startLessonChallenge` ve `completeLesson` callable'lari emulator ortaminda dogrulandi; lesson completion sonrasi progression ilerlemesi ve XP/hearts projection guncellemesi kanita baglandi.
- `SMK-WP-005-002` smoke kaydi ile authenticated client'in progression, right rail, completion event ve challenge attempt write denemelerinin `permission-denied` ile reddedildigi kanita baglandi.
- G4 close kaydi acildi; mevcut resmi blocker QA sign-off ve PM kapanis onayidir.
- Sonraki delivery adimi, QA sign-off'u tamamlayip PM ile WP-005 kapanis kararini vermektir.
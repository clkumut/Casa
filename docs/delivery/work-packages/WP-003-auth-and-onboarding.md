# WP-003 Auth and Onboarding

## Amac

V1 kullanicisinin sisteme giris, kayit, ilk profil olusturma ve rol-temelli onboarding akislarini tanimlanmis guvenlik sinirlari icinde hayata gecirmek.

## Durum

`In Progress`

## Bagli Emir

- [../../orders/ORD-003-auth-and-onboarding.md](../../orders/ORD-003-auth-and-onboarding.md)

## Dayandigi Kararlar

- DEC-002 V1 Scope Baseline
- ADR-002 Shell and Routing Strategy
- ADR-003 Frontend Layering and Firebase Boundary
- ADR-004 Firebase Trusted Write Model
- ADR-008 Security Rules and Role Model

## Kapsam

- Login, register ve temel onboarding ekranlari
- Yetki kontrollu route/shell gecisleri
- Profil olusturma ve minimum kullanici bootstrap akisi

## Kapsam Disi

- Sosyal graph islevleri
- Quest, leaderboard ve economy akislarinin UI/logic entegrasyonu
- Production release hardening'i

## Bagimliliklar

- [WP-002-repo-and-environment-scaffold.md](./WP-002-repo-and-environment-scaffold.md)

## Baslangic Kriterleri

- G3 build-ready seviyesinde calisan scaffold mevcut olmali
- Guvenlik ve trusted write sinirlari mimari olarak dondurulmus olmali

## Cikis Kriterleri

- Auth ve onboarding akislarinin teknik tasarimi ve uygulama slice'i tamamlanmis olmali
- Smoke ve guvenlik kontrolleri icin kanit listesi hazir olmali
- Ilgili ORD ve gate kayitlari acilmis olmali

## Beklenen Kanitlar

- Auth smoke testleri
- Guvenlik ve rule kontrol kanitlari
- Feature-level release notlari

## Gerekli Onaylar

- Tech Lead
- Security
- QA

## Notlar

- ORD-003 acildi ve resmi execution baglami tanimlandi.
- Ilk uygulama slice'i olarak auth session state ve route guard ailesi uygulama cekirdegine baglaniyor.
# ORD-003 Auth and Onboarding

## Emir Kimligi

| Alan | Deger |
| --- | --- |
| Emir ID | ORD-003 |
| Tarih | 2026-04-21 |
| Durum | Open |
| Emir Sahibi | Project Manager |
| Teknik Sahip | Tech Lead |
| Bagli Work Package | [../delivery/work-packages/WP-003-auth-and-onboarding.md](../delivery/work-packages/WP-003-auth-and-onboarding.md) |

## Emrin Amaci

Casa V1 kullanicisinin login, register ve onboarding akislarini resmi delivery slice'i olarak acmak; auth route sinirlarini ve minimum kullanici bootstrap omurgasini guvenlik kararlarina uygun sekilde uygulamaya tasimak.

## Kapsam

- Auth ve onboarding route ailelerini guest-only, auth ve onboarding guard sinirlariyla acmak
- Minimum auth session state omurgasini `core/state` ve `core/auth` altinda kurmak
- Login/register ve onboarding feature execution'u icin resmi delivery baglamini olusturmak

## Kapsam Disi

- Quest, leaderboard, shop ve social feature implementasyonu
- Trusted economy/progression command'larinin tamamlanmasi
- Production release hardening'i

## Mevcut Durum

- G3 build-ready gate'i kapandi ve WP-002 tamamlandi.
- Angular shell/router scaffold'i mevcut; auth route'lari placeholder seviyesinde acik durumda.
- Auth session state ve route guard ailesi henuz uygulama cekirdegine baglanmadi.

## Beklenen Ciktilar

- Guest-only, auth, onboarding ve ops role guard ailelerinin uygulama cekirdeginde gozlenebilir hale gelmesi
- Auth ve onboarding feature'lari icin minimum teknik slice'in build/typecheck seviyesinde dogrulanmasi
- WP-003 icin smoke, guvenlik ve evidence checklist'inin acilmasi

## Kapanis Icin Gerekli Kanit

- Auth smoke testleri
- Guvenlik ve rule kontrol kanitlari
- Feature-level release notlari

## Onay Zinciri

- G4 / WP-003: Tech Lead, Security, QA

## Notlar

- Bu emir, G3 sonrasi ilk feature execution slice'ini resmi delivery takibine alir.
- Auth ve onboarding implementasyonu trusted write ve rule kararlarina bagli kalacaktir.
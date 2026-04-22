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
- Angular shell/router scaffold'i artik auth feature sayfalari ile bagli ve placeholder seviyesinden cikti.
- Auth session state, runtime config ve route guard ailesi uygulama cekirdegine baglandi.
- Firebase Auth ile login/register/sign-out aksiyonlari browser istemcisinde calisir durumda.
- `users/{uid}` snapshot'indaki onboarding durumu auth session'a baglandi ve authenticated route kararları snapshot cozulmesini bekliyor.
- Firebase SDK dinamik yukleme ile initial bundle budget tekrar uyumlu hale getirildi.
- Onboarding feature read modeli, kullanici draft belgesi ile `catalog_onboarding_options` okumalarini facade uzerinden birlestiriyor ve step route'lari artik bu veriyle render oluyor.
- Firestore rules, onboarding catalog read ve self user snapshot read'i aciyor; sinirli draft self-write alanlari gelecekteki save slice'i icin hazirlandi.
- Onboarding step save akisi self-write ile acildi, `finalizeOnboarding` callable'i functions tarafinda export edildi ve emulator yuklemesinde dogrulandi.
- Progress guard eksik onboarding step'ini dogrudan hedefliyor; tamamlanmamis ama tum secimleri dolu kullanici welcome summary uzerinden finalize ediliyor.
- AppShell right rail projection baglantisi acildi; `users/{uid}/rightRailSnapshots/default` sahibi tarafindan okunuyor ve shell bootstrap'i resolver ile ilk projection yukunu bekliyor.
- `SMK-WP-003-001` smoke testi `finalizeOnboarding` callable'inin `completed` ve `already-complete` durumlarini emulator ortaminda dogruladi.
- `/app/learn` placeholder'i kaldirildi; progression snapshot projection'i repository + facade akisi ile gercek learn bootstrap sayfasina baglandi.
- Firestore rules `users/{uid}/progressionSnapshots/*` owner-read izniyle bu bootstrap okumasini destekliyor.
- Learn bootstrap, current `catalog_learning_worlds`, `catalog_learning_chapters` ve `catalog_learning_units` belgelerini progression snapshot ile ayni read modelde cozmeye basladi.
- Firestore rules ilgili learning catalog koleksiyonlari icin public read izniyle bu merkez-stage okumasini destekliyor.
- `/app/learn` published world/chapter/unit listelerini render ediyor ve current progression bagina gore ilgili chapter ile unit kesitini merkez-stage'de gosteriyor.
- Unit prerequisite refs, learn liste gorunumunde ilk onkosul ipucu olarak acildi.
- Siradaki slice, `/app/learn/world/:worldId` ve `/app/learn/unit/:unitId` route ailelerini acarak liste gorunumunden detay akisina gecmektir.

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
- Chat iletisimi ve execution disiplini, governance charter ve DEC-003 guncellemeleriyle sirali ve kisa durum akisi olarak sabitlendi.
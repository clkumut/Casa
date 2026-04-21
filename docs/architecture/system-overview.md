# System Overview

## Hedef Mimari Ozet

Casa V1, Angular tabanli tek web istemcisi ve Firebase merkezli backend yaklasimi uzerine kurulur. Sistem, public experience ile authenticated ogrenme urununu shell bazinda ayirir; veri, kimlik, trusted mutasyon, katalog yayinlama ve operasyonel izler Firebase servisleri uzerinden koordine edilir.

## Ana Bilesenler

| Katman | Bilesen | Sorumluluk |
| --- | --- | --- |
| Experience | Angular Web | PublicShell, AuthOnboardingShell, AppShell, OpsShell |
| Identity | Firebase Authentication | Kimlik dogrulama, oturum, custom claims |
| Data | Firestore | Katalog, snapshot, projection, event, edge belgeleri |
| Trusted Logic | Cloud Functions | Ekonomi, progression, social acceptance, publish, leaderboard |
| Asset | Firebase Storage | Medya, ses, icerik varliklari |
| Telemetry | Firebase Analytics | Urun olaylari ve funnel takibi |
| Local Runtime | Firebase Emulator Suite | Auth, Firestore, Functions, Storage ve rule testi |

## Bounded Context Listesi

| Context | Amac | Ust Duzey Veri |
| --- | --- | --- |
| Identity and Access | Kullanici kimligi, custom claim, session | Auth user, claims, session state |
| User Profile | Profil, tercihler, gorunurluk | `users`, profile snapshot |
| Onboarding | Goal, habit, path atamasi | onboarding draft ve completion state |
| Curriculum and Content | ElifBa, world, chapter, unit, lesson katalogu | catalog belgeleri |
| Learning Delivery | Lesson akisi ve challenge sunumu | lesson projection, challenge templates |
| Practice Engine | Zayif alan pekistirme | practice queue projection |
| Progress Tracking | Lesson completion, unit mastery, streak baglami | progression snapshots, completion events |
| Gamification Economy | XP, gems, hearts, achievements, quests | reward catalog, quest snapshots |
| League and Leaderboard | Haftalik lig ve sira | league projections |
| Social Graph | Follow, friend, gorunurluk, karsilastirma | edge belgeleri, social stats |
| Shop and Inventory | Sanal urun satin alma ve envanter | shop catalog, inventory snapshots |
| Analytics and Telemetry | Davranis olcumu ve funnel | analytics event definitions, Firebase Analytics |
| Ops Publishing | Icerik yayin ve release operasyonu | publish events, release projections |

## Yapisal Ilkeler

- UI sadece projection ve katalog okur; ekonomik veya rekabet etkili alanlari dogrudan yazmaz.
- Firestore belge turleri acikca ayrilir: `catalog`, `user snapshot`, `event`, `projection`, `edge`.
- Shell ayrimi route baglamini belirler; experience seviyesindeki ayrim domain kararlariyla karistirilmaz.
- V1 ve V2 icerik ayrimi katalog versiyonu ve backlog aileleriyle korunur.

## Yuksek Seviye Veri Akisi

1. Kullanici Auth ile oturum acar.
2. Angular istemcisi kullanici snapshot ve onboarding/progression projection'larini okur.
3. Lesson, quest, purchase veya social acceptance gibi komutlar Cloud Functions'a gider.
4. Function, Firestore event ve snapshot/projection belgelerini atomik olarak gunceller.
5. AppShell sag rayi ve sayfa merkezleri yalnizca guncellenmis projection'lardan beslenir.

## Operasyon Siniri

- OpsShell, ana kullanici urununden ayridir.
- Icerik yayinlama taslak katalog -> publish event -> projection refresh zinciriyle calisir.
- Release readiness, runbook ve evidence seti ile kapanir; deploy tek basina yeterli sayilmaz.

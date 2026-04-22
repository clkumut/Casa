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
- Firebase runtime config tokeni ve auth session hidrasyonu browser bootstrap zincirine baglandi.
- Login, register ve onboarding welcome route'lari feature-owned sayfalara tasindi; Firebase Auth tabanli executable aksiyonlar eklendi.
- `users/{uid}` snapshot'indaki `onboardingCompletedAt` alani auth session'a baglandi; guard kararları artik user snapshot verisi cozulmeden alinmiyor.
- Firebase istemcisi dinamik yuklemeye alinarak web ilk bundle boyutu yeniden budget altina indirildi.
- Onboarding feature'i icinde repository + facade tabanli read model kuruldu; kullanici draft verisi ve `catalog_onboarding_options` ayni feature akisina baglandi.
- `/auth/onboarding/goal`, `/auth/onboarding/level`, `/auth/onboarding/habit` ve `/auth/onboarding/path` route'lari acildi; sayfalar mevcut draft secimini ve catalog seceneklerini gosteriyor.
- Firestore rules onboarding catalog read, self user snapshot read ve sinirli onboarding draft self-write cizgisine cekildi; onboarding read modeli artik deny-all baseline tarafindan bloke edilmiyor.
- Onboarding step secimleri self-write cizgisiyle kullanici belgesine kaydediliyor; feature summary ekraninda trusted `finalizeOnboarding` callable'i acildi.
- Progress guard, `users/{uid}` snapshot'ina gore eksik onboarding step'ine dogrudan yonleniyor; tum step secimleri dolu ama tamamlanmamis durumda welcome summary canonical route olarak korunuyor.
- AppShell right rail placeholder'i `users/{uid}/rightRailSnapshots/default` projection'ina baglandi; app readiness resolver ilk projection yukunu bekliyor ve shell mock veri gostermiyor.
- `SMK-WP-003-001` smoke kaydi ile trusted `finalizeOnboarding` callable'i emulator uzerinde ilk ve ikinci cagrilarla dogrulandi.
- `/app/learn` placeholder route'u progression snapshot odakli gercek learn bootstrap sayfasina tasindi; feature-local repository + facade `users/{uid}/progressionSnapshots` projection'ini okuyarak current world/chapter/unit/lesson ve ozet metriklerini gosteriyor.
- Firestore rules, `users/{uid}/progressionSnapshots/*` owner-read cizgisiyle learn bootstrap okumasi icin acildi.
- Learn bootstrap read modeli current `catalog_learning_worlds`, `catalog_learning_chapters` ve `catalog_learning_units` belgelerini progression snapshot ile birlestiriyor; `/app/learn` artik yalniz id degil catalog metadata da gosteriyor.
- Firestore rules, `catalog_learning_worlds`, `catalog_learning_chapters` ve `catalog_learning_units` icin public read cizgisini acarak learning map bootstrap kontratini bloke etmiyor.
- `/app/learn` published world/chapter/unit listelerini ayni read modelde cozmeye basladi; current world ve chapter bagina gore filtrelenmis liste gorunumu merkez-stage'e tasindi.
- Unit kartlari, catalog icindeki prerequisite refs alanlarini okuyarak ilk onkosul baglarini learn yuzeyinde gostermeye basladi.
- `/app/learn/world/:worldId` route ailesi acildi; world detail sayfasi ilgili chapter ve unit kesitlerini published catalog'tan okuyarak liste gorunumunden detay akisina geciyor.
- `/app/learn/unit/:unitId` route ailesi acildi; unit detail sayfasi parent world/chapter ve prerequisite baglarini current progression ile ayni yuzeyde gosteriyor.
- `catalog_learning_lessons` bagi `/app/learn/unit/:unitId` detail yuzeyine tasindi; unit detail sayfasi published lesson kesitini ve progression/current-first fallback mantigiyla canonical start boundary'yi gostermeye basladi.
- Siradaki teknik slice, lesson execution route veya command surface'ini acarak bu start boundary'yi gercek baslatma akisina baglamaktir.
# V1 Scope Baseline

## Urun Tanimi

Casa V1, Turkce arayuzle Arapca ogrenmek isteyen kullanicilar icin tasarlanmis, oyunlastirma ve sosyal motivasyonla desteklenen web tabanli bir ogrenme platformudur. V1, Angular web istemcisi ile Firebase Authentication, Firestore, Cloud Functions, Storage, Analytics ve Emulator Suite uzerine kurulur.

## V1'in Basarmasi Gereken Cekirdek Sonuclar

1. Ziyaretci landing uzerinden giris veya kayit akisina ilerleyebilmeli.
2. Yeni kullanici onboarding tamamlayip ilk ElifBa veya ogrenme yolunu baslatabilmeli.
3. Giris yapan kullanici AppShell icinde `/app/learn`, `/app/elifba`, `/app/practice`, `/app/leaderboard`, `/app/quests`, `/app/shop`, `/app/profile`, `/app/more/settings` rotalarina tutarli sekilde ulasabilmeli.
4. Tum temel urun metrikleri gercek Firebase verisiyle calismali: XP, streak, gems, hearts, progression, quest durumu, leaderboard pozisyonu.
5. Ogrenme ilerlemesi, gamification ekonomisi ve sosyal gorunurluk trusted mutasyon modeliyle korunmali.

## Hedef Kullanici

- Birincil kitle: Turkce arayuz kullanan, sifirdan veya temel seviyeden Arapca ogrenmek isteyen yetiskin veya genc yetiskin kullanicilar.
- Cihaz varsayimi: responsive web; masaustu ve mobil tarayici kullanimi desteklenir.
- Dil beklentisi: arayuz Turkce, ogrenme icerigi Arapca odaklidir; RTL gereksinimi icerik ve ilgili ekranlarda zorunludur.

## V1 Domain Kapsami

| Domain | V1'de Var Mi | V1 Kapsami |
| --- | --- | --- |
| Public Experience | Evet | Landing, urun degeri, giris ve kayit yonlendirmesi |
| Identity and Auth | Evet | Firebase Authentication, oturum acma, kayit, oturum surdurme |
| Onboarding | Evet | Hedef secimi, baslangic seviyesi, gunluk hedef, ilk rota atamasi |
| ElifBa | Evet | Harf tanima, ses, baglanma mantigi, temel tekrar gorevleri |
| Learning Path | Evet | V1 curriculum cut'a dayali world, chapter, unit, lesson ve challenge akisi |
| Practice | Evet | Pekistirme ve heart kurtarma odakli uygulama yuzeyi |
| Progress Tracking | Evet | Progression, unit completion, lesson state, streak ve mastery snapshot |
| Gamification Economy | Evet | XP, gems, hearts, quests, achievements, weekly league, shop |
| Social | Evet | Follow/friend request, sinirli profil gorunurlugu, leaderboard iliskisi |
| Profile and Settings | Evet | Profil ozetleri, tercihlerin yonetimi, hesap cikisi |
| Ops/Admin | Sinirli | Icerik yayinlama ve operasyonel bakim icin ayri OpsShell siniri |

## Shell ve Ekran Kapsami

| Shell | V1 Durumu | Kapsam |
| --- | --- | --- |
| PublicShell | Zorunlu | `/` ve marketing katmani |
| AuthOnboardingShell | Zorunlu | `/auth/login`, `/auth/register`, `/auth/onboarding/*` |
| AppShell | Zorunlu | Tum authenticated urun deneyimi |
| OpsShell | Sinirli fakat tanimli | Ops kullanicisi icin icerik yayin ve operasyon ekranlari |

## V1 Veri ve Is Kurali Kapsami

- Kullanici profili, onboarding secimleri, progression, quest durumu, achievements, hearts, gems, leaderboard ve inventory Firestore belgelerinde tutulur.
- Ekonomik veya rekabet etkili tum yazimlar Cloud Functions araciligiyla gerceklesir.
- Learning map, content catalog, quest catalog ve reward catalog Firestore `catalog` belgeleriyle yayinlanir.
- UI, verisi tanimlanmamis bir ekrani mock veriyle acmaz; veri modeli ve Firestore kural siniri once netlestirilir.

## V1 Icerik Kesiti

- ElifBa sifirinci hazirlik katmani olarak tam kapsanir.
- 1. Kisim, V1'in cekirdek mufredatidir ve dunya/bolum/unit seviyesinde urunlestirilir.
- 2. Kisim yapisal olarak modellenir ancak delivery kapsaminda V2 curriculum backlog'da tutulur.
- Destek alanlari olan okuma parcalari, gramer terimleri sozlugu ve alfabetik konu fihristi V1'de destekleyici katalog katmani olarak yer alir.

## V1 Non-Functional Gereksinimler

- RTL ve Arapca harf baglanma dogrulamasi zorunludur.
- Responsive shell yapisi masaustu ve dar ekranlarda calismalidir.
- Firebase Emulator ile yerelde gercek veri akislari test edilmelidir.
- Analytics olaylari veri minimizasyonu ilkesiyle tanimlanmalidir.
- Production PII non-prod ortamlara kopyalanmaz.

## Basari Kriterleri

- Kullanici landing'den ilk dersi baslatana kadar tek parca deneyim yasamali.
- AppShell sag rayi tum uygulama sayfalarinda XP, streak, gems ve hearts gostermelidir.
- Ilk release, V1 curriculum cut icindeki en az bir tam ogrenme yolunu tamamlanabilir sekilde sunmalidir.
- Haftalik league, quest ve achievement akisi gercek veriyle hesaplanmalidir.

# Information Architecture

## Ilke

Bilgi mimarisi, kullanicinin landing'den AppShell icindeki gunluk ogrenme dongusune tek parca akmasini hedefler. PublicShell, AuthOnboardingShell, AppShell ve gerektiginde OpsShell birbirinden ayridir; her route ailesi hangi shell icinde yasadigini acikca belirtir.

## Shell Tanimi

| Shell | Amac | Ana Bilesenler | Birincil Kullanici |
| --- | --- | --- | --- |
| PublicShell | Pazarlama, urun degeri, CTA | Hero, fayda bloklari, referans anlatimi, CTA | Ziyaretci |
| AuthOnboardingShell | Kimlik, kayit ve onboarding | Login, register, onboarding stepper, progress header | Yeni veya geri donen kullanici |
| AppShell | Ogrenme urununun ana yuzeyi | Sol sidebar, merkez icerik alani, sag sabit bilgi alani | Giris yapmis kullanici |
| OpsShell | Icerik yayin ve operasyon | Ops nav, yayin kuyrugu, audit panosu | Ops kullanicisi |

## Route Aileleri

| Route | Shell | Amac | Temel Veri |
| --- | --- | --- | --- |
| `/` | PublicShell | Landing ve ana deger onerisi | Public content catalog |
| `/auth/login` | AuthOnboardingShell | Giris | Firebase Auth state |
| `/auth/register` | AuthOnboardingShell | Kayit | Firebase Auth state |
| `/auth/onboarding/welcome` | AuthOnboardingShell | Baslangic yonlendirmesi | User draft profile |
| `/auth/onboarding/goal` | AuthOnboardingShell | Ogrenme hedefi secimi | Onboarding catalog |
| `/auth/onboarding/level` | AuthOnboardingShell | Baslangic seviyesi | Onboarding catalog |
| `/auth/onboarding/habit` | AuthOnboardingShell | Gunluk hedef secimi | Habit options catalog |
| `/auth/onboarding/path` | AuthOnboardingShell | ElifBa ve ogrenme yolu atamasi | Curriculum catalog |
| `/app/learn` | AppShell | Ana ogrenme haritasi | Learning map projection |
| `/app/elifba` | AppShell | ElifBa harf ve ses rotasi | ElifBa catalog + user progression |
| `/app/practice` | AppShell | Pekistirme ve kalp geri kazanma | Practice queue projection |
| `/app/leaderboard` | AppShell | Lig ve sira | League projection |
| `/app/quests` | AppShell | Aktif gorevler ve oduller | Quest projection |
| `/app/shop` | AppShell | Sanal ekonomi ve inventory | Shop catalog + inventory snapshot |
| `/app/profile` | AppShell | Profil, basari ve ilerleme ozeti | User profile snapshot |
| `/app/more/settings` | AppShell | Sistem ayarlari ve cikis | Preferences snapshot |
| `/ops/content` | OpsShell | Icerik yayin ve versiyon | Catalog draft/publish records |
| `/ops/release` | OpsShell | Operasyon ve gate gorunumu | Release evidence projection |

## AppShell Yerlesim Standardi

### Sol Sidebar

- Ust bolum: marka, aktif kullanici seviyesi, gunun ana hedefi
- Ana navigasyon: Ogrenme, ElifBa, Uygulama, Liderlik Tablosu, Gorevler, Magaza, Profil
- Ikincil navigasyon: Daha Fazlasi altinda Sistem Ayarlari ve Cikis
- Alt bolum: son senkron durumu ve ops duyurusu yoksa sade gorunum

### Merkez Icerik Alani

- Sayfa odakli ana akis burada yasar
- `learn` icin world map ve unit node'lari gorulur
- `elifba` icin harf kartlari, ses ve baglanma egzersizleri bulunur
- `practice` ekraninda zayif alanlar ve heart kurtarma akisi bulunur

### Sag Sabit Bilgi Alani

Tum AppShell sayfalarinda ust metrik satiri aynidir:

- XP
- Streak
- Gems
- Hearts

Alt kartlar sayfaya gore degisir:

| Sayfa | Sag Ray Alt Kartlari |
| --- | --- |
| Learn | Siradaki unit, hafta ilerlemesi, aktif quest durumu |
| ElifBa | Siradaki harf ailesi, ses tekrar durumu, baglanma ustaligi |
| Practice | Heart geri kazanma yolu, zayif konu listesi, gunluk tekrar hedefi |
| Leaderboard | Lig bitisine kalan sure, promotion cut-off, arkadas sirasi |
| Quests | Tamamlanmak uzere olan quest, bugunku odul, haftalik hedef |
| Shop | Gem bakiyesi, one cikan urunler, son satin alma etkisi |
| Profile | Basari kartlari, son tamamlama, gorunurluk tercihi |
| Settings | Hesap durumu, dil ve RTL tercihleri, cikis oturumu bilgisi |

## Onboarding Bilgi Mimarisi

| Adim | Amaç | Sonuc |
| --- | --- | --- |
| Welcome | Urun vaadini netlestirmek | Kullanici akisa taahhut eder |
| Goal | Neden Arapca ogrendigini secmek | Quest ve motivasyon tonu belirlenir |
| Level | Sifir, temel veya tazeleyici ihtiyacini belirtmek | Baslangic path atanir |
| Habit | Gunluk hedef ve ritim secmek | Streak ve reminder catalog secimi belirlenir |
| Path | ElifBa once mi, es zamanli mi ilerleyecegini netlestirmek | Ilk lesson kuyruğu olusur |

## Bilgi Mimarisi Kurallari

- Ogrenme ana urun yuzeyidir; landing veya social moduller bunu golgelemez.
- Her route tek bir ana gorev tasir.
- Shell degisimi yalniz kullanici baglami degistiginde olur; AppShell icinde sayfalar arasi gecis shell kirilmasi yasatmaz.
- RTL ve Arapca tipografi dogrulamasi `learn`, `elifba`, `practice` ve profile bagli ogrenme kartlarinda zorunludur.

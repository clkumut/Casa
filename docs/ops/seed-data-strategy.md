# Seed Data Strategy

## Ilke

Mock runtime veri yasaktir; buna karsilik gelistirme ve test icin gerekli tum veri Firestore ve gerekirse Storage uzerinden seed olarak yuklenir. Seed veri, uretim kopyasi degil pseudonymous ve amaca yonelik veri setidir.

## Seed Siniflari

| Sinif | Icerik | Kullanildigi Ortam |
| --- | --- | --- |
| Base catalog seed | Onboarding secenekleri, reward catalog, league tier, shop item | Local, Dev, Staging |
| Curriculum seed | ElifBa ve V1 Part 1 worlds/chapters/units/lessons | Local, Dev, Staging |
| Pseudonymous learner seed | Gercek kisi olmayan test kullanicilari ve snapshot'lari | Local, Dev, Staging |
| Social graph seed | Takip, arkadas ve leaderboard test iliskileri | Local, Dev, Staging |
| Ops seed | Ops roller ve publish deneme kayitlari | Local, Dev, Staging |

## Seed Icerik Kurallari

- Her seed verisi gercek veri modeline uyar; UI'yi kandiran gecici alan eklenmez.
- Pseudonymous kullanicilar yapay ama tutarli progression ve ekonomi durumlarina sahip olur.
- Medya seed'leri Storage yol ve metadata standardina uyar.

## Yasaklar

- Production kullanici kaydini, e-posta adresini veya davranis kaydini kopyalamak
- Kod icinde array veya JSON ile runtime placeholder veri tutmak
- Ortama gore veri semasini degistirmek

## Seed Yasam Dongusu

1. Catalog surumu belirlenir.
2. Seed manifest'i olusturulur.
3. Emulator veya hedef non-prod ortama yuklenir.
4. Smoke ve rule testleri seed uzerinde calistirilir.
5. Gerekirse yeni surum ile eskisi devre disi birakilir.

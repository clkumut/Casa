# Gamification and Economy

## Tasarim Ilkeleri

- Oyunlastirma, ogrenmeyi destekler; ogrenmenin yerine gecmez.
- Her ekonomik degisken gercek Firebase verisiyle izlenir.
- Ekonomik etkili tum yazimlar trusted mutasyon olarak Cloud Functions uzerinden yapilir.
- Sag sabit bilgi alani kullanicinin gunluk motivasyon gostergelerini tum AppShell sayfalarinda gorunur kilar.

## Temel Gosterge ve Para Birimleri

| Alan | Amac | Yazim Otoritesi | Okuma Yuzeyi |
| --- | --- | --- | --- |
| XP | Ilerleme ve lig katkisi | Function | Tum AppShell |
| Streak | Gunluk aliskanlik | Function | Tum AppShell |
| Gems | Harcanabilir sanal varlik | Function | Tum AppShell, Shop |
| Hearts | Hata toleransi ve practice dongusu | Function | Tum AppShell, Practice |
| League Score | Haftalik siralama | Function | Leaderboard |
| Quest Progress | Gorev takibi | Function | Quests, right rail |
| Achievement Progress | Kalici kilometre tasi | Function | Profile, quests |

## V1 Ekonomi Kalibrasyonu

Asagidaki kalibrasyonlar kod icinde degil `catalog_rewards` ve `catalog_quests` belgelerinde tutulur:

- Standart lesson clear: 10 XP
- Perfect lesson bonusu: 5 XP
- Unit mastery quiz clear: 25 XP
- Gunluk quest tamamlanmasi: 15 gems
- Haftalik quest tamamlanmasi: 40 gems
- Baslangic hearts: 5
- Practice ile heart geri kazanimi: belirli gorev veya odeme ile 1 kalp

Bu degerler release sonrasinda catalog guncellemesiyle revize edilebilir; istemciye hardcode edilmez.

## Quest Sistemi

| Quest Turu | Ritim | Ornek Hedef | Odul |
| --- | --- | --- | --- |
| Daily | Gunluk | 2 lesson tamamlama, 1 practice clear | XP + gems |
| Weekly | Haftalik | 5 unit mastery, 3 gun streak koruma | Gems + achievement progress |
| Curriculum | Chapter bazli | Bir chapter'i tamamlamak | Badge veya inventory unlock |
| Recovery | Durumsal | Hearts bitince practice ile geri donus | Heart refill veya XP |

## League Modeli

- Haftalik lig penceresi Pazartesi baslar, Pazar kapanir.
- League projection, kullanicinin haftalik XP ve challenge verimliligine gore Function tarafinda guncellenir.
- Promotion, stay ve demotion esikleri catalog belgeleriyle tanimlanir.
- Leaderboard istemcisi yalniz projection okur; kullanici puani dogrudan yazamaz.

## Shop Modeli

| V1 Urun Tipi | Satin Alma Kaynagi | Etki |
| --- | --- | --- |
| Heart refill | Gems | Hearts degerini Function ile gunceller |
| Profil kozmetigi | Gems | Profil ve inventory projection'una islenir |
| Tema varyanti | Gems | UI tercih projection'una yansir |
| Quest reroll token | Gems | Aktif quest atamasini yeniden ceker |

## Achievement Sistemi

- Achievement'lar chapter tamamlama, streak, social milestone ve league performansi etrafinda kurgulanir.
- Achievement kilitleri `catalog_achievements` altinda tanimlanir.
- Kazanimlar `users/{uid}/achievementSnapshots/{achievementId}` benzeri snapshot belgelerine projection olarak yansir.

## Trusted Mutation Matrisi

| Islem | Istemci Yetkisi | Function Ismi Sinifi |
| --- | --- | --- |
| Lesson completion claim | Komut baslatir | `completeLesson` |
| Quest claim | Komut baslatir | `claimQuestReward` |
| Shop purchase | Komut baslatir | `purchaseCatalogItem` |
| Heart refill | Komut baslatir | `refillHearts` |
| League rollover | Yok | Zamanlanmis function |
| Streak update | Yok | Zamanlanmis veya event-driven function |
| Achievement unlock | Yok | Event-driven function |

## Sag Ray Gosterge Davranisi

- XP: mevcut seviye ve haftalik katkı ozeti ile birlikte sunulur.
- Streak: bugun icin korunup korunmadigi gosterilir.
- Gems: harcanabilir bakiye olarak gorunur.
- Hearts: anlik durum ve practice ile geri kazanma baglami sunulur.

## Anti-Abuse Kurallari

- Quest claim idempotent kimlik ile islenir.
- Ayni lesson tamamlamasi tekrardan puan yazamaz; event kimligi tekildir.
- Shop purchase once bakiye sonra stok uygunlugu acisindan kontrol edilir.
- Leaderboard projection yazimlari dogrudan istemciye acilmaz.

# V1 Out of Scope

## Amac

Bu belge, V1'in hangi ozellikleri bilerek disarida biraktigini netlestirir. Bu maddeler delivery backlog'una tasinmaz; uygun olanlar V2 backlog'a yazilir.

## Urun Kapsami Disi Maddeler

| Alan | V1 Disi Madde | Gerekce |
| --- | --- | --- |
| Platform | Native iOS ve Android uygulamalari | V1 web odakli baslatilir |
| Platform | Offline-first senkronizasyon | Firestore online akisi once sabitlenir |
| Auth | Sosyal login saglayicilarinin genis listesi | Baslangicta e-posta ve dogrulanmis temel akis yeterli |
| Onboarding | Kapsamli adaptif placement test | Ilk release'te kurulum hizina oncelik verilir |
| Learning | 2. Kisim tam icerik yayini | V1 curriculum cut, ElifBa + 1. Kisim ile sinirlanir |
| Learning | Canli konusma degerlendirmesi | Ses tanima ve puanlama operasyonel risk tasir |
| Learning | Yapay zekâ destekli serbest yazi geri bildirimi | Trusted pedagojik kalite ve maliyet sonraya alinir |
| Gamification | Sezonluk battle pass ve premium economy | Temel ekonomi once stabilize edilir |
| Social | Grup olusturma, sohbet, feed, yorumlasma | Moderasyon ve guvenlik kapsamını buyutur |
| Social | Gercek zamanli PvP challenge | League ve async karsilastirma once dogrulanir |
| Shop | Kredi karti ile direkt satin alma | V1'de uygulama ici sanal ekonomi ile sinirli |
| Ops | Tam kapsamli CMS | Icerik yayinlama dar ve kontrollu tutulur |
| Analytics | Gelismis deneysel A/B altyapisi | Temel urun olcumleri once oturur |
| Localization | Cok dilli arayuz genislemesi | V1 arayuzu Turkce olarak sabitlenir |

## Teknik Kapsam Disi Maddeler

- `shared` klasoru acmak
- Mock runtime veri ile ekran calistirmak
- Leaderboard, quest claim, purchase ve social acceptance yazimlarini istemciye acmak
- Tek Firebase projesi uzerinde dev, staging ve prod ortamlarini birlestirmek
- Release kaniti olmadan deploy yapmak

## V1 Sonrasi Degerlendirilecek Konular

- Ikinci kurs yolu ve farkli hedef kitle akislari
- Bildirim orkestrasyonu ve yeniden kazanma kampanyalari
- Gorsel kisilestirme ve avatar ekonomisinin genisletilmesi
- Sosyal graph'in kulup veya sinif mantigina genisletilmesi

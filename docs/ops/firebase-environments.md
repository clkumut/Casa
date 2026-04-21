# Firebase Environments

## Ilke

Casa V1, environment sinirlarini tek Firebase projesinde karistirmaz. Local emulator disinda dev, staging ve prod icin ayrik Firebase proje alanlari kullanilir.

## Ortam Matrisi

| Ortam | Firebase Siniri | Amaç | Veri Politikasi |
| --- | --- | --- | --- |
| Local | Emulator Suite | Gelistirici makinesi uzerinde hizli dogrulama | Sadece seed ve pseudonymous test veri |
| Dev | Ayrik Firebase projesi | Gelistirme entegrasyon testi | Pseudonymous test veri, sinirli ekip kullanimi |
| Staging | Ayrik Firebase projesi | Release adayi ve UAT | Prod'a yakin katalog ve test kullanicilari |
| Prod | Ayrik Firebase projesi | Canli kullanim | Gercek kullanici verisi |

## Servis Bazli Farklar

| Servis | Local | Dev | Staging | Prod |
| --- | --- | --- | --- | --- |
| Auth | Emulator | Gercek Firebase projesi | Gercek Firebase projesi | Gercek Firebase projesi |
| Firestore | Emulator | Ayrik proje | Ayrik proje | Ayrik proje |
| Functions | Emulator | Deploy edilmis | Deploy edilmis | Deploy edilmis |
| Storage | Emulator | Ayrik bucket | Ayrik bucket | Ayrik bucket |
| Analytics | Gerekirse stub veya kapali | Sinirli ve ayrik property | Release adayi gozlemi | Uretim olcumu |

## Konfigurasyon Kurallari

- Ortam bazli config, repo icinde hardcoded tutulmaz; guvenli ortam yonetimi ile saglanir.
- Prod anahtar ve claim yonetimi yalniz yetkili roller tarafindan degistirilir.
- Firestore rules, indexes ve functions deploy'lari ortam bazinda ayrik hedeflere baglanir.

## Veri Hijyeni

- Dev ve staging ortamlarinda production PII bulunmaz.
- Staging, prod kataloguna benzer icerik dagilimina sahip olabilir ancak kullanici seti pseudonymous olur.
- Ortamlar arasi manuel veri kopyalama degil, onayli seed ve publish akisi kullanilir.

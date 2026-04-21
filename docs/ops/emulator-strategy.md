# Emulator Strategy

## Temel Yaklasim

Emulator-first, V1'in gercek veri zorunlulugunu bozmaz; tersine gercek Firebase davranisini lokal gelistirme ve testte tekrarlanabilir hale getirir. Local ortamda Auth, Firestore, Functions ve Storage birlikte dogrulanir.

## Emulator Kapsami

| Servis | Neden Emule Edilir |
| --- | --- |
| Auth | Login, register ve custom claim akislarini tekrar etmek |
| Firestore | Rules, projection, snapshot ve event akislarini test etmek |
| Functions | Trusted write ve scheduler mantigini yerelde dogrulamak |
| Storage | ElifBa ses ve medya erisim kurallarini test etmek |

## Zorunlu Emulator Senaryolari

1. Yeni kullanici kaydi ve onboarding tamamlama
2. Ilk lesson completion -> XP, hearts, right rail guncelleme
3. Quest claim -> inventory ve gems guncelleme
4. Shop purchase -> bakiye dusme ve item unlock
5. Follow/friend accept -> social stats projection
6. Firestore rule ihlali -> yetkisiz kullanici reddi

## Parite Kurallari

- Local kataloglar dev ile ayni surum semasini kullanir.
- Seed manifest'i ayni yapisal koleksiyon isimleriyle emulator'e yuklenir.
- Function giris ve cikis kontratlari local ve bulut ortami arasinda degismemelidir.

## Basarisizlik Politikasi

- Emulator'de gecmeyen trusted write akisleri G3 Build Ready icin blokerdir.
- Rule testinde yetkisiz yazima izin cikmasi guvenlik blokeri sayilir.
- RTL ve Arapca render bozulmasi smoke test listesine geri dondurulur.

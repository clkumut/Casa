# Rollback Runbook

## Tetikleyiciler

- Blocker smoke kusuru
- Auth akisinin calismamasi
- Trusted write regression
- Veri kaybi veya yanlis ekonomi hesaplamasi
- Rules yanlisligi nedeniyle yetkisiz erisim riski

## Hazirlik

1. Geri donulecek onceki saglikli surum referansi hazir olmali.
2. Son deploy'a ait degisiklik listesi ve kanit kaydi acik olmali.
3. PM, DevOps, TL ve gerekli ise Security bilgilendirilmeli.

## Rollback Adimlari

1. Incident veya kusur seviyesi blocker olarak siniflandirilir.
2. Yeni deploy trafiği veya yayin operasyonu durdurulur.
3. Onceki saglikli web/function/rule surumu geri yuklenir.
4. Katalog publish degisikligi varsa son stabil katalog surumu yeniden etkinlestirilir.
5. Kritik smoke testler tekrar calistirilir.
6. Sonuc EVD ve APR kayitlarina islenir.

## Rollback Sonrasi

- Kök neden analizi delivery risk register'a baglanir.
- Ayni issue yeni release denemesinde bloke olarak izlenir.

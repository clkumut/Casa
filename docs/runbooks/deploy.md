# Deploy Runbook

## Kapsam

Bu runbook, staging veya production deploy oncesinde ve deploy sirasinda izlenecek zorunlu adimlari tanimlar.

## On Kosullar

1. Ilgili release adayi icin EVD kaydi acilmis olmali.
2. APR zincirinde gerekli imzalar staging veya production icin hazir olmali.
3. Rollback hedefi olarak bir onceki saglikli surum tanimli olmali.
4. Publish edilecek katalog surumu ve function surumu netlestirilmis olmali.

## Deploy Adimlari

1. Hedef ortam ve proje kimligi dogrulanir.
2. Rule ve index farklari kontrol edilir.
3. Functions ve web artefact'larinin release adayi surumu teyit edilir.
4. Gerekliyse katalog publish akisi once staging veya prod hedefinde tamamlanir.
5. Deploy islemi yetkili release owner tarafindan baslatilir.
6. Deploy tamamlandiginda temel saglik kontrolu yapilir.
7. Sonuc EVD kaydina islenir.

## Deploy Sonrasi Zorunlu Kontroller

- Login ve register acisi
- Onboarding tamamlama
- Ilk lesson completion
- Quest claim
- Shop purchase
- Leaderboard okuma
- Right rail veri tutarliligi

## Basarisizlik Durumu

- Kritik kontrol kalirsa aninda rollback karar toplantisi acilir.
- Kismi basarisizlik release note'a islenir ve APR kaydina durum dusulur.

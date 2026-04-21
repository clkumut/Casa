# ADR-010 Ops Admin Boundary and Content Publishing

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

V1'de tam bir CMS hedeflenmiyor, ancak icerik katalogu, publish akisi ve release operasyonu icin sinirli ama kontrollu bir operasyon yuzeyi gerekiyor. Bu yuzey kullanici uygulamasi ile karismamalidir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Ops islemlerini elle Firestore uzerinden yapmak | Audit ve guvenlik zayif |
| Tam kapsamli admin paneli | V1 icin fazla genis |
| Sinirli OpsShell + publish workflow | Kontrollu ve yeterli |

## Karar

Ops islemleri, ayri route sinirina sahip OpsShell uzerinden yurutulecek. Icerik publish akisi taslak katalog, publish event, projection refresh ve evidence kaydi zinciriyle calisacak.

## Sonuclar

- Icerik yayin ve release operasyonu son kullanici arayuzunden ayrilir.
- Audit izi ve role-based yetki netlesir.
- V1 kapsaminda tam CMS kurmadan kontrollu yayin akisi saglanir.

## Riskler ve Hafifletme

- Risk: OpsShell kapsamı zamanla V2 admin paneline donusmesi.
- Hafifletme: OpsShell yalniz publish, release ve audit gorevleriyle sinirlandirilir; yeni operasyon modulleri icin ayri DEC/ADR gerekir.

## Onay

- DevOps Engineer
- Solution Architect
- Tech Lead
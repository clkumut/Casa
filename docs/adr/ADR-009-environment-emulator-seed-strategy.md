# ADR-009 Environment, Emulator and Seed Strategy

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Gercek veri zorunlulugu, production verisini gelistirmeye tasimak anlamina gelmez. Ortam ayrimi ve seed stratejisi net olmazsa ekip mock veriye kayabilir veya veri hijyeni bozulabilir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Tek Firebase projesi | Ortam karisimi ve veri riski yuksek |
| Prod kopyasi ile non-prod | Gizlilik ve guvenlik acisindan kabul edilemez |
| Ayrik projeler + emulator + pseudonymous seed | Guvenli ve tekrarlanabilir |

## Karar

Local ortam emulator ile calisir; dev, staging ve prod ayri Firebase proje sinirlarina sahip olur. Seed veri gercek semaya uyan, pseudonymous ve katalog bazli veri setlerinden olusur.

## Sonuclar

- Mock runtime veri ihtiyaci ortadan kalkar.
- Ortamlar arasi veri sızıntisi riski azalir.
- CI/CD ve smoke testler tekrarlanabilir hale gelir.

## Riskler ve Hafifletme

- Risk: Seed verinin zamanla schema'dan kopmasi.
- Hafifletme: Seed manifest'i catalog version ve rule testleriyle birlikte dogrulanir.

## Onay

- DevOps Engineer
- Security Engineer
- Tech Lead

# ADR-007 Gamification Economy, Quest and League Projections

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Gamification, V1 urununun cekirdek parcasidir. Ancak ekonomi, quest ve league verilerini ayni belgelere karmak hem guvenlik hem sorgu performansi acisindan sorun yaratir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Tum ekonomi durumunu `users` belgesinde tutmak | Buyuk belge ve yazim cakismasi |
| Her feature icin bagimsiz ham veri okumak | UI tarafinda hesaplama yükü artar |
| Snapshot + projection ayrimi | Okuma performansi ve trusted write uyumu saglar |

## Karar

Quest, achievement, inventory ve league verileri kullaniciya ozel snapshot'lar ve sorgu-odakli projection'lar ile tutulur. Right rail, inventory ve leaderboard yuzeyleri yalniz projection okur; hesaplamalar Function tarafinda yapilir.

## Sonuclar

- AppShell metrikleri hizli ve tutarli acilir.
- League ve quest claim suistimal riski azalir.
- Shop ve inventory akislarinda bakiye uyumu korunur.

## Riskler ve Hafifletme

- Risk: Projection sayisi arttikca isletim yukü artabilir.
- Hafifletme: V1'de yalniz kritik ekran projection'lari tutulur; gereksiz projection uretilmez.

## Onay

- Solution Architect
- Tech Lead
- Product Owner

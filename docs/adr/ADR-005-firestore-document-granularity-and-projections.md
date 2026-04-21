# ADR-005 Firestore Document Granularity and Projections

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Ogrenme, gamification ve sosyal sistem ayni kullanici icin cok farkli sorgu paternleri uretir. Tek buyuk kullanici belgesi veya tek tip koleksiyon yapisi sorgu maliyetini ve yetki karmasasini arttirir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Tek buyuk user document | Yazim carpismasi ve gereksiz payload |
| Tamamen alt koleksiyon odakli daginik yapi | Gorsel okuma zor ve governance zayif |
| Tip bazli ayri belge siniflari + projection | Sorgu ve yetki bazli en dengeli yaklaşim |

## Karar

Firestore belgeleri `catalog`, `user snapshot`, `event`, `projection`, `edge` tiplerine ayrilir. Okuma yuzeyleri projection odakli calisir; event koleksiyonlari kullanici UI'sine verilmez.

## Sonuclar

- Right rail, leaderboard ve practice gibi ekranlar optimize projection okur.
- Security rules veri tipine gore sade yazilir.
- Event sourcing benzeri izlenebilirlik, tam event-store karmasasi yaratmadan saglanir.

## Riskler ve Hafifletme

- Risk: Projection senkron gecikmesi.
- Hafifletme: Kritik ekranlar icin minimum gerekli projection seti tanimlanir ve idempotent event isleyiciler kullanilir.

## Onay

- Solution Architect
- Tech Lead

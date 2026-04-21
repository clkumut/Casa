# ADR-004 Firebase Trusted Write Model

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

XP, hearts, gems, leaderboard, quest claim, purchase ve social acceptance gibi alanlar kullanici rekabeti ve ekonomi dengesini etkiler. Bu alanlari istemciye acmak suistimal ve veri tutarsizligi riski tasir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Tüm yazimlar istemciden | Yüksek hiz, dusuk guvenlik |
| Karisik model | Hangi alanin trusted oldugu zamanla bulaniklasir |
| Function-mediated trusted writes | En net guvenlik siniri |

## Karar

Ekonomik, rekabet etkili ve sosyal graph degistiren tum yazimlar Cloud Functions tarafindan islenecek. Istemci yalniz command baslatir veya sinirli self-service tercih alanlarini yazar.

## Sonuclar

- Economy ve progression hesaplari tek otoritede toplanir.
- Idempotency, audit ve rollback daha yonetilebilir olur.
- Firestore rules daha sade bir deny-by-default çizgisiyle yazilir.

## Riskler ve Hafifletme

- Risk: Function sayisi ve latency artisi.
- Hafifletme: Projection ve batch update stratejisi ile okuma hizli tutulur; sadece gerekli alanlar trusted olur.

## Onay

- Solution Architect
- Tech Lead
- Security Engineer

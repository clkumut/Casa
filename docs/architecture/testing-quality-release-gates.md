# Testing, Quality and Release Gates

## Kalite Prensibi

Kalite, testlerin toplami degil; G0-G5 gate zincirinin calisan karsiligidir. V1 icin kalite kapisi, brief kabulunden release hazirligina kadar hem urun hem mimari hem de operasyonel kanit ister.

## Test Katmanlari

| Katman | Odak |
| --- | --- |
| Unit | Domain kuralı, mapper, utility ve use-case davranisi |
| Integration | Angular repository + emulator, function + firestore akisları |
| Rules | Firestore ve Storage yetki davranisi |
| UI/UX validation | Shell tutarliligi, right rail kontrati, onboarding akisi |
| RTL and Arabic validation | Harf baglanma, diacritics, font okunabilirligi, responsive gorunum |
| Smoke | Landing, auth, onboarding, first lesson, quest claim, purchase, leaderboard |

## Gate Bazli Kalite Beklentisi

| Gate | Kalite Beklentisi |
| --- | --- |
| G0 Brief Acceptance | Governance ve source-of-truth tam |
| G1 Scope Freeze | V1/V2 ayrimi, IA ve curriculum cut sabit |
| G2 Architecture Freeze | ADR seti, Firestore modeli, guvenlik siniri, data flow katalogu tamam |
| G3 Build Ready | Repo standardi, emulator stratejisi, seed, CI/CD ve runbook'lar hazir |
| G4 WP Close | Ilgili testler, EVD ve APR baglari mevcut |
| G5 Release Ready | Smoke, rollback, guvenlik, operations readiness ve analytics kontrolu tamam |

## RTL ve Arapca Dogrulama Zorunluluklari

- Harf baglanma bozulmadan render edilmeli.
- Hareke ve diacritics gorunur ve kesismeden okunabilir olmali.
- Sağdan sola akista buton, kart, soru ve cevap duzeni kirilmamali.
- Dar ekran ve masaustu gorunumleri ayri smoke kontrolune girmeli.

## Release Kalite Kontrol Listesi

1. Emulator ile temel auth, rules ve function akisi gecti.
2. Gercek veri kaynagi olmayan hicbir ekran acilmiyor.
3. Right rail tum app sayfalarinda sabit ust metrikleri gosteriyor.
4. Quest claim, purchase ve social acceptance istemciden serbest yazilamiyor.
5. Rollback runbook'u ve smoke test sonucu EVD kaydina baglandi.

## Kusur Siniflandirmasi

- Blocker: release'i durduran auth, data loss, trusted write, RTL bozulmasi
- High: ogrenme akisini veya ekonomi guvenligini bozan kusur
- Medium: belirli feature'i bozan ancak alternatif akis birakan kusur
- Low: kozmetik veya icerik mikrodogruluk kusuru

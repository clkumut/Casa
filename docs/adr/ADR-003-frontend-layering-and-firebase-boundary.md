# ADR-003 Frontend Layering and Firebase Boundary

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Angular istemcinin hizli gelistirilmesi ile Firestore'a dogrudan baglanma cazip olabilir; ancak bu durum domain mantigi, projection okuma ve trusted write ayrimini bozar.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| UI'dan dogrudan Firebase SDK kullanimi | Hizli prototip, dusuk mimari kontrol |
| Feature service katmani ama net katman ayrimi yok | Orta seviye ama buyudukce karmasik |
| Domain/Application/Infrastructure/Presentation ayrimi | En net sahiplik ve test siniri |

## Karar

Angular tarafi feature bazli `domain`, `application`, `infrastructure`, `presentation`, `models` katmanlariyla kurulur. Presentation katmani Firestore'a dogrudan yazmaz; repository ve command adapter'lari `infrastructure` katmaninda tanimlanir.

## Sonuclar

- Firebase baglantilari UI'dan ayrilir.
- Use-case mantigi test edilebilir hale gelir.
- Feature ownership ve dosya yerlesimi netlesir.

## Riskler ve Hafifletme

- Risk: Erken asamada gereksiz soyutlama olusmasi.
- Hafifletme: Katman sayisi sabit, ancak sadece gercek ihtiyac olan kontratlar eklenir.

## Onay

- Solution Architect
- Tech Lead

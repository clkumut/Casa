# ADR-001 Monorepo and Workspace Boundaries

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Casa V1, Angular web istemcisi ile Firebase merkezli backend yaklaşimini ayni repo icinde yonetmek zorundadir. Baslangicta klasor sinirlari netlestirilmezse `shared` benzeri belirsiz alanlar ve yanlis yerlestirilmis dosyalar hizla teknik borc yaratir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Tek uygulama klasoru altinda tum dosyalar | Hizli ama buyume ve sorumluluk ayrimi icin yetersiz |
| Ayrik repolar | Simdilik gereksiz koordinasyon yukü ve docs/source-of-truth daginikligi |
| Monorepo + belirgin kok sinirlari | Tek kaynak, net sorumluluk, koordineli CI/CD |

## Karar

Monorepo kok siniri `apps/web`, `apps/functions`, `firebase`, `operations`, `docs`, `.github` olarak sabitlendi. `shared` klasoru yasaklandi; ortak cross-cutting concern'ler ilgili uygulama icinde `core` altinda ele alinacak.

## Sonuclar

- Repo koku delivery, mimari ve operasyon dokumanlariyla hizali olur.
- Feature bazli gelisim, web ve functions tarafinda benzer katman mantigiyla surdurulur.
- CI/CD ve environment deploy hedefleri netlesir.

## Riskler ve Hafifletme

- Risk: `core` alaninin yeni bir `shared` dumpling klasorune donusmesi.
- Hafifletme: Repo ve folder standardi dokumani ile review kriterleri zorunlu tutulur.

## Onay

- Solution Architect
- Tech Lead

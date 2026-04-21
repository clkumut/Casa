# Yetki ve Sign-Off Matrisi

## Rol Cizgisi

| Rol | Birincil Yetki | Sign-Off Yetkisi | Danisilacak Durumlar |
| --- | --- | --- | --- |
| Product Owner | Urun vizyonu ve V1 onceligi | Scope freeze ve release business kabul | V2 backlog onceligi |
| CTO | Nihai teknik ve governance veto | G0, G1, G2 ve istisnai G5 | Mimari veya guvenlik sapmasi |
| Solution Architect | Mimari sinirlar ve ADR cercevesi | G2 mimari uygunluk | Bounded context ve veri modeli degisikligi |
| Project Manager | Delivery ritmi ve closeout takibi | G3, G4, G5 surec kapanisi | Milestone, risk, issue takibi |
| Tech Lead | Uygulama standardi ve entegrasyon kalitesi | G2 teknik hazirlik, G3 build ready, G4 WP teknik kapanis | Klasor standardi, route, veri akisi |
| Security Engineer | Guvenlik modeli ve trusted boundary | G2 guvenlik uygunlugu, G5 release guvenlik onayi | Rules, auth, analytics veri minimizasyonu |
| DevOps Engineer | Environment, CI/CD, rollback, operasyon | G3 ortam hazirligi, G5 deploy hazirligi | Emulator, pipeline, release operasyonu |
| QA Engineer | Kalite kapisi ve dogrulama | G4 kalite kapanisi, G5 release kalite onayi | RTL, Arapca render, smoke test |
| UI/UX Lead | Bilgi mimarisi ve deneyim standardi | G1 IA uygunlugu konusunda danisilan imza | Shell, onboarding, RTL, okunabilirlik |

## Artefact Bazli Yetki Matrisi

| Artefact | Hazirlayan | Inceleyen | Zorunlu Sign-Off |
| --- | --- | --- | --- |
| Governance Charter | CTO veya PM | SA, TL, Security, DevOps | CTO |
| ORD | PM | TL, ilgili liderler | PM |
| DEC | Karar sahibi rol | Etkilenen tum roller | CTO veya atanmis karar otoritesi |
| ADR | SA veya TL | Security, DevOps, PM gerektiginde | SA + TL |
| Product baseline | Product Owner, TL | UI/UX, QA, SA | Product Owner + TL |
| Architecture baseline | SA, TL | Security, DevOps | SA + TL + Security |
| Ops baseline | DevOps, TL | Security, QA, PM | DevOps + TL |
| EVD release kaydi | WP sahibi veya release owner | QA, Security, DevOps | QA + PM |
| APR kaydi | Gate owner | Yetkili roller | Matriste tanimli tum imzalar |

## Gate Bazli Sign-Off

| Gate | Zorunlu Belgeler | Zorunlu Imza |
| --- | --- | --- |
| G0 Brief Acceptance | Governance charter, source-of-truth map, ORD-001 | CTO, PM |
| G1 Scope Freeze | DEC-002, V1 scope, V1 out-of-scope, V2 backlog | Product Owner, PM, TL |
| G2 Architecture Freeze | ADR 001-010, system overview, security model, firestore model | SA, TL, Security, DevOps |
| G3 Build Ready | Repo/folder standardi, environment, emulator, seed, CI/CD plan | TL, DevOps, QA |
| G4 WP Close | Ilgili EVD, DoD ve test kaydi | TL, QA, PM |
| G5 Release Ready | Release evidence, smoke, rollback, operational readiness | PM, QA, Security, DevOps, gerekirse CTO |

## Kapanis Kurallari

- Imza zincirinin eksik oldugu hicbir gate kapatilmaz.
- Sign-off, kanitsiz verilmez; ilgili EVD kaydi APR kaydina baglanir.
- Mimari ve guvenlik alanlarinda kosullu onay ancak risk ve hafifletme maddesi yazili ise gecerlidir.

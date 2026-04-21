# Source of Truth Haritasi

## Amac

Bu harita, hangi karar veya detayin hangi belge ailesinde baglayici oldugunu gosterir. Ayni konu birden fazla dosyada gecse bile tek resmi kaynak burada belirtilen dosyadir.

## Oncelik Sirasi

| Oncelik | Konu | Resmi Kaynak | Yardimci Kaynaklar | Not |
| --- | --- | --- | --- | --- |
| 1 | Baslangic niyeti ve sabit guardrail | [../CTO_ilk_prompt.md](../CTO_ilk_prompt.md) | [governance-charter.md](./governance-charter.md) | L0 referans, korunur |
| 2 | Governance modeli | [governance-charter.md](./governance-charter.md) | [authority-and-signoff-matrix.md](./authority-and-signoff-matrix.md) | Emir, karar, kanit, onay isleyisi |
| 3 | Dokumantasyon tabani | [../decisions/DEC-001-documentation-baseline.md](../decisions/DEC-001-documentation-baseline.md) | [../README.md](../README.md) | Dokuman aileleri ve yazim kurallari |
| 4 | V1 scope | [../decisions/DEC-002-v1-scope-baseline.md](../decisions/DEC-002-v1-scope-baseline.md) | [../product/v1-scope-baseline.md](../product/v1-scope-baseline.md) | Scope freeze referansi |
| 5 | Delivery modeli | [../decisions/DEC-003-delivery-governance-model.md](../decisions/DEC-003-delivery-governance-model.md) | [../delivery/execution-plan-v1.md](../delivery/execution-plan-v1.md) | Gate ve closeout kurallari |
| 6 | Repo ve sinirlar | [../adr/ADR-001-monorepo-and-workspace-boundaries.md](../adr/ADR-001-monorepo-and-workspace-boundaries.md) | [../architecture/repo-and-folder-standards.md](../architecture/repo-and-folder-standards.md) | `shared` yasagi ve kok agaci |
| 7 | Shell ve routing | [../adr/ADR-002-shell-and-routing-strategy.md](../adr/ADR-002-shell-and-routing-strategy.md) | [../product/information-architecture.md](../product/information-architecture.md) | Shell aileleri ve route gruplari |
| 8 | Frontend ve Firebase siniri | [../adr/ADR-003-frontend-layering-and-firebase-boundary.md](../adr/ADR-003-frontend-layering-and-firebase-boundary.md) | [../architecture/angular-application-architecture.md](../architecture/angular-application-architecture.md) | Domain/application/infrastructure ayrimi |
| 9 | Trusted writes | [../adr/ADR-004-firebase-trusted-write-model.md](../adr/ADR-004-firebase-trusted-write-model.md) | [../architecture/security-authorization.md](../architecture/security-authorization.md) | Istemci yazim siniri |
| 10 | Firestore tanecik yapisi | [../adr/ADR-005-firestore-document-granularity-and-projections.md](../adr/ADR-005-firestore-document-granularity-and-projections.md) | [../architecture/firestore-data-model.md](../architecture/firestore-data-model.md) | Catalog, snapshot, projection, event, edge ayrimi |
| 11 | Mufredat omurgasi | [../adr/ADR-006-curriculum-prerequisite-graph-and-v1-cut.md](../adr/ADR-006-curriculum-prerequisite-graph-and-v1-cut.md) | [../product/curriculum-backbone.md](../product/curriculum-backbone.md) | V1 curriculum cut burada sabitlenir |
| 12 | Oyunlastirma | [../adr/ADR-007-gamification-economy-quest-league-projections.md](../adr/ADR-007-gamification-economy-quest-league-projections.md) | [../product/gamification-economy.md](../product/gamification-economy.md) | XP, gems, hearts, league |
| 13 | Guvenlik modeli | [../adr/ADR-008-security-rules-and-role-model.md](../adr/ADR-008-security-rules-and-role-model.md) | [../architecture/security-authorization.md](../architecture/security-authorization.md) | Role, rule ve approval etkisi |
| 14 | Environment ve seed | [../adr/ADR-009-environment-emulator-seed-strategy.md](../adr/ADR-009-environment-emulator-seed-strategy.md) | [../ops/firebase-environments.md](../ops/firebase-environments.md) | Ayrik proje siniri ve seed siniflari |
| 15 | Ops/admin siniri | [../adr/ADR-010-ops-admin-boundary-and-content-publishing.md](../adr/ADR-010-ops-admin-boundary-and-content-publishing.md) | [../ops/operational-readiness.md](../ops/operational-readiness.md) | OpsShell ve icerik yayin akisi |

## Okuma ve Uygulama Kurali

1. Yeni bir is baslamadan once ilgili ORD okunur.
2. Isin dayandigi karar DEC veya ADR ile dogrulanir.
3. Uygulama detaylari product, architecture veya ops ailelerinden alinır.
4. Kapanis icin EVD ve APR kaydi acilmadan is tamamlanmis sayilmaz.

## Celiski Cozum Kuralı

- Product ve architecture belgeleri birbiriyle celisirse ilgili ADR ustundur.
- Delivery plani V1 scope ile celisirse DEC-002 ustundur.
- Evidence veya approval kaydindaki ifade karari degistiremez; yalnizca uygulamanin belirli tarihteki durumunu kaydeder.

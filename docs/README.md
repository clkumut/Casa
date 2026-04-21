# Casa Dokumantasyon Ana Dizini

Bu dizin, Casa V1 Arapca oyunlastirilmis ogrenme platformunun kurumsal baslangic omurgasini tasir. Bu set, [CTO_ilk_prompt.md](./CTO_ilk_prompt.md) dosyasini degistirmez; onu L0 tek kaynak brief olarak korur ve diger tum artefact'lari ona baglar.

## Amac

- V1 kapsamini sabitlemek
- Mimari ve operasyonel karar zincirini yazili hale getirmek
- Uygulama baslamadan once emir, karar, kanit ve onay artefact'larini baglayici kurala donusturmek
- Product, architecture, ops ve delivery ailelerini tek sorumluluklu dosyalar halinde ayirmak

## Source of Truth Sirasi

| Sira | Artefact Ailesi | Rol | Not |
| --- | --- | --- | --- |
| 1 | [CTO_ilk_prompt.md](./CTO_ilk_prompt.md) | L0 baslangic brief'i | Korunur, uzerine yazilmaz |
| 2 | [governance/governance-charter.md](./governance/governance-charter.md) | Calisma anayasasi | Yorum celiskisi burada cozumlulur |
| 3 | [decisions/DEC-LOG.md](./decisions/DEC-LOG.md) ve [adr](./adr) | Karar kayitlari | Mimari, scope ve operasyonel kalicilik |
| 4 | [product](./product), [architecture](./architecture), [ops](./ops) | Uygulanabilir detaylar | Karar kayitlarini uygular |
| 5 | [delivery](./delivery) ve [orders](./orders) | Is baslatma ve yurutme | ORD zinciri ve work package yapisi |
| 6 | [evidence](./evidence) | Kapanis kaniti | Gate ve release kaniti burada toplanir |
| 7 | [approvals](./approvals) | Yazili onay | Resmi kapanis kaydi |

## Dokuman Agaci

```text
docs/
├── CTO_ilk_prompt.md
├── README.md
├── governance/
├── orders/
├── decisions/
├── product/
├── architecture/
├── ops/
├── runbooks/
├── delivery/
├── evidence/
├── approvals/
└── adr/
```

## Dosya Aileleri

| Aile | Sorumluluk | Tipik Okuyucu | Guncelleme Tetikleyicisi |
| --- | --- | --- | --- |
| Governance | Yetki, ritim, degisiklik ve kapanis kurallari | CTO, PM, Tech Lead | Yeni gate, yeni otorite, policy degisikligi |
| Orders | Is baslatma emirleri ve delegasyon baglami | PM, Tech Lead, ekip liderleri | Yeni inisiyatif, milestone baslangici |
| Decisions | V1 kapsam, dokumantasyon ve delivery karar kayitlari | CTO, SA, TL | Scope, governance veya prensip degisikligi |
| Product | V1 urun siniri, bilgi mimarisi, mufredat, oyunlastirma, sosyal sistem | Product, UX, TL | Scope freeze oncesi ve DEC onayi sonrasi |
| Architecture | Angular, Firebase, Firestore, guvenlik ve veri akislarinin hedef mimarisi | SA, TL, Security, DevOps | Mimari freeze, ADR karari |
| Ops | Environment, emulator, seed, CI/CD ve release operasyonu | DevOps, TL, PM | Release planlama, operational readiness |
| Runbooks | Uygulanabilir operasyon adimlari | DevOps, QA, TL | Release, rollback, smoke test ihtiyaci |
| Delivery | Milestone, work package, risk, DoR/DoD ve issue taksonomisi | PM, TL, QA | Planlama ve closeout |
| Evidence | Gate ve release kanit kayitlari | QA, PM, Security, DevOps | Her gate kapanisi ve release adayi |
| Approvals | Resmi imza ve yetki kaydi | CTO, PM, QA, Security, TL | Gate veya release kapanisi |
| ADR | Kalici mimari ve operasyonel kararlar | SA, TL, Security, DevOps | Architecture freeze ve sonraki degisiklikler |

## Okuma Sirasi

1. [CTO_ilk_prompt.md](./CTO_ilk_prompt.md)
2. [governance/governance-charter.md](./governance/governance-charter.md)
3. [governance/source-of-truth-map.md](./governance/source-of-truth-map.md)
4. [decisions/DEC-001-documentation-baseline.md](./decisions/DEC-001-documentation-baseline.md)
5. [decisions/DEC-002-v1-scope-baseline.md](./decisions/DEC-002-v1-scope-baseline.md)
6. [architecture/system-overview.md](./architecture/system-overview.md)
7. [product/v1-scope-baseline.md](./product/v1-scope-baseline.md)
8. [delivery/execution-plan-v1.md](./delivery/execution-plan-v1.md)

## Kullanım Kurallari

- V1 kapsam degisikligi once DEC, sonra ilgili product ve delivery dosyalarinda yansitilir.
- Mimari degisiklikler ADR olmadan architecture ailesine kalici olarak yazilmaz.
- Evidence veya approval olmadan hicbir gate kapanmis kabul edilmez.
- `shared` klasoru bu repo icin yasaktir; ortak cross-cutting sorumluluklar `core` altina yerlestirilir.
- Mock runtime veri, placeholder response veya demo array kullanimi bu dokuman setine gore uyumsuzluk sayilir.

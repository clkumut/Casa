# APR Index

## Amaç

APR kayitlari, gate ve release sign-off'larini resmi hale getirir. Bu indeks, beklenen approval kimliklerini ve minimum alanlarini sabitler.

## Zorunlu Alanlar

| Alan | Aciklama |
| --- | --- |
| APR ID | Benzersiz approval kimligi |
| Gate veya Release | Hangi kapanis icin imza toplandigi |
| Bagli EVD | Kanit kaydi |
| Imza Veren Roller | Gerekli tum roller |
| Karar | Pending/Not Started olabilir; finalde Approved, Conditional, Rejected |
| Tarih | Imza zamani |
| Not | Kosul veya ret gerekcesi |

## Gate Approval Kayitlari

| APR ID | Konu | Gerekli Roller | Durum | Detay |
| --- | --- | --- | --- | --- |
| APR-G0-001 | Brief Acceptance | CTO, PM | Pending | [APR-G0-001](./gates/APR-G0-001-brief-acceptance.md) |
| APR-G1-001 | Scope Freeze | Product Owner, PM, TL | Pending | [APR-G1-001](./gates/APR-G1-001-scope-freeze.md) |
| APR-G2-001 | Architecture Freeze | SA, TL, Security, DevOps | Pending | [APR-G2-001](./gates/APR-G2-001-architecture-freeze.md) |
| APR-G3-001 | Build Ready | TL, DevOps, QA | Approved | [APR-G3-001](./gates/APR-G3-001-build-ready.md) |
| APR-G5-001 | Release Ready | PM, QA, Security, DevOps | Not Started | [APR-G5-001](./gates/APR-G5-001-release-ready.md) |

## Gate Approval Dizini

- Kullanim standardi: [./gates/README.md](./gates/README.md)
- G0, G1 ve G2 approval kayitlari kanit toplandigi halde resmi karar bekleyen durumdadir.
- G3 approval kaydi resmi karar verilmis gate sonucunu tutar.
- G5 approval kaydi, kanit paketi tamamlanmadan karar verilmeyecegini acikca belirtir.

## Kural

- EVD baglantisi olmayan APR kaydi gecersizdir.
- Conditional onaylar risk register ve next action ile birlikte yazilir.

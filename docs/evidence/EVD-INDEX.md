# EVD Index

## Amaç

Bu indeks, gate ve release kanitlarinin hangi kimlikle tutulacagini ve hangi alanlari icermesi gerektigini sabitler.

## Zorunlu Alanlar

| Alan | Aciklama |
| --- | --- |
| EVD ID | Benzersiz kimlik |
| Kapsam | Gate, milestone veya release |
| Bagli ORD | Baslatan emir |
| Bagli DEC/ADR | Dayanak karar |
| Kanit Tipi | Test, smoke, deploy, audit, publish, security |
| Tarih | Kanitin olustugu an |
| Sahip | Kaniti toplayan rol |
| Sonuc | Draft/Pending asamasinda bos veya gecici olabilir; finalde Pass, Conditional, Fail |

## Gate Kayitlari

| EVD ID | Konu | Durum | Bagli Slice | Detay |
| --- | --- | --- | --- | --- |
| EVD-G0-001 | Brief Acceptance Evidence | Draft - Evidence Collected | WP-001 / ORD-001 | [EVD-G0-001](./gates/EVD-G0-001-brief-acceptance.md) |
| EVD-G1-001 | Scope Freeze Evidence | Draft - Evidence Collected | WP-001 / ORD-001 | [EVD-G1-001](./gates/EVD-G1-001-scope-freeze.md) |
| EVD-G2-001 | Architecture Freeze Evidence | Draft - Evidence Collected | WP-001, WP-002 / ORD-001, ORD-002 | [EVD-G2-001](./gates/EVD-G2-001-architecture-freeze.md) |
| EVD-G3-001 | Build Ready Evidence | Pass | WP-002 / ORD-002 | [EVD-G3-001](./gates/EVD-G3-001-build-ready.md) |
| EVD-G4-001 | WP-005 Close Evidence | Draft - Evidence Collected | WP-005 / ORD-004 | [EVD-G4-001](./gates/EVD-G4-001-wp-005-close.md) |
| EVD-G5-001 | Release Ready Evidence | Not Started - Planned Evidence | WP-011 / ORD TBD | [EVD-G5-001](./gates/EVD-G5-001-release-ready.md) |

## Work Package Kayitlari

| EVD ID | Konu | Durum | Bagli Slice | Detay |
| --- | --- | --- | --- | --- |
| EVD-WP-005-001 | Trusted Learning Completion Evidence | Draft - Evidence Collected | WP-005 / ORD-004 | [EVD-WP-005-001](./work-packages/EVD-WP-005-001-trusted-learning-completion.md) |

## Gate Kayit Dizini

- Kullanim standardi: [./gates/README.md](./gates/README.md)
- G0, G1 ve G2 kayitlari kanit toplandigini, resmi approval'in ise bekledigini belirtir.
- G3 kaydi kanit ve approval zinciri tamamlanmis gate sonucunu tutar.
- G5 kaydi yalniz planlanan kanit listesini tutar; gate sonucu ilan etmez.

## Isletim Kurali

- Her EVD kaydi ilgili APR kaydina referans verir.
- Conditional sonuc ancak risk/hafifletme metni varsa kabul edilebilir.

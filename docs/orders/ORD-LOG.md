# ORD Log

## Amac

Bu log, Casa V1 icin acilan resmi emir kayitlarini tutar. Her uygulama isi bir ORD numarasina baglanir; bir emir olmadan work package baslatilmaz.

## Kayitlar

| ORD ID | Baslik | Durum | Tarih | Sahip | Bagli Kararlar | Sonraki Gate |
| --- | --- | --- | --- | --- | --- | --- |
| [ORD-001](./ORD-001-v1-initiation.md) | V1 Initiation and Documentation Backbone | Open | 2026-04-21 | Project Manager | DEC-001, DEC-002, DEC-003 | G0 |
| [ORD-002](./ORD-002-repo-and-environment-scaffold.md) | Repo and Environment Scaffold | Closed | 2026-04-21 | Project Manager | DEC-003, ADR-001, ADR-002, ADR-003, ADR-009, ADR-010 | G3 |
| [ORD-003](./ORD-003-auth-and-onboarding.md) | Auth and Onboarding | Open | 2026-04-21 | Project Manager | DEC-002, ADR-002, ADR-003, ADR-004, ADR-008 | G4 |

## Log Kurallari

- Her ORD tek bir ana girisim baslatir.
- Bir ORD, kapsadigi deliverable ve kapanis kaniti baglanmadan `Closed` olamaz.
- Scope degisirse mevcut ORD degistirilmez; yeni ORD veya yeni DEC acilir.
- Delivery work package durumlari ile ORD durumu celisemez; fark varsa work package kaydi guncellenir.

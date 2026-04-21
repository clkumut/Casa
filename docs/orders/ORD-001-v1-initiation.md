# ORD-001 V1 Initiation and Documentation Backbone

## Emir Kimligi

| Alan | Deger |
| --- | --- |
| Emir ID | ORD-001 |
| Tarih | 2026-04-21 |
| Durum | Open |
| Emir Sahibi | Project Manager |
| Teknik Sponsor | CTO |
| Bagli Brief | [../CTO_ilk_prompt.md](../CTO_ilk_prompt.md) |

## Emirin Amaci

Casa V1 Arapca oyunlastirilmis ogrenme platformu icin kod yazimina gecmeden once governance, product, architecture, ops, delivery, evidence, approval ve ADR omurgasini kurmak.

## Kapsam

- Dokuman ailelerini source-of-truth sirasina gore olusturmak
- V1 kapsam ve V2 backlog ayrimini yazili hale getirmek
- Angular ve Firebase tabanli hedef mimariyi baglayici kararlara donusturmek
- G0-G5 gate modeli ve ORD/DEC/EVD/APR zincirini isletmek

## Kapsam Disi

- Uygulama kodu gelistirme
- V2 ozelliklerinin delivery planina alinmasi
- Teknoloji secimini yeniden tartismak

## Baglayici Direkifler

1. `shared` klasoru acilmayacak.
2. Gercek veri akisi Firebase uzerinden tanimlanacak.
3. Trusted yazimlar Cloud Functions ile isletilecek.
4. V1 curriculum cut ADR ile sabitlenecek.
5. Sag sabit bilgi alani AppShell sayfalarinda zorunlu olacak.

## Beklenen Ciktilar

- Governance cekirdegi
- V1 urun ve curriculum baseline'i
- Mimari, Firestore ve guvenlik omurgasi
- Ops, release ve runbook standardi
- Delivery planlari ve risk kaydi
- ADR 001-010 seti

## Kapanis Icin Gerekli Kanit

- G0 icin governance ve source-of-truth belgeleri yayinda olmali
- G1 icin DEC-002 ve product baseline tamam olmali
- G2 icin ADR seti ve architecture ailesi tamam olmali
- G3 icin ops ve runbook ailesi uygulanabilir olmali

## Onay Zinciri

- G0: CTO, PM
- G1: Product Owner, PM, Tech Lead
- G2: Solution Architect, Tech Lead, Security, DevOps
- G3: Tech Lead, DevOps, QA

# Issue Taxonomy

## Amaç

Issue taksonomisi, delivery kayitlarinin ayni dille acilmasi ve dogru artefact'a baglanmasi icin kullanilir.

## Tipler

| Tip | Kullanim |
| --- | --- |
| Epic | Milestone seviyesinde buyuk teslimat paketi |
| Work Package | Delivery katalogundaki resmi paket |
| Feature | Kullaniciya donuk islev |
| Tech Task | Teknik uygulama isi |
| Risk | Risk register'dan tureyen takip kaydi |
| Defect | Hata veya regression |
| Security Finding | Rules, auth, data exposure veya trusted write bulgusu |
| Ops Task | Deploy, publish, environment, rollback isi |

## Oncelik ve Siddet

| Seviye | Anlam |
| --- | --- |
| P0 / Blocker | Release durur |
| P1 / High | Ana akislardan biri bozulur |
| P2 / Medium | Belirli feature etkilenir |
| P3 / Low | Kozmetik veya dusuk riskli kusur |

## Artefact Baglama Kurali

- Scope veya governance etkisi varsa DEC baglanir.
- Mimari etkisi varsa ADR baglanir.
- Kapanis icin EVD referansi zorunludur.
- Gate sign-off'u gerekiyorsa APR referansi eklenir.

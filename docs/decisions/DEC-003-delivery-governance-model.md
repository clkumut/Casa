# DEC-003 Delivery Governance Model

## Durum

Accepted

## Tarih

2026-04-21

## Baglam

Proje sadece backlog listeleriyle yurutulurse kapanis kriterleri bulanık kalir. Brief, delivery'nin `emir`, `karar`, `kanit` ve `onay` zinciri ile yurutulmesini zorunlu kilar.

## Karar

- Tum is baslangiclari ORD ile kayda gecirilir.
- Scope, governance, mimari etkisi olan delivery degisiklikleri DEC veya ADR ile resmilestirilir.
- Her gate ve release kapanisi EVD kaydiyla desteklenir.
- G0-G5 gate modeli delivery omurgasi olarak benimsenir.
- APR kaydi olmadan hicbir gate resmen kapanmis sayilmaz.

## Sonuclar

- Delivery ilerlemesi izlenebilir, denetlenebilir ve geri izlenebilir hale gelir.
- PM, TL, QA, Security ve DevOps icin sign-off sorumluluklari netlesir.
- Release hazirligi yalniz teknik derleme ile degil, operasyonel ve guvenlik kaniti ile de ölçulur.

## Etkilenen Belgeler

- [../orders/ORD-LOG.md](../orders/ORD-LOG.md)
- [../delivery/milestone-plan-v1.md](../delivery/milestone-plan-v1.md)
- [../evidence/EVD-INDEX.md](../evidence/EVD-INDEX.md)
- [../approvals/APR-INDEX.md](../approvals/APR-INDEX.md)
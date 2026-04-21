# Risk Register

## Riskler

| Risk ID | Risk | Olasilik | Etki | Sahip | Hafifletme |
| --- | --- | --- | --- | --- | --- |
| R-001 | V1 kapsamına V2 fikirlerinin sizmasi | Orta | Yuksek | PM | DEC-002 ve backlog disiplini |
| R-002 | RTL ve Arapca render sorunlari | Yuksek | Yuksek | Tech Lead + QA | Ayrik smoke ve UI validation |
| R-003 | Trusted write mantiginin istemciye kaymasi | Orta | Kritik | Tech Lead + Security | ADR-004 ve function-first kontrolu |
| R-004 | Firestore rules regression | Orta | Kritik | Security | Rule testleri ve G5 guvenlik imzasi |
| R-005 | Seed verinin gercek veri modelinden sapmasi | Orta | Yuksek | Tech Lead | Seed stratejisi ve emulator parity |
| R-006 | Curriculum cut'in fazla buyuk kalmasi | Orta | Yuksek | Product Owner + PM | Part 2'yi V2 backlog'ta tutmak |
| R-007 | League ve social projection performans riski | Orta | Orta | Solution Architect | Projection ve index optimizasyonu |
| R-008 | OpsShell yetkisinin fazla genis verilmesi | Dusuk | Yuksek | Security + DevOps | Claim bazli sinirlama ve audit |
| R-009 | Release evidence zincirinin eksik kalmasi | Orta | Yuksek | PM | EVD/APR zorunlulugu |
| R-010 | Staging ile prod katalog farkinin kontrolsuz buyumesi | Orta | Orta | Ops Publisher | Publish event ve katalog versiyonlama |

## Eskalasyon Kuralı

- Kritik riskler G2 veya G5 oncesinde kapatilmadiysa ilgili gate kapanmaz.
- Hafifletme aksiyonu delivery takvimine WP veya issue olarak baglanir.

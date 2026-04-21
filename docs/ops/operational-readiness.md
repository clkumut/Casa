# Operational Readiness

## Amac

Operational readiness, release'in teknik olarak deploy edilebilir olmasinin otesinde izlenebilir, geri alinabilir ve desteklenebilir olmasini garanti eder.

## Readiness Alanlari

| Alan | Beklenti |
| --- | --- |
| Environment readiness | Dev, staging, prod hedefleri ayrik ve dogru tanimli |
| Data readiness | Seed ve publish akisi kontrol altinda |
| Security readiness | Rules, claims ve trusted write denetimi tamam |
| QA readiness | Smoke listesi, RTL ve Arapca kontrolleri hazir |
| Release readiness | EVD ve APR baglari acik |
| Recovery readiness | Rollback runbook'u ve onceki saglikli surum bilgisi hazir |
| Ops visibility | Audit ve deploy izleri gorulebilir |

## Zorunlu Kontrol Noktalari

1. OpsShell erisimi dogru claim'lerle sinirli.
2. Publish akisinda taslak ve yayinli katalog ayrimi calisiyor.
3. Release evidence kaydinda smoke ve rollback referansi mevcut.
4. Production PII'nin non-prod ortamlara sizmadigi dogrulandi.
5. On-call veya sorumlu ekip listesi release penceresi icin net.

## Kapanis Kriteri

Operational readiness, sadece dokuman varligiyla degil; deploy, rollback ve smoke runbook'larinin ilgili release adayinda fiilen kullanilabilir olmasiyla kapanir.

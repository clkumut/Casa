# Release Management

## Release Ilkesi

Release, teknik deploy ve isletim kapanisinin birlikte yonetildigi kontrollu bir surectir. Her release adayi G5 Release Ready gate'ine baglanir.

## Release Turleri

| Tur | Amac | Gereken Sign-Off |
| --- | --- | --- |
| Internal preview | Ekip ici dogrulama | Tech Lead |
| Staging candidate | UAT ve gate kontrolu | TL, QA, DevOps |
| Production release | Canli cikis | PM, QA, Security, DevOps, gerekirse CTO |

## Release Akisi

1. Scope ve architecture freeze kayitlari dogrulanir.
2. Build Ready ve ilgili work package kapanislari tamamlanir.
3. Staging candidate olusturulur.
4. Smoke, security ve readiness kontrolleri yapilir.
5. EVD kaydi acilir ve APR imzalari toplanir.
6. Production deploy yapilir.
7. Post-release smoke ve monitor adimlari tamamlanir.

## Freeze Kurali

- G5 oncesi release branch'ine yalniz blocker veya high onayli duzeltmeler girer.
- Scope genisleten isler release freeze sirasinda kabul edilmez.

## Rollback Tetikleyicileri

- Login/register akisinin bozulmasi
- Trusted write ekonomisinin hatali davranmasi
- Firestore rules regression
- RTL/Arapca kritik render bozulmasi
- Release sonrasi smoke testte blocker kusur tespiti

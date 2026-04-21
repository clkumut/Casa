# Smoke Tests

## Amaç

Smoke test seti, staging veya production deploy sonrasi V1'in ana kullanici yolculugunun ve trusted write mekanizmasinin ayakta oldugunu hizli bicimde dogrular.

## Cekirdek Yolculuklar

| Alan | Test |
| --- | --- |
| PublicShell | Landing aciliyor, CTA auth akisina yonlendiriyor |
| Auth | Login ve register tamamlanabiliyor |
| Onboarding | Goal, level, habit, path adimlari kaydediliyor |
| Learn | Learning map yukleniyor ve ilk unit gorunuyor |
| ElifBa | Harf/ses icerigi render oluyor |
| Practice | Practice queue aciliyor |
| Quests | Aktif quest listesi ve claim akisi calisiyor |
| Shop | Gem bakiyesi gorunuyor, satin alma sonrasi bakiye guncelleniyor |
| Leaderboard | League projection ve arkadas kesiti aciliyor |
| Profile | Basari ve gorunurluk bilgisi tutarli |
| Settings | Cikis ve tercih guncelleme calisiyor |

## RTL ve Arapca Kontrolleri

1. ElifBa ekraninda harf baglanma bozulmuyor.
2. Hareke ve diacritics okunakli.
3. Dar ekranda kartlar ust uste binmiyor.
4. AppShell sag rayi mobil ve masaustunde gorunur.

## Trusted Write Kontrolleri

1. Lesson completion sonrasi XP ve hearts projection'u guncelleniyor.
2. Quest claim cift tetiklenemiyor.
3. Shop purchase negatif bakiye olusturmuyor.
4. Social acceptance yetkisiz hesapla calismiyor.

## Kayit Kuralı

- Her smoke testi sonucu ilgili EVD kaydina baglanir.
- Blocker sonuc APR sign-off'unu durdurur.

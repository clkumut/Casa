# ADR-002 Shell and Routing Strategy

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Urun, landing, auth/onboarding, authenticated uygulama ve sinirli ops yuzeylerini ayni deneyim akisi icinde ama farkli sorumluluklarla tasimalidir. Tek shell yaklaşimi public ve auth'lu durumlari birbirine karistirir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Tek shell + kosullu layout | Büyüdükce okunabilirligi dusurur |
| Public ve App shell ayrimi | Auth/onboarding ve ops ihtiyacini tek basina karsilamaz |
| PublicShell + AuthOnboardingShell + AppShell + OpsShell | Deneyim baglamlarini net ayirir |

## Karar

Route aileleri dort shell uzerinden kurulacak: PublicShell, AuthOnboardingShell, AppShell ve gerektiginde OpsShell. Temel rotalar `/`, `/auth/login`, `/auth/register`, `/auth/onboarding/*`, `/app/learn`, `/app/elifba`, `/app/practice`, `/app/leaderboard`, `/app/quests`, `/app/shop`, `/app/profile`, `/app/more/settings`, `/ops/*` olarak sabitlendi.

## Sonuclar

- Onboarding ve authenticated app birbirinden net ayrilir.
- AppShell right rail ve sidebar kontrati tum auth'lu sayfalarda korunur.
- Ops akislari son kullanici deneyiminden teknik olarak ayrilir.

## Riskler ve Hafifletme

- Risk: Cok shell yapisi route yonetimini karmasiklastirabilir.
- Hafifletme: Guard ve resolver stratejisi tek belgede sabitlenir; route aileleri feature ownership ile eslenir.

## Onay

- Solution Architect
- Tech Lead

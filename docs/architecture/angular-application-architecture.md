# Angular Application Architecture

## Mimari Hedef

Angular istemci, shell tabanli router yapisi ve feature bazli klasorleme ile kurulur. Her feature, `domain`, `application`, `infrastructure`, `presentation` ve `models` ailelerine ayrilir. Global state yalniz gerekli cekirdek alanlarda tutulur; feature verileri repository + projection odakli akar.

## Route Gruplari ve Shell Eslesmesi

| Route Grubu | Shell | Guard |
| --- | --- | --- |
| `/` | PublicShell | Yok |
| `/auth/login` ve `/auth/register` | AuthOnboardingShell | Guest-only guard |
| `/auth/onboarding/*` | AuthOnboardingShell | Auth guard + onboarding progress guard |
| `/app/*` | AppShell | Auth guard + onboarding-complete guard |
| `/ops/*` | OpsShell | Auth guard + ops-role guard |

## Shell Sorumluluklari

| Shell | Sorumluluk |
| --- | --- |
| PublicShell | Marketing, CTA ve sade public content |
| AuthOnboardingShell | Kimlik islemleri, cok adimli onboarding, hafif progress takibi |
| AppShell | Sidebar, merkez icerik, sag sabit bilgi alani, auth'lu feature nav |
| OpsShell | Yayin, release ve audit baglamli operasyon gorevleri |

## Feature Katmanlari

| Katman | Icerik |
| --- | --- |
| `domain` | Entity'ler, value object'ler, is kurali tipleri, policy kontratlari |
| `application` | Use-case servisleri, facade'lar, command/query orkestrasyonu |
| `infrastructure` | Firebase repository'leri, mapper'lar, data source adapter'lari |
| `presentation` | Pages, containers, dumb UI component'ler, route config |
| `models` | DTO, view model, interface ve command payload dosyalari |

## Angular UI Dosyalama Kurali

- `app/root`, `app/shells`, `app/routes` ve feature `presentation` aileleri Angular'a uygun ayri `ts`, `html`, `scss` dosyalari ile tutulur.
- Her UI yuzeyi kendi aile klasorunde bulunur; `login/login.ts`, `workspace/workspace.html`, `root/routes.ts` gibi dogrudan aile ismi kullanilir.
- `.component` son eki yeni dosyalama standardinin parcasi degildir ve yeni uygulamalarda kullanilmaz.
- Inline `template` ve `styles`, yalniz gecici debug veya kisa omurlu probe istisnasi olarak kabul edilir; kalici kodda commit edilmez.
- Root uygulama girisi `app/root/` altinda toplanir; bootstrap component, application config ve route tanimlari ayni ailede tutulur.

## State Yonetimi

- Auth, shell UI ve right rail meta-state `core/state` altinda tutulur.
- Feature state, Angular Signals veya RxJS stream'leri ile feature icinde yonetilir; V1'de harici global state kutuphanesi zorunlu degildir.
- Firestore'dan okunan projection belgeleri repository uzerinden signal veya observable'a donusturulur.
- Form state, onboarding ve settings gibi alanlarda feature-local tutulur.

## Guard ve Resolver Stratejisi

| Tur | Kullanim |
| --- | --- |
| Auth guard | Giris yapmamis kullaniciyi auth akısına yonlendirir |
| Guest-only guard | Giris yapmis kullanicinin login/register ekranina donmesini engeller |
| Onboarding progress guard | Eksik onboarding adimlarini dogru route'a geri dondurur |
| App readiness resolver | AppShell icin gerekli temel snapshot'lari onceden ceker |
| Ops role guard | OpsShell erisimini custom claim ile sinirlar |

## Veri Siniri

- Presentation katmani Firestore SDK'ya dogrudan erismez.
- Use-case servisleri, repository kontratlari uzerinden projection ve command calistirir.
- Trusted mutasyonlar HTTP callable function veya uygun komut adapter'i uzerinden gider.
- Right rail verisi `rightRailProjection` benzeri tek bir projection uzerinden toplanir; her sayfa ayrik sorgu dagitmaz.

## Route Ailesi Ornekleri

```text
/app/learn
/app/learn/world/:worldId
/app/learn/unit/:unitId
/app/elifba
/app/elifba/letter/:letterId
/app/practice
/app/leaderboard
/app/quests
/app/shop
/app/profile
/app/more/settings
```

## UI ve RTL Kurallari

- Arapca icerik kartlari RTL ve harf baglanma dogrulamasindan gecmeden release edilmez.
- AppShell sag rayi layout contract'idir; feature sayfasi bunu kaldiramaz veya gizleyemez.
- PublicShell daha hafif olabilir, ancak AppShell icinde navigation ve metrik satiri tutarli kalir.

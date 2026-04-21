# Data Flow Catalog

## Ilke

Hicbir ekran, veri kaynagi veya trusted yazim otoritesi tanimlanmadan acilmaz. Bu katalog, route bazli okuma ve yazim akislarini tek tabloda toplar.

## Ekran Bazli Veri Akislari

| Ekran/Route | Okunan Kaynaklar | Yazilan Komut | Isleyen Katman | Son Projection |
| --- | --- | --- | --- | --- |
| `/` | Public content catalog | Yok | Angular public repository | Landing cards |
| `/auth/login` | Auth state | Login request | Firebase Auth | Session state |
| `/auth/register` | Auth state, onboarding options | Register request | Firebase Auth | Session state |
| `/auth/onboarding/*` | `catalog_onboarding_options`, `users/{uid}` draft | Onboarding save/finalize | Self-write + finalize function | User snapshot |
| `/app/learn` | world, chapter, unit catalogs; progression snapshot; right rail | Lesson start command | Angular -> Function | Learning map projection |
| `/app/elifba` | ElifBa lesson catalog, progression snapshot, right rail | ElifBa lesson completion | Function | ElifBa progression |
| `/app/practice` | practice queue projection, right rail | Practice completion | Function | Updated practice queue + hearts |
| `/app/leaderboard` | `league_week_projections`, `friend_leaderboard_projections`, right rail | Yok veya filter preference | Projection read + limited preference write | Leaderboard view |
| `/app/quests` | quest snapshot, rewards catalog, right rail | Quest claim | Function | Quest snapshot + inventory snapshot |
| `/app/shop` | shop catalog, inventory snapshot, right rail | Purchase command | Function | Inventory snapshot + right rail |
| `/app/profile` | user snapshot, achievement snapshot, social stats projection | Visibility update | Self-write veya function | Profile summary projection |
| `/app/more/settings` | user preferences snapshot | Settings update, logout | Self-write + Auth sign-out | Preferences snapshot |
| `/ops/content` | draft/published catalogs, publish events | Publish command | Ops function | Publish projection |
| `/ops/release` | release evidence projection, audit events | Release promote command | Ops function/pipeline hook | Release status projection |

## Sag Ray Veri Akisi

- Kaynak: `users/{uid}/rightRailSnapshots/default`
- Guncelleme tetikleyicileri: lesson completion, practice recovery, quest claim, purchase, streak rollover, league rollover
- UI soylemi: sabit ust metrik satiri + sayfa baglamli alt kartlar

## Event ve Projection Zinciri

| Olay | Event Koleksiyonu | Isleyici | Etkilenen Projection |
| --- | --- | --- | --- |
| Lesson completion | `learning_completion_events` | Progress/Gamification function | progression, right rail, quest, achievement |
| Quest claim | `quest_claim_events` | Quest reward function | inventory, right rail, quest snapshot |
| Shop purchase | `purchase_command_events` | Purchase function | inventory, right rail |
| Follow/friend accept | `social_command_events` | Social function | social stats, friend leaderboard |
| Publish content | `ops_publish_events` | Publish function | catalog read modeli |

## Veri Akisi Kurallari

- UI projection'lardan okuyarak hizli acilir; ham event koleksiyonlari kullanici yuzeyine verilmez.
- Projection gecikmesi kritik ise right rail ve ilgili ekran skeleton durumunu gosterir; mock veri gostermez.
- Her command idempotent anahtar ile islenir.

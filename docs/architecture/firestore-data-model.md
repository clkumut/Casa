# Firestore Data Model

## Belge Tipi Siniflandirmasi

| Tip | Amac | Ornek |
| --- | --- | --- |
| Catalog | Yayinlanmis ve versiyonlu referans veri | worlds, units, quests, rewards |
| User Snapshot | Kullaniciya ait anlik durum | profile, progression, inventory |
| Event | Islenebilir ve idempotent olay/komut kaydi | lesson completion, purchase command |
| Projection | Sorgu icin optimize edilmis gorunum | right rail, leaderboard, practice queue |
| Edge | Iliski grafi | follow, friend, prerequisite |

## Dokuman Kimlik Stratejisi

- Catalog belgeleri: anlamsal ama stabil kimlik (`world-w1`, `unit-w2-c1-u3`)
- User snapshot belgeleri: `uid` merkezli kimlik veya `users/{uid}/...` altinda alan odakli belge
- Event belgeleri: istemci veya function tarafinda uretilen idempotency anahtari (`evt_{domain}_{timestamp}_{nonce}`)
- Projection belgeleri: sorgu paterniyle uyumlu stabil kimlik (`week-2026-17_bronze`, `uid_right-rail`)
- Edge belgeleri: iki uc ve iliski turu birlesik anahtari (`uidA_uidB_follow`)

## Koleksiyon Listesi

| Koleksiyon | Tip | Icerik |
| --- | --- | --- |
| `catalog_learning_worlds` | Catalog | World metadata, siralama, publish state |
| `catalog_learning_chapters` | Catalog | Chapter metadata, world bagi, order |
| `catalog_learning_units` | Catalog | Unit hedefleri, prerequisite refs, challenge seti |
| `catalog_learning_lessons` | Catalog | Lesson icerigi, medya refs, right rail ipucu |
| `catalog_challenge_templates` | Catalog | Challenge turu, dogrulama semasi |
| `catalog_quizzes` | Catalog | Unit sonu quiz tanimi |
| `catalog_quests` | Catalog | Daily, weekly, curriculum quest tanimi |
| `catalog_rewards` | Catalog | XP, gems, heart ve inventory odul cetveli |
| `catalog_achievements` | Catalog | Basari karti kosullari |
| `catalog_shop_items` | Catalog | Magaza urunleri ve maliyet |
| `catalog_league_tiers` | Catalog | League esikleri ve promotion kurallari |
| `catalog_onboarding_options` | Catalog | Goal, habit, path secenekleri |
| `analytics_event_definitions` | Catalog | Event adi, parametre semasi, privacy class |
| `users` | User Snapshot | Profil, tercih, gorunurluk, onboarding tamamlanma |
| `users/{uid}/progressionSnapshots` | User Snapshot | World, chapter, unit, lesson ilerleyisi |
| `users/{uid}/questSnapshots` | User Snapshot | Quest atama, ilerleme, claim durumu |
| `users/{uid}/achievementSnapshots` | User Snapshot | Achievement progress ve unlock tarihi |
| `users/{uid}/inventorySnapshots` | User Snapshot | Gems bakiyesi, item sahipligi, aktif kozmetik |
| `users/{uid}/rightRailSnapshots` | Projection | XP, streak, gems, hearts ve sayfa kartlari |
| `users/{uid}/practiceQueueSnapshots` | Projection | Tekrar sirasi ve zayif alanlar |
| `league_week_projections` | Projection | Haftalik lig listeleri ve sira |
| `friend_leaderboard_projections` | Projection | Kullanici bazli arkadas leaderboard kesiti |
| `social_follow_edges` | Edge | Takip iliskileri |
| `social_friend_edges` | Edge | Arkadas iliskileri |
| `curriculum_prerequisite_edges` | Edge | Unit/chapter onkosul baglari |
| `learning_completion_events` | Event | Lesson veya quiz tamamlama olaylari |
| `quest_claim_events` | Event | Quest odul talebi |
| `purchase_command_events` | Event | Satin alma komutlari |
| `social_command_events` | Event | Follow, accept, decline, block komutlari |
| `ops_publish_events` | Event | Icerik yayin, versiyon aktivasyonu |
| `ops_audit_events` | Event | Ops ve guvenlik izleri |
| `analytics_validation_events` | Event | Kritik analytics envelope ve validation kayitlari |

## `users` Belgesi Zorunlu Alanlari

| Alan | Tip | Not |
| --- | --- | --- |
| `uid` | string | Auth uid ile ayni |
| `displayName` | string | Gosterim adi |
| `email` | string | Auth ile uyumlu, read kisitli |
| `locale` | string | Varsayilan `tr-TR` |
| `learningDirection` | string | `rtl-supported` benzeri teknik bayrak |
| `goalCode` | string | Onboarding hedef secimi |
| `habitCode` | string | Gunluk hedef secimi |
| `pathMode` | string | ElifBa once veya es zamanli |
| `visibilityLevel` | string | Public, friends-only, leaderboard-only |
| `currentLeagueTier` | string | Projection referansi |
| `activeStreakDays` | number | Function tarafinda guncellenir |
| `lifetimeXp` | number | Function tarafinda guncellenir |
| `currentHearts` | number | Function tarafinda guncellenir |
| `currentGems` | number | Function tarafinda guncellenir |
| `onboardingCompletedAt` | timestamp | Null ise onboarding eksiktir |

## Progression Snapshot Alani

- `currentWorldId`
- `currentChapterId`
- `currentUnitId`
- `currentLessonId`
- `completedLessonIds`
- `masteredUnitIds`
- `failedChallengeCounters`
- `lastPracticedAt`
- `unlockState`

## Quest, Achievement, League ve Inventory Modeli

| Alan | Tutuldugu Yer | Not |
| --- | --- | --- |
| Aktif quest seti | `users/{uid}/questSnapshots` | Daily, weekly, curriculum quest ayrimi |
| Achievement progress | `users/{uid}/achievementSnapshots` | Kural ve durum ayri tutulur |
| League standings | `league_week_projections` | Kullanici skoru ve sira projection |
| Friend leaderboard | `friend_leaderboard_projections` | Kullaniciya ozel kesit |
| Inventory | `users/{uid}/inventorySnapshots` | Bakiye ve sahiplik ayrimi |

## Social Graph Modeli

- `social_follow_edges`: `fromUid`, `toUid`, `createdAt`, `status`
- `social_friend_edges`: `uidA`, `uidB`, `acceptedAt`, `sourceRequestId`
- `social_command_events`: request, accept, decline, block gibi komutlarin idempotent kaydi

## Ops ve Admin Alanlari

| Koleksiyon | Alanlar |
| --- | --- |
| `ops_publish_events` | draftVersion, publishedVersion, actorUid, changeSummary |
| `ops_audit_events` | actionType, actorUid, targetRef, result, createdAt |

## Analytics Event Modeli

- `analytics_event_definitions`: `eventName`, `domain`, `triggerPoint`, `allowedParams`, `privacyClass`, `isEnabled`
- `analytics_validation_events`: `eventName`, `sourceRoute`, `releaseId`, `validationResult`, `createdAt`
- Birincil urun analytics sink'i Firebase Analytics'tir; Firestore tarafindaki analytics belgeleri governance, event standardizasyonu ve release sonrasi dogrulama izi icin tutulur.

## Trusted Write Authority

| Veri | Dogrudan Istemci Yazabilir Mi | Otorite |
| --- | --- | --- |
| Profil gorunurlugu ve temel tercihler | Evet, sinirli | Firestore rules ile self-write |
| Onboarding draft | Evet, sinirli | Self-write veya callable finalize |
| XP, streak, hearts, gems | Hayir | Function |
| Progress completion | Hayir | Function |
| Quest claim | Hayir | Function |
| Shop purchase | Hayir | Function |
| Social acceptance | Hayir | Function |
| League sira yazimi | Hayir | Scheduler/function |

## Index Ihtiyaci

- `league_week_projections`: `weekId + tier + rank`
- `catalog_learning_units`: `chapterId + order + publishState`
- `users/{uid}/questSnapshots`: `status + expiresAt`
- `users/{uid}/practiceQueueSnapshots`: `priority + updatedAt`
- `social_follow_edges`: `toUid + status + createdAt`
- `social_friend_edges`: `uidA + acceptedAt` ve `uidB + acceptedAt`

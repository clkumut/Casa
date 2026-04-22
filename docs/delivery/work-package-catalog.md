# Work Package Catalog

## Ilke

Work package'lar teslimati yonetilebilir dilimlere ayirir. Her WP tek ana amaca sahiptir, bagimliliklari aciktir ve kapanisi kanitla olculur.

## WP Listesi

| WP ID | Baslik | Durum | Kapsam | Bagimlilik | Detay |
| --- | --- | --- | --- | --- | --- |
| WP-001 | Governance and Baseline | Completed - Awaiting Formal Gate Confirmation | ORD/DEC/product/architecture baselining | Yok | [WP-001](./work-packages/WP-001-governance-and-baseline.md) |
| WP-002 | Repo and Environment Scaffold | Completed | Repo scaffold, environment, emulator, seed ve ops iskeleti | WP-001 | [WP-002](./work-packages/WP-002-repo-and-environment-scaffold.md) |
| WP-003 | Auth and Onboarding | In Progress | Login, register, onboarding, guards | WP-002 | [WP-003](./work-packages/WP-003-auth-and-onboarding.md) |
| WP-004 | Curriculum Catalog and Learning Map | Planned | ElifBa + Part 1 katalog ve learning map projection | WP-002 | [WP-004](./work-packages/WP-004-curriculum-catalog-and-learning-map.md) |
| WP-005 | Trusted Learning Completion | In Progress | Lesson completion, progression, XP, hearts | WP-003, WP-004 | [WP-005](./work-packages/WP-005-trusted-learning-completion.md) |
| WP-006 | Practice and Recovery Loop | Planned | Practice queue ve recovery | WP-005 | [WP-006](./work-packages/WP-006-practice-and-recovery-loop.md) |
| WP-007 | Quests Achievements and Shop | Planned | Quest, reward, purchase, inventory | WP-005 | [WP-007](./work-packages/WP-007-quests-achievements-and-shop.md) |
| WP-008 | League and Leaderboard | Planned | Weekly league, ranking, friend slice | WP-005, WP-009 | [WP-008](./work-packages/WP-008-league-and-leaderboard.md) |
| WP-009 | Social Graph and Profile | Planned | Follow, friend request, visibility, profile | WP-003 | [WP-009](./work-packages/WP-009-social-graph-and-profile.md) |
| WP-010 | Ops Publish and Release Control | Planned | Ops shell, publish, release control | WP-002, WP-004 | [WP-010](./work-packages/WP-010-ops-publish-and-release-control.md) |
| WP-011 | Hardening and Release | Planned | Hardening, smoke, rollback, approvals | Tum onceki WP'ler | [WP-011](./work-packages/WP-011-hardening-and-release.md) |

## Resmi Takip Noktasi

- Work package durumunun resmi kaynagi artik `docs/delivery/work-packages/` altindaki tekil dosyalardir.
- Katalog tablosu ozet gorunumdur; kapsam, cikis kriteri ve kanit beklentisi detay dosyasindan okunur.
- Bir work package icin ORD acilmamis ise durum `Planned` seviyesini asamaz.

## WP Yonetim Kurali

- Bir WP kapanmadan bagimli WP `Done` sayilmaz.
- WP kapsam genislemesi delivery notu ile degil; gerekirse yeni WP veya DEC ile ele alinir.
- WP dosyasi, ORD, EVD ve APR kayitlari birlikte guncellenmeden gercek durum degistirilmis sayilmaz.

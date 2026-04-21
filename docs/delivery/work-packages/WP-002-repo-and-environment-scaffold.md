# WP-002 Repo and Environment Scaffold

## Amac

Casa V1 icin repo calisma yuzeylerini, Firebase baseline artefact'larini ve operasyon klasor iskeletini build-ready asamasina tasimak.

## Durum

`Completed`

## Bagli Emir

- [../../orders/ORD-002-repo-and-environment-scaffold.md](../../orders/ORD-002-repo-and-environment-scaffold.md)

## Dayandigi Kararlar

- DEC-003 Delivery Governance Model
- ADR-001 Monorepo and Workspace Boundaries
- ADR-002 Shell and Routing Strategy
- ADR-003 Frontend Layering and Firebase Boundary
- ADR-009 Environment Emulator Seed Strategy
- ADR-010 Ops Admin Boundary and Content Publishing

## Kapsam

- `apps`, `firebase` ve `operations` yuzeylerinin resmi delivery slice'i olarak dogrulanmasi
- Repo siniri, klasor standardi ve environment ayriminin fiziksel scaffold olarak kurulmasi
- Emulator, seed, smoke ve release klasorlerinin calisabilir delivery planina baglanmasi

## Kapsam Disi

- Auth ve feature implementasyonu
- Trusted write is akislari
- Release approval kapanisi

## Bagimliliklar

- [WP-001-governance-and-baseline.md](./WP-001-governance-and-baseline.md)
- Repo ve klasor standartlari
- Firebase environment ve emulator stratejisi

## Baslangic Kriterleri

- Governance ve kapsam baseline'i yayinda olmali
- Repo klasorleri delivery planinda adlandirilmis olmali

## Cikis Kriterleri

- Gercek environment binding stratejisi dosya ve runbook seviyesiyle tanimlanmis olmali
- Build toolchain secimi ve calistirma giris noktalari repo icinde gozlenebilir olmali
- Emulator calistirma adimlari ve smoke kaniti toplanmis olmali
- G3 gate incelemesine girecek artefact listesi hazir olmali

## Beklenen Kanitlar

- [../../evidence/gates/EVD-G2-001-architecture-freeze.md](../../evidence/gates/EVD-G2-001-architecture-freeze.md)
- [../../evidence/gates/EVD-G3-001-build-ready.md](../../evidence/gates/EVD-G3-001-build-ready.md)

## Gerekli Onaylar

- [../../approvals/gates/APR-G2-001-architecture-freeze.md](../../approvals/gates/APR-G2-001-architecture-freeze.md)
- [../../approvals/gates/APR-G3-001-build-ready.md](../../approvals/gates/APR-G3-001-build-ready.md)

## Notlar

- `apps`, `firebase` ve `operations` scaffold'i repo icinde mevcut.
- Root workspace manifesti, `tsconfig.base.json`, `.gitignore` ve repo script girisleri eklendi.
- `operations/tooling` altinda environment binding ve build-ready dogrulama scriptleri eklendi.
- `verify-build-ready` statik olarak Firebase config semantigini, Functions bagimlilik hizasini (`firebase-functions`, `firebase-admin`, `engines.node`) ve varsayilan route redirect guard'larini (`auth/login`, `auth/onboarding/welcome`, `app/learn`, `ops/content`) kontrol ediyor.
- `apps/web` icin Angular build, serve ve typecheck girisleri ile shell tabanli placeholder route scaffold'i gozleniyor; varsayilan redirectler artik `auth/login`, `auth/onboarding/welcome`, `app/learn` ve `ops/content` yuzeylerine yonleniyor.
- `apps/functions` icin TypeScript build/typecheck girisleri ve `buildReady` ops handler scaffold'i gozleniyor.
- Dev, staging ve prod icin environment example dosyalari eklendi; gercek proje kimlikleri hardcoded tutulmadi.
- `npm install`, `npm run env:check:local`, `npm run verify:build-ready`, `npm run typecheck` ve `npm run build` komut ciktilari toplandi.
- Local Firebase Emulator Suite auth/functions/firestore/storage servisleriyle basariyla kalkti; `buildReady` smoke sonucu [../../../operations/smoke-tests/dev/SMK-G3-001-build-ready-emulator.md](../../../operations/smoke-tests/dev/SMK-G3-001-build-ready-emulator.md) kaydina baglandi.
- G3 formal sign-off zinciri tamamlandi; WP-003 execution girisi acildi.
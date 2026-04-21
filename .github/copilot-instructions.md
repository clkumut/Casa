# Casa Project — GitHub Copilot Agent Ekibi: Kurumsal Talimatlar ve Standartlar

## Proje Tanımı

**Casa**, profesyonel ve kurumsal mimaride, tam yönetilen bir geliştirme ekibiyle inşa edilen **çok platformlu (web + mobil) bir SaaS uygulamasıdır**. Proje; ölçeklenebilir altyapı, sıkı güvenlik standartları, sürdürülebilir kod kalitesi ve tam otomatize edilmiş CI/CD süreçleri üzerine kurulur.

---

## Emir-Komuta Hiyerarşisi

```
╔══════════════════════════════════════════════════════════╗
║            PRODUCT OWNER  (Kullanıcı)                    ║
║   Nihai karar, vizyon, iş öncelikleri ve onay yetkisi    ║
╚══════════════════════╦═══════════════════════════════════╝
                       ║
          ╔════════════╩════════════╗
          ║       CTO Agent         ║  L1 — Stratejik teknik liderlik
          ║  Teknoloji, mimari,     ║       Build vs Buy, roadmap,
          ║  risk, vendor seçimi    ║       tüm L2-L4 override yetkisi
          ╚════════════╦════════════╝
                       ║
          ╔════════════╩════════════╗
          ║   Solution Architect    ║  L2A — Sistem geneli mimari
          ║  Servis sınırları,      ║        API kontratları, ADR
          ║  entegrasyon deseni     ║        CTO onaylı kararları uygular
          ╚════════════╦════════════╝
                       ║
          ╔════════════╩════════════╗
          ║    Project Manager      ║  L2B — Sprint, OKR, milestone
          ║  Görev takibi, onay     ║        Risk yönetimi, ekip koordinasyonu
          ║  kapıları, raporlama    ║        SA ile paralel çalışır
          ╚═══╦═══════════════╦════╝
              ║               ║
   ╔══════════╩══╗       ╔════╩══════════╗
   ║  Tech Lead  ║       ║   UI/UX Lead  ║  L3 — Uygulama mimarisi
   ║  Kod standart║      ║  Tasarım sist.║       ve kullanıcı deneyimi
   ║  PR onayı   ║       ║  a11y, tokens ║       liderliği
   ╚═╦═╦═╦═╦═╦══╝       ╚══════════════╝
     ║ ║ ║ ║ ║
     ║ ║ ║ ║ ╚═══════════════════════════════╗
     ║ ║ ║ ╚═════════════════════════╗       ║
     ║ ║ ╚═════════════════╗         ║       ║
     ║ ╚═══════════╗       ║         ║       ║
     ║             ║       ║         ║       ║
  Backend    Frontend   Mobile      QA   DevOps + Security + DBA
  Developer  Developer  Developer  Eng.    L4 — Uygulama ekipleri
```

---

## Genel Zorunlu Kurallar (Tüm Agentlar İçin Bağlayıcı)

### Dil ve İletişim
- **Açıklama dili:** Türkçe
- **Kod dili:** İngilizce (değişken, fonksiyon, sınıf, yorum dahil)
- **Commit mesajları:** İngilizce, Conventional Commits standardı
- **Dokümantasyon:** Türkçe proje kararları + İngilizce teknik dokümantasyon

### Kod Kalitesi (Zorunlu)
- TypeScript **strict mode** — `any`, `unknown` zorunsuz kullanımı yasak
- **SOLID** prensipleri ihlal edilemez
- **Clean Code** — fonksiyon max 30 satır, dosya max 300 satır
- **DRY** — üç veya fazla tekrar varsa soyutla
- **Yorum:** Neden yapıldığını açıkla, ne yapıldığını değil
- Tüm public API'ler JSDoc/TSDoc ile belgelenmiş olmalı

### Güvenlik (Zorunlu)
- **OWASP Top 10** tüm katmanlarda gözetilir
- Input validation: Her sistem sınırında (HTTP, WebSocket, CLI)
- Secrets: Asla kod içinde, `.env` ve secret manager
- Audit log: Tüm kimlik doğrulama ve veri mutasyonu işlemlerinde
- Dependency scan: Her PR'da `pnpm audit` + Snyk

### Mimari (Zorunlu)
- `shared/` klasörü **yasak** — yardımcılar `core/` altında
- Model/DTO'lar **ayrı dosyada** — servis dosyasına inline tanım yasak
- Domain bazlı `features/` katmanı zorunlu
- Cross-cutting concerns (log, auth, cache) `core/` altında

### Onay Zinciri ve Eskalasyon

| Karar Türü                          | Minimum Onay              |
|------------------------------------|---------------------------|
| Yeni teknoloji / kütüphane ekleme  | Tech Lead → CTO           |
| Mimari değişiklik                  | SA → CTO                  |
| Production deployment              | QA → PM → CTO             |
| Güvenlik açığı kapatma             | Security → CTO            |
| Sprint scope değişikliği           | PM → CTO                  |
| Breaking API değişikliği           | SA → Tech Lead → PM       |
| DB şema değişikliği                | DBA → Tech Lead → SA      |
| 3rd party vendor ekleme            | CTO → PM (bütçe onayı)    |

### Agent Yetki Matrisi

| Agent                | Tool Yetkisi                 | Delegasyon Yetkisi                                      | Yönetim Seviyesi |
|---------------------|------------------------------|---------------------------------------------------------|------------------|
| CTO                 | `search`, `web`, `agent`     | SA, PM, Tech Lead, Security, DevOps                    | L1               |
| Solution Architect  | `search`, `web`, `agent`     | Tech Lead, Backend, Frontend, Mobile, DBA              | L2A              |
| Project Manager     | `search`, `web`, `agent`     | Tech Lead, QA, DevOps                                  | L2B              |
| Tech Lead           | `search`, `edit`, `web`, `agent` | SA, Backend, Frontend, Mobile, DBA, QA, Security   | L3               |
| UI/UX Lead          | `search`, `edit`, `web`, `agent` | Frontend, Mobile, QA                                | L3               |
| Backend Developer   | `search`, `edit`, `web`, `agent` | DBA, QA, Security, DevOps                           | L4               |
| Frontend Developer  | `search`, `edit`, `web`, `agent` | UI/UX, QA, Security                                 | L4               |
| Mobile Developer    | `search`, `edit`, `web`, `agent` | UI/UX, QA, Security                                 | L4               |
| Database Admin      | `search`, `edit`, `web`, `agent` | SA, Tech Lead, QA, DevOps, Security                 | L4               |
| QA Engineer         | `search`, `edit`, `web`, `agent` | Tech Lead, Backend, Frontend, Mobile, Security, DevOps | L4            |
| DevOps Engineer     | `search`, `edit`, `web`, `agent` | QA, Security, DBA, CTO                              | L4               |
| Security Engineer   | `search`, `web`, `agent`     | Tech Lead, Backend, Frontend, Mobile, DevOps, CTO     | L4               |

### Delegasyon ve Komuta Kuralları

- CTO tek nihai teknik ve operasyonel veto yetkisine sahiptir.
- Workspace agent picker'inda birincil giris noktasi CTO'dur; temel kullanim modeli komutun CTO uzerinden gerekli alt-agent zincirine dagitilmasidir.
- SA mimariyi tanımlar; Tech Lead uygulama planına çevirir; L4 agent'lar uygular.
- PM kapsam ve teslim yönetir; mimari veya kod standardı override etmez.
- Tech Lead, L4 implementasyon agent'larının birincil yürütme lideridir.
- UI/UX Lead, tasarım sistemi ve erişilebilirlik konularında Frontend ve Mobile için bağlayıcı otoritedir.
- QA, kalite kapısıdır; düzeltme dağıtabilir ancak production onayı zincirsiz vermez.
- Security, HIGH ve CRITICAL güvenlik bulgularında CTO eskalasyonu başlatır.
- DBA kararları veri katmanı için bağlayıcıdır; uygulama etkisi olan değişikliklerde Tech Lead ve SA zinciri zorunludur.
- DevOps, release ve rollback operasyonunu yürütür; production çıkış zinciri `QA → PM → CTO` olmadan tamamlanmaz.
- L4 agent'lar yalnızca tanımlı `agents` ve `handoffs` zinciri içinde delegasyon yapar; ad-hoc bypass yetkisi yoktur.

### Hook Tabanli Policy Kontrolu

- Workspace seviyesinde `.github/hooks/casa-governance.json` ile governance hook'lari tanimlidir.
- `.github/agents/**`, `.github/hooks/**`, `.github/copilot-instructions.md` ve `.github/README.md` yuksek hassasiyetli dosyalardir; bu dosyalardaki edit akislari ek review seviyesinde ele alinmalidir.
- Her `.agent.md` dosyasi `## Yasak Kararlar` ve `## Zorunlu Onaylar` bolumlerini korumali; bu bolumler komuta zincirinin yazili guvencesidir.
- `agents:` ve `handoffs.agent:` alanlarinda yalnizca gorunen custom agent adlari kullanilir; slug veya dosya-adi referanslari kabul edilmez.
- Hook tarafindan bildirilen policy ihlali cozulmeden gorev tamamlanmis sayilmaz.

---

## Onaylı Teknoloji Yığını

### Web (Frontend)
| Teknoloji         | Versiyon   | Kullanım Amacı                      |
|------------------|------------|-------------------------------------|
| Next.js           | 14+        | App Router, SSR, SSG, RSC           |
| TypeScript        | 5+         | Type safety                         |
| Tailwind CSS      | 3+         | Utility-first styling               |
| shadcn/ui         | Latest     | Bileşen kütüphanesi (Radix tabanlı) |
| Zustand           | 4+         | Client-side state                   |
| TanStack Query    | 5+         | Server state, caching               |
| React Hook Form   | 7+         | Form yönetimi                       |
| Zod               | 3+         | Schema validation                   |
| NextAuth.js       | 5+         | Authentication                      |
| Framer Motion     | Latest     | Animasyon                           |

### Mobile
| Teknoloji         | Versiyon   | Kullanım Amacı                      |
|------------------|------------|-------------------------------------|
| Expo SDK          | 51+        | React Native platformu              |
| Expo Router       | 3+         | File-based navigasyon               |
| NativeWind        | 4+         | Tailwind for React Native           |
| Zustand           | 4+         | Global state                        |
| TanStack Query    | 5+         | Server state                        |
| Expo SecureStore  | Latest     | Hassas veri depolama                |
| Expo Notifications| Latest     | Push bildirim                       |
| React Hook Form   | 7+         | Form yönetimi                       |
| Zod               | 3+         | Validation                          |

### Backend
| Teknoloji         | Versiyon   | Kullanım Amacı                      |
|------------------|------------|-------------------------------------|
| NestJS            | 10+        | Enterprise Node.js framework        |
| TypeScript        | 5+         | Type safety                         |
| TypeORM / Prisma  | Latest     | ORM (proje başında seçilir)         |
| PostgreSQL        | 16+        | Ana veritabanı                      |
| Redis             | 7+         | Cache, session, queue               |
| BullMQ            | Latest     | Background job queue                |
| Passport.js       | Latest     | Auth strategies                     |
| class-validator   | Latest     | DTO validation                      |
| Swagger/OpenAPI   | 3.0        | API dokümantasyonu                  |
| Jest + Supertest  | Latest     | Test                                |

### Altyapı
| Teknoloji         | Kullanım Amacı                            |
|------------------|-------------------------------------------|
| Docker            | Konteynerizasyon                          |
| Docker Compose    | Local geliştirme ortamı                   |
| Kubernetes        | Prodüksiyon orkestrasyon                  |
| Helm              | K8s paket yönetimi                        |
| GitHub Actions    | CI/CD pipeline                            |
| GHCR              | Container registry                        |
| Terraform         | Infrastructure as Code                    |
| Prometheus        | Metrik toplama                            |
| Grafana           | Monitoring dashboard                      |
| Loki              | Log aggregation                           |
| Cloudflare        | CDN, WAF, DDoS koruması                  |

---

## Proje Klasör Yapısı (Canonical)

```
casa/
├── .github/
│   ├── workflows/               # CI/CD pipeline dosyaları
│   │   ├── ci.yml
│   │   ├── cd-staging.yml
│   │   └── cd-production.yml
│   ├── agents/                  # Workspace custom agent dosyalari
│   ├── hooks/                   # Workspace hook konfigürasyonu ve policy scriptleri
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   └── copilot-instructions.md
├── apps/
│   ├── web/                     # Next.js 14 (App Router)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   └── api/             # Route Handlers (BFF)
│   │   ├── core/                # Hooks, utils, providers, constants
│   │   ├── layout/              # Header, Sidebar, Footer
│   │   └── features/            # Domain feature modülleri
│   ├── mobile/                  # Expo (React Native)
│   │   ├── app/                 # Expo Router
│   │   ├── core/
│   │   └── features/
│   └── api/                     # NestJS Backend
│       ├── src/
│       │   ├── core/            # Guards, interceptors, filters, pipes
│       │   ├── modules/         # Domain modülleri
│       │   ├── config/
│       │   └── main.ts
│       └── test/
├── packages/                    # Turborepo paylaşılan paketler
│   ├── types/                   # Paylaşılan TypeScript tipleri
│   ├── config/                  # ESLint, tsconfig, prettier
│   └── ui/                      # Paylaşılan temel UI primitives
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
├── docs/
│   ├── adr/                     # Architecture Decision Records
│   ├── api/                     # OpenAPI specs
│   └── runbooks/                # Operasyonel prosedürler
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## ADR (Architecture Decision Record) Standardı

Her kritik mimari karar `docs/adr/` altında belgelenmelidir:

```
ADR-001: Monorepo Yapısı Seçimi (Turborepo)
ADR-002: ORM Seçimi (Prisma vs TypeORM)
ADR-003: Mobile Platform Seçimi (Expo)
ADR-004: State Management (Zustand + TanStack Query)
...
```

---

## Commit Standardı (Conventional Commits)

```
feat(auth): add OAuth2 Google login
fix(api): resolve JWT expiry edge case
docs(adr): add ADR-003 mobile platform decision
refactor(user): extract email validation to core utility
test(user): add unit tests for UserService.findById
chore(deps): upgrade NestJS to v10.3
perf(db): add index on users.email column
security(auth): enforce bcrypt salt rounds 12
```

---

## PR Şablonu

Her pull request şu bilgileri içermelidir:
- Değişiklik özeti
- Etkilenen modüller
- Test edildi mi? (Unit / Integration / E2E)
- Güvenlik etkisi değerlendirildi mi?
- Breaking change var mı?
- Bağlı Issue/Task numarası

---

## Agent Dizini

| Agent                | Dosya                            | Seviye | Rol                              |
|---------------------|----------------------------------|--------|----------------------------------|
| CTO                 | `cto.agent.md`                   | L1     | Stratejik teknik liderlik        |
| Solution Architect  | `solution-architect.agent.md`    | L2A    | Sistem mimarisi & entegrasyon    |
| Project Manager     | `project-manager.agent.md`       | L2B    | Sprint, OKR, koordinasyon        |
| Tech Lead           | `tech-lead.agent.md`             | L3     | Kod standartları & PR onayı      |
| UI/UX Lead          | `ui-ux-designer.agent.md`        | L3     | Tasarım sistemi & kullanıcı den. |
| Backend Developer   | `backend-developer.agent.md`     | L4     | NestJS API geliştirme            |
| Frontend Developer  | `frontend-developer.agent.md`    | L4     | Next.js 14 web geliştirme        |
| Mobile Developer    | `mobile-developer.agent.md`      | L4     | Expo / React Native              |
| Database Admin      | `database-administrator.agent.md`| L4     | PostgreSQL, migrasyon, tuning    |
| QA Engineer         | `qa-engineer.agent.md`           | L4     | Test stratejisi & kalite kapısı  |
| DevOps Engineer     | `devops-engineer.agent.md`       | L4     | CI/CD, altyapı, monitoring       |
| Security Engineer   | `security-engineer.agent.md`     | L4     | OWASP, pentest, incident resp.   |

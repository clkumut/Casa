# Casa — GitHub Copilot Custom Agent Ekibi

**Casa** projesi için kurumsal seviyede tasarlanmış, 12 uzmanlık alanına sahip, hiyerarşik ve gerçek **custom agent** ekibi.

---

## Hızlı Başlangıç

GitHub Copilot Chat'i açın ve agent picker'dan istediğiniz özel agent'ı seçin.

```
1. Chat panelini acin
2. Agent picker'i acin
3. Workspace custom agents altinda CTO agent'ini birincil giris noktasi olarak secin
4. Gorevinizi dogrudan CTO'ya yazin; gerekli alt-agent zinciri arkada calissin
```

Alternatif olarak `/agents` komutu ile Configure Custom Agents ekranını açabilirsiniz.

Not: Operasyonel giris noktasi CTO'dur. Diger agent'lar gerekirse dogrudan da secilebilir, ancak hedeflenen kullanim komutun CTO uzerinden orkestre edilmesidir.

---

## Agent Ekibi — Tam Referans Tablosu

| Agent              | Dosya                             | Seviye | Birincil Sorumluluk                        |
|--------------------|-----------------------------------|--------|---------------------------------------------|
| CTO                | `cto.agent.md`                    | L1     | Teknoloji stratejisi, ADR, risk yönetimi   |
| Solution Architect | `solution-architect.agent.md`     | L2A    | Sistem mimarisi, servis sınırları, API sözleşmeleri |
| Project Manager    | `project-manager.agent.md`        | L2B    | Sprint yönetimi, OKR, milestone, risk kayıt |
| Tech Lead          | `tech-lead.agent.md`              | L3     | Kod standartları, PR inceleme, mimari kararlar |
| UI/UX Lead         | `ui-ux-designer.agent.md`         | L3     | Tasarım sistemi, bileşen API'leri, erişilebilirlik |
| Backend Developer  | `backend-developer.agent.md`      | L4     | NestJS API, servis katmanı, veritabanı entegrasyonu |
| Frontend Developer | `frontend-developer.agent.md`     | L4     | Next.js 14, RSC, TanStack Query, form yönetimi |
| Mobile Developer   | `mobile-developer.agent.md`       | L4     | Expo, React Native, güvenli depolama, push bildirim |
| Database Admin     | `database-administrator.agent.md` | L4     | PostgreSQL şema, migration, optimizasyon, yedekleme |
| QA Engineer        | `qa-engineer.agent.md`            | L4     | Test stratejisi, coverage, yük testi, bug yönetimi |
| DevOps Engineer    | `devops-engineer.agent.md`        | L4     | CI/CD, Docker, Kubernetes, Helm, monitoring |
| Security Engineer  | `security-engineer.agent.md`      | L4     | OWASP Top 10, CVE, incident response, pen test |

---

## Hiyerarşi Diyagramı

```
Product Owner (Kullanici)
       │
       ▼
     CTO (L1)
       │
   ┌───┴───┐
   │       │
  SA      PM (L2)
   │
  ┌┴─────────┐
  │          │
Tech Lead  UI/UX Lead (L3)
  │
  ├── Backend Dev
  ├── Frontend Dev
  ├── Mobile Dev
  ├── DBA
  ├── QA Engineer
  ├── DevOps Eng.
  └── Security Eng. (L4)
```

---

## Handoff Mantığı

Her agent, rolüne uygun sonraki agent'lara **handoff** önerecek şekilde tanımlanmıştır.

- CTO: mimari, plan ve uygulama başlatma handoff'ları
- Solution Architect: Tech Lead, Backend Developer, DBA handoff'ları
- Tech Lead: Backend, Frontend, Mobile implementasyon handoff'ları
- L4 agent'lar: QA, Security ve DevOps doğrulama handoff'ları

Bu sayede agent değişimi manuel kopyala-yapıştır yerine agent akışı olarak ilerler.

---

## Yetki ve Tool Matrisi

| Agent              | Tool Yetkisi                 | Alt-Agent Yetkisi                                           | Çalışma Biçimi |
|--------------------|------------------------------|-------------------------------------------------------------|----------------|
| CTO                | `search`, `web`, `agent`     | SA, PM, Tech Lead, Security, DevOps                        | Stratejik, read-only, nihai onay |
| Solution Architect | `search`, `web`, `agent`     | Tech Lead, Backend, Frontend, Mobile, DBA                  | Mimari, read-only, delegasyon odaklı |
| Project Manager    | `search`, `web`, `agent`     | Tech Lead, QA, DevOps                                      | Planlama, teslim ve eskalasyon |
| Tech Lead          | `search`, `edit`, `web`, `agent` | SA, Backend, Frontend, Mobile, DBA, QA, Security       | Teknik orkestrasyon ve uygulama gözetimi |
| UI/UX Lead         | `search`, `edit`, `web`, `agent` | Frontend, Mobile, QA                                    | Tasarım otoritesi ve uygulama yönlendirme |
| Backend Developer  | `search`, `edit`, `web`, `agent` | DBA, QA, Security, DevOps                               | Backend implementasyon |
| Frontend Developer | `search`, `edit`, `web`, `agent` | UI/UX, QA, Security                                     | Web implementasyon |
| Mobile Developer   | `search`, `edit`, `web`, `agent` | UI/UX, QA, Security                                     | Mobil implementasyon |
| Database Admin     | `search`, `edit`, `web`, `agent` | SA, Tech Lead, QA, DevOps, Security                     | Veri katmanı ve operasyon |
| QA Engineer        | `search`, `edit`, `web`, `agent` | Tech Lead, Backend, Frontend, Mobile, Security, DevOps  | Kalite kapısı ve regresyon yönetimi |
| DevOps Engineer    | `search`, `edit`, `web`, `agent` | QA, Security, DBA, CTO                                  | Dağıtım ve operasyon |
| Security Engineer  | `search`, `web`, `agent`     | Tech Lead, Backend, Frontend, Mobile, DevOps, CTO         | Güvenlik yönetişimi ve eskalasyon |

Not: `edit` yetkisi yalnızca doğrudan implementasyon veya test/altyapı değişikliği yapması beklenen rollerde açıktır. CTO, SA, PM ve Security rolleri ağırlıklı olarak yönlendirme, inceleme ve delegasyon için tanımlanmıştır.

---

## Delegasyon Kuralları

1. CTO tek nihai teknik otoritedir; kritik risk, vendor seçimi, production kararı ve breaking değişiklikler CTO onayı olmadan kapanmış sayılmaz.
2. Solution Architect mimariyi tanımlar, fakat delivery planını PM ve kod seviyesindeki yürütmeyi Tech Lead üzerinden aşağıya indirir.
3. Project Manager doğrudan kod standardı veya mimari override etmez; sprint, kapsam ve teslim yönetimini yürütür ve gerekli durumda CTO'ya scope eskalasyonu yapar.
4. Tech Lead, L4 implementasyon agent'larının birincil komuta noktasıdır; Backend, Frontend, Mobile ve DBA agent'ları mimari dışına çıkan kararlarda Tech Lead veya SA'ya geri döner.
5. UI/UX Lead tasarım sisteminin sahibidir; Frontend ve Mobile agent'ları deneyim, token ve erişilebilirlik kararlarında UI/UX Lead'e bağlı çalışır.
6. QA Engineer release gate sahibidir; yüksek önemde bulguları ilgili implementasyon agent'ına ve gerekiyorsa Tech Lead'e geri dağıtır, production çıkışını tek başına onaylamaz.
7. Security Engineer yüksek ve kritik güvenlik bulgularını CTO seviyesine taşır; düzeltme yürütmesini Tech Lead, ilgili implementasyon agent'ı veya DevOps üzerinden başlatır.
8. Database Administrator veritabanı şema ve operasyon otoritesidir; ancak uygulama etkisi olan DB kararları Tech Lead ve SA zinciri üzerinden ilerler.
9. DevOps Engineer production yolunu hazırlar, fakat release zinciri `QA → PM → CTO` olmadan production deploy meşru kabul edilmez.
10. L4 agent'lar kendi uzmanlık alanları dışında yatay override yapmaz; ihtiyaç halinde tanımlı alt-agent listesi veya handoff zinciri kullanılır.

---

## Hooks ve Otomatik Policy Kontrolu

Casa agent takımı artık workspace seviyesinde hook tabanlı yönetişimle korunur.

- `.github/hooks/casa-governance.json`: VS Code hook konfigürasyonu
- `.github/hooks/Invoke-CasaPolicyHook.ps1`: governance dosyaları için policy denetimi
- `PreToolUse`: `.github/agents/`, `.github/hooks/`, `.github/copilot-instructions.md` ve `.github/README.md` gibi yüksek hassasiyetli dosyalardaki edit/create akışlarını açık review seviyesine çeker
- `PostToolUse`: `.agent.md` dosyalarında `## Yasak Kararlar`, `## Zorunlu Onaylar`, zorunlu frontmatter ve görünen agent adı kullanımını doğrular
- Hook ihlali varsa agent akışı bloklanır ve ilgili düzeltme bağlamı otomatik olarak modele geri verilir

Not: Hooks özelliği preview durumundadır. Sorun giderme için Output panelindeki `GitHub Copilot Chat Hooks` kanalı kullanılmalıdır.

---

## Kullanım Senaryoları

### Yeni Özellik Geliştirme

```
1. Project Manager ile kapsam ve sprint cikar
2. Solution Architect ile sistem tasarimini netlestir
3. Tech Lead ile uygulama standartlarini belirle
4. Backend / Frontend / Mobile agent ile implementasyonu yaptir
5. QA Engineer ile test ve release gate kontrolu yap
6. Security Engineer ile guvenlik incelemesi yap
7. DevOps Engineer ile deploy akisini hazirla
8. CTO ile nihai teknik onayi al
```

### Guvenlik Acigi Tespiti

```
1. Security Engineer ile bulguyu triage et
2. Tech Lead ile duzeltme onceligini belirle
3. Ilgili implementasyon agent'ina handoff yap
4. QA Engineer ile regresyon dogrulamasi yap
5. CTO ile kapanis onayi al
```

### Veritabani Sema Degisikligi

```
1. Database Administrator ile migration ve index planini cikar
2. Solution Architect ile kontrat etkisini degerlendir
3. Tech Lead ile kod etkisini planla
4. QA Engineer ile integration test plani cikar
5. DevOps Engineer ile deployment ve rollback planini hazirla
```

---

## Onay Zinciri

| Karar Türü                        | Minimum Onay              |
|-----------------------------------|---------------------------|
| Yeni teknoloji / kütüphane        | Tech Lead → CTO           |
| Mimari değişiklik                 | SA → CTO                  |
| Production deployment             | QA → PM → CTO             |
| Güvenlik açığı kapatma            | Security → CTO            |
| Sprint scope değişikliği          | PM → CTO                  |
| Breaking API değişikliği          | SA → Tech Lead → PM       |
| DB şema değişikliği               | DBA → Tech Lead → SA      |
| 3rd party vendor ekleme           | CTO → PM (bütçe onayı)    |

---

## Dosya Yapısı

```
.github/
├── agents/
│   ├── cto.agent.md
│   ├── solution-architect.agent.md
│   ├── project-manager.agent.md
│   ├── tech-lead.agent.md
│   ├── ui-ux-designer.agent.md
│   ├── backend-developer.agent.md
│   ├── frontend-developer.agent.md
│   ├── mobile-developer.agent.md
│   ├── database-administrator.agent.md
│   ├── qa-engineer.agent.md
│   ├── devops-engineer.agent.md
│   └── security-engineer.agent.md
├── hooks/
│   ├── casa-governance.json
│   └── Invoke-CasaPolicyHook.ps1
├── copilot-instructions.md
└── README.md
```

---

## Temel Kurallar

- **Kod dili:** İngilizce
- **Açıklama dili:** Türkçe
- **TypeScript:** `strict: true`
- **Güvenlik:** OWASP Top 10 her katmanda
- **Test:** PR açılmadan önce test yazılmış olmalı
- **Commit:** Conventional Commits formatı

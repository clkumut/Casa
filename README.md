# Casa — Agent Ekibi Kullanım Kılavuzu

## Hızlı Başlangıç

Chat'ten herhangi bir agent'ı şu şekilde çağır:

```
/cto              → CTO Agent
/project-manager  → Project Manager Agent
/tech-lead        → Tech Lead Agent
/backend-developer  → Backend Developer Agent
/frontend-developer → Frontend Developer Agent
/mobile-developer   → Mobile Developer Agent
/qa-engineer      → QA Engineer Agent
/devops-engineer  → DevOps Engineer Agent
/security-engineer → Security Engineer Agent
```

> VS Code'da: Chat panelinde `/` yazınca prompt dosyaları listelenir.

---

## Emir-Komuta Hiyerarşisi

```
Product Owner (Sen)
        │
       CTO ──────────────────────── L1: Stratejik karar
        │
  Project Manager ─────────────── L2: Sprint & koordinasyon
        │
    Tech Lead ───────────────────── L3: Mimari & standartlar
        │
   ┌────┴─────────────────────┐
Backend  Frontend  Mobile    QA   L4: Uygulama
                                  DevOps + Security
```

---

## Hangi Agent'ı Ne Zaman Kullanırsın?

| Senaryo                                  | Agent                         |
|------------------------------------------|-------------------------------|
| "Bu projeye hangi teknolojiyi seçelim?"  | `/cto`                        |
| "Sonraki sprint'i planlayalım"           | `/project-manager`            |
| "Bu feature'ın mimarisini tasarlayalım"  | `/tech-lead`                  |
| "API endpoint'i geliştir"               | `/backend-developer`          |
| "Bu sayfayı Next.js ile yap"            | `/frontend-developer`         |
| "Mobil ekranı oluştur"                   | `/mobile-developer`           |
| "Test yaz / bug bul"                    | `/qa-engineer`                |
| "CI/CD pipeline kur"                    | `/devops-engineer`            |
| "Güvenlik denetimi yap"                 | `/security-engineer`          |

---

## Onay Zinciri

Kritik kararlar şu sırayla geçer:

```
Fikir → CTO (teknik fizibilite)
      → PM (planlama & kaynak)
      → Tech Lead (mimari)
      → Geliştirici (uygulama)
      → QA (test & onay)
      → DevOps (deploy)
```

---

## Proje Standartları (Kısa Özet)

- **Dil:** Türkçe açıklama, İngilizce kod
- **`shared/` yok:** Yardımcılar `core/` altında
- **Model dosyaları ayrı:** `features/[domain]/models/`
- **OWASP Top 10** her zaman gözetilir
- **TypeScript strict mode** zorunlu, `any` yasak

---

## Repo Iskeleti ve Docs-First Baslangic

Bu repository, once dokumantasyonun netlestirildigi ve fiziksel klasor iskeletinin kontrollu bicimde acildigi docs-first yaklasimiyla ilerler.

- `apps/` altinda istemci ve trusted backend aileleri acilir.
- `firebase/` altinda rules, indexes ve emulator baseline config tutulur.
- `operations/` altinda environment, seed, release, smoke test ve runbook aileleri ayrik sorumluluklarla konumlanir.
- Ortam kimligi, proje id veya gizli bilgi gerektiren dosyalar bilincli olarak bu asamada olusturulmaz.

Detay klasor ve mimari standartlari icin `docs/architecture/repo-and-folder-standards.md`, `docs/architecture/angular-application-architecture.md` ve `docs/architecture/firebase-platform-architecture.md` belgelerine bakilir.

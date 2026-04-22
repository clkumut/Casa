# Governance Charter

## Kapsam ve Yetki

Bu charter, Casa V1 icin dokumantasyon, delivery ve mimari karar akisinin baglayici yonetim katmanidir. V1 Arapca oyunlastirilmis ogrenme platformu; Angular web, Firebase Authentication, Firestore, Cloud Functions, Storage, Analytics ve Emulator Suite sabitleriyle yurutulur.

## Temel Ilkeler

1. [../CTO_ilk_prompt.md](../CTO_ilk_prompt.md) L0 baslangic brief'idir ve korunur.
2. V1 ve V2 kesin ayrilir; V1'e sadece urunun calismasini dogrudan bloke eden zorunlu maddeler girer.
3. Mock veri, placeholder runtime response ve gecici sabit UI listeleri yasaktir.
4. Ortak cross-cutting yapilar `core` altinda konumlanir; `shared` klasoru kullanilmaz.
5. Model, DTO ve interface tanimlari ayri dosyalarda tutulur.
6. Trusted mutasyonlar istemciden dogrudan yazilmaz; Cloud Functions araciligiyla isletilir.
7. Her work package, yazili emir, karar, kanit ve onay zinciriyle kapanir.
8. Aktif execution sirasinda onayli ORD, work package ve execution plan sirasindan sapilmaz; blocker veya zorunlu onay yoksa alternatif yol listesi sunulmaz.
9. Chat iletisiminde varsayilan kip kisa, delta-bazli ve durum odaklidir; uzun aciklama yalniz kullanici isterse veya risk/escalation gerekiyorsa verilir.

## ORD / DEC / EVD / APR Modeli

| Artefact | Amac | Baslatan | Kapanis Kriteri |
| --- | --- | --- | --- |
| ORD | Isin neden ve hangi kapsamla basladigini kaydeder | PM veya CTO delegasyonu | Emirde tanimli deliverable'lar EVD ve APR ile baglanmis olmali |
| DEC | Scope, mimari, governance ve operasyonel karari kalicilastirir | CTO, SA, Tech Lead | Karar ilgili aile dosyalarina yansitilmis olmali |
| EVD | Bir gate, milestone veya release icin nesnel kanit toplar | Work package sahibi | Kanit dogrulanmis, izlenebilir ve tarihli olmali |
| APR | Resmi sign-off kaydidir | Yetkili otorite | Tanimli gate icin gerekli tum roller imza vermeli |

## Source of Truth Kurali

Celiskili ifade durumunda asagidaki sira uygulanir:

1. [../CTO_ilk_prompt.md](../CTO_ilk_prompt.md)
2. Bu charter
3. DEC ve ADR kayitlari
4. Product, architecture ve ops dokumanlari
5. Delivery planlari
6. Evidence kayitlari
7. Approval kayitlari

## Sahiplik ve Guncelleme Ritmi

| Alan | Birincil Sahip | Danisilan Roller | Guncelleme Ritim | Kapanis Kriteri |
| --- | --- | --- | --- | --- |
| Governance | CTO ve PM | SA, TL, Security, DevOps | Gate gecislerinde ve policy degisikliklerinde | Yetki, cadence ve closure kriterleri acik |
| Product | Product Owner ve TL | UI/UX, QA, SA | G0-G1 arasi yogun, G1 sonrasi kontrollu | V1 kapsam ve IA sabit |
| Architecture | SA ve TL | Security, DevOps | G1-G2 arasi yogun, sonrasinda ADR tabanli | Bounded context, data flow ve trusted boundary net |
| Ops | DevOps ve TL | Security, QA, PM | G2 sonrasi sprint bazli | Environment, CI/CD ve rollback uygulanabilir |
| Delivery | PM | TL, QA | Haftalik ve milestone bazli | WP kapanis zinciri eksiksiz |

## Degisiklik Yonetimi

| Degisiklik Turu | Gerekli Artefact | Minimum Inceleme | Uygulama Kurali |
| --- | --- | --- | --- |
| V1 scope degisikligi | DEC + ilgili product dosyasi | Product Owner, PM, TL | G1 sonrasi yalnizca kritik blokaj icin |
| Mimari veya trusted boundary degisikligi | ADR + DEC gerekirse | SA, TL, Security, DevOps | G2 sonrasi change control ile |
| Delivery ritmi veya gate degisikligi | DEC | PM, QA, CTO | EVD/APR semasi korunur |
| Ops ortam degisikligi | ADR veya ops karari | DevOps, Security, TL | Ayrik Firebase proje siniri korunur |
| Seed veri sinifi degisikligi | Ops dokumani + EVD kaydi | TL, QA, Security | Uretim PII kopyalanmaz |

## Gate Modeli

| Gate | Ad | Amaç | Minimum Cikis Kriteri |
| --- | --- | --- | --- |
| G0 | Brief Acceptance | Baslangic brief'inin kabul edilmesi | Governance, source-of-truth ve ORD-001 yayinlandi |
| G1 | Scope Freeze | V1 kapsam sabitlenir | V1 scope, out-of-scope ve V2 backlog onayli |
| G2 | Architecture Freeze | Mimari ve veri modeli kilitlenir | ADR 001-010, architecture cekirdegi ve security modeli tamam |
| G3 | Build Ready | Uygulamaya baslamak icin teknik hazirlik | Repo, environment, seed ve CI/CD standardi hazir |
| G4 | WP Close | Work package kapanisi | EVD kaydi ve ilgili APR tamam |
| G5 | Release Ready | Release adayi hazir | Smoke, guvenlik, veri, analytics ve rollback kaniti mevcut |

## Scope Disiplini

- V1 kapsaminda PublicShell, AuthOnboardingShell, AppShell ve gerekirse OpsShell tanimlanir.
- Uygulama rotalari `/`, `/auth/login`, `/auth/register`, `/auth/onboarding/*`, `/app/learn`, `/app/elifba`, `/app/practice`, `/app/leaderboard`, `/app/quests`, `/app/shop`, `/app/profile`, `/app/more/settings` olarak temel alinmistir.
- V2 fikirleri delivery backlog'una degil, ilgili backlog dosyalarina yazilir.

## Uyumsuzluk Kriterleri

Asagidaki durumlar governance ihlali sayilir:

- Mock runtime veri ile UI veya is kurali gostermek
- Cloud Functions araciligiyla gitmesi gereken trusted mutasyonu istemcide yazmak
- `shared` klasoru acmak
- V1 kapsaminda olmayan ozelligi V2 backlog yerine delivery planina eklemek
- Evidence ve approval olmadan gate kapatmak
- Onayli execution sirasi varken blocker olmadan alternatifli yonlendirme uretmek
- Kullanici acikca kisa durum iletisimini istemisken chat ekraninda tekrarlı ve gereksiz ayrinti biriktirmek

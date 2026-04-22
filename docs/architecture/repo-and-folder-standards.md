# Repo and Folder Standards

## Kök Yapi

Casa V1 icin onerilen kok dizin standardi asagidadir:

```text
casa/
├── apps/
│   ├── web/
│   └── functions/
├── firebase/
├── operations/
├── docs/
└── .github/
```

`shared` klasoru acilmaz. Ortak cross-cutting sorumluluklar ilgili uygulama icinde `core` altinda ele alinir.

## Kök Ailelerin Sorumlulugu

| Klasor | Sorumluluk |
| --- | --- |
| `apps/web` | Angular istemci, shell'ler, feature alanlari, UI, route'lar |
| `apps/functions` | Cloud Functions, trusted mutasyonlar, event handlers, scheduler'lar |
| `firebase` | Firestore rules, indexes, emulator config, auth ve hosting konfigürasyonu |
| `operations` | CI/CD yardimcilari, release otomasyonu, operasyon script'leri |
| `docs` | Governance, product, architecture, ops, delivery ve ADR kayitlari |
| `.github` | Workflow'lar, governance hook'lari ve proje talimatlari |

## `apps/web` Aile Standardi

```text
apps/web/src/
├── app/
│   ├── root/
│   ├── shells/
│   ├── routes/
│   └── ...
├── core/
│   ├── auth/
│   ├── config/
│   ├── guards/
│   ├── interceptors/
│   ├── layout/
│   ├── services/
│   ├── state/
│   └── utils/
└── features/
    └── [domain]/
        ├── application/
        ├── domain/
        ├── infrastructure/
        ├── presentation/
        └── models/
```

## Angular UI Dosyalama ve Aile Klasorleme Standardi

```text
apps/web/src/
├── app/
│   ├── root/
│   │   ├── root.ts
│   │   ├── root.html
│   │   ├── root.scss
│   │   ├── config.ts
│   │   └── routes.ts
│   ├── shells/
│   │   ├── public/
│   │   ├── auth-onboarding/
│   │   ├── workspace/
│   │   └── ops/
│   └── routes/
│       └── placeholder/
└── features/
    └── [domain]/
        └── presentation/
            ├── components/
            │   └── [family]/
            └── pages/
                └── [family]/
```

- Angular page, shell, route placeholder ve tekrar kullanilabilir UI yuzeyleri kendi aile klasorunde tutulur.
- Her UI ailesi en az ayri `ts`, `html` ve `scss` dosyalarina bolunur; inline `template` ve `styles` kalici cozum olarak kabul edilmez.
- Dosya adlarinda ek `.component` ibaresi kullanilmaz; aile adi dogrudan dosya adina verilir.
- Root giris ailesi `app/root/` altinda tutulur ve `root.ts`, `root.html`, `root.scss`, `config.ts`, `routes.ts` dosyalarini icerir.
- Feature page aileleri `features/[domain]/presentation/pages/[family]/`, reusable UI aileleri `features/[domain]/presentation/components/[family]/`, shell aileleri `app/shells/[family]/` ve route placeholder aileleri `app/routes/[family]/` altina yerlestirilir.
- Bir aile klasoru yalniz ilgili UI yuzeyinin kaynaklarini tasir; model, facade veya repository ayni klasore yigilarak sinirlar bulandirilmaz.

## `apps/functions` Aile Standardi

```text
apps/functions/src/
├── bootstrap/
├── core/
│   ├── auth/
│   ├── firestore/
│   ├── logging/
│   └── validation/
└── modules/
    └── [domain]/
        ├── application/
        ├── domain/
        ├── infrastructure/
        ├── models/
        └── handlers/
```

## Dosya Yerlestirme Kurallari

- Her model, DTO, interface ve command/query kontrati ayri dosyada tutulur.
- UI component, state ve repository ayni dosyada birlestirilmez.
- Angular UI tarafinda `ts`, `html` ve `scss` ayrimi ile aile klasorleme standardi zorunludur.
- Feature icindeki `domain` yalniz is kurali ve tipleri, `application` use-case orkestrasyonu, `infrastructure` Firebase baglantilarini tasir.
- `core` yalniz cross-cutting concern'leri barindirir; domain mantigi buraya tasinmaz.

## Dosya Ekleme Kurallari

| Durum | Dogru Yer |
| --- | --- |
| Auth guard | `apps/web/src/core/guards/` |
| Learning lesson page | `apps/web/src/features/learning/presentation/pages/` |
| Lesson repository | `apps/web/src/features/learning/infrastructure/` |
| Quest reward function | `apps/functions/src/modules/quests/handlers/` |
| Firestore rules | `firebase/firestore.rules` ve parcalanmis rule kaynaklari |
| Seed veri manifest'i | `operations/seeds/` ve ops belgeleriyle bagli |

## Yasaklanmis Kaliplar

- `shared/` veya domainler arasi dumping klasoru
- UI icinde dogrudan Firestore mutasyon mantigi
- Bir dosyada hem runtime model hem DTO hem component tanimi
- Angular UI yuzeylerinde `.component` son ekine geri donus veya inline template/style kullanimi
- Test icin gecici JSON veya hardcoded runtime liste kullanimi

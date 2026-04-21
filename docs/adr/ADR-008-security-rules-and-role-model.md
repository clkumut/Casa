# ADR-008 Security Rules and Role Model

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Casa V1, hem ogrenme kullanicilarini hem de sinirli operasyon rollerini barindirir. Kurallar net kurulmazsa ops ve kullanici verileri ayni yetki alaninda karisabilir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Yalniz auth var/yok kontrolu | Role ve data sensitivity icin yetersiz |
| Geniş istemci yazim yetkisi | Ekonomi ve guvenlik riski |
| Role + trusted write + rules | En dusuk ayricalik ve net audit izi |

## Karar

Rol modeli `anonymous`, `learner`, `opsPublisher`, `opsReleaseManager`, `platformAdmin` olarak sabitlendi. Firestore rules deny-by-default mantigiyla yazilacak; kullaniciya ozel sinirli self-write disinda ekonomik ve sosyal mutasyonlar function otoritesine baglanacak.

## Sonuclar

- OpsShell ve AppShell yetki siniri netlesir.
- Release gate'lerinde guvenlik onayi dogrudan dogrulanabilir hale gelir.
- Rules testleri, delivery zincirinin zorunlu parcasi olur.

## Riskler ve Hafifletme

- Risk: Claim senkronizasyonunun gecikmesiyle yanlis rol davranisi.
- Hafifletme: Ops erisimleri giris sirasinda claim ve audit kontrolu ile tekrar dogrulanir.

## Onay

- Security Engineer
- Solution Architect
- Tech Lead

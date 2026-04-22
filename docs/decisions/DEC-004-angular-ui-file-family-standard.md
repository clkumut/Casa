# DEC-004 Angular UI File Family Standard

## Durum

Accepted

## Tarih

2026-04-22

## Baglam

Angular web uygulamasinda page, shell ve route placeholder yuzeyleri farkli donemlerde farkli dosyalama kaliplariyla uretilmeye basladi. Bu durum, ayni aile icindeki kaynaklarin dagilmasina, inline template/style kullanimina ve `.component` son ekli dosya adlarinin yeni klasorleme standardiyla celismesine yol acti.

## Karar

- Angular UI yuzeyleri ayri `ts`, `html` ve `scss` dosyalariyla tutulur.
- Her UI yuzeyi kendi aile klasorunde konumlanir.
- Dosya adlarinda ek `.component` son eki kullanilmaz; aile adi dosya adinin kendisidir.
- Root uygulama girisi `app/root/` altinda tutulur ve `root.ts`, `root.html`, `root.scss`, `config.ts`, `routes.ts` ayni aileye aittir.
- Feature page aileleri `features/[domain]/presentation/pages/[family]/`, reusable UI aileleri `features/[domain]/presentation/components/[family]/`, shell aileleri `app/shells/[family]/`, route placeholder aileleri `app/routes/[family]/` altinda tutulur.
- Inline `template` ve `styles` kalici proje standardi olarak kabul edilmez.

## Sonuclar

- Angular UI yapisi repo genelinde tek bir klasorleme standardina baglanir.
- Yeni ekran ve shell ekleme maliyeti dusurulur; import zincirleri daha okunabilir hale gelir.
- Kod uretiminde ayni hatali dosyalama kalibina geri donus governance ihlali sayilir.

## Etkilenen Belgeler

- [../architecture/repo-and-folder-standards.md](../architecture/repo-and-folder-standards.md)
- [../architecture/angular-application-architecture.md](../architecture/angular-application-architecture.md)
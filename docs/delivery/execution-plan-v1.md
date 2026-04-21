# Execution Plan V1

## Amaç

Bu plan, Casa V1'in implementasyonunu governance, urun, mimari ve operasyon dokumanlarina bagli sekilde yurutmek icin ana calisma sirasini tanimlar.

## Yurutme Prensipleri

1. V1 ve V2 backlog'lari birbirine karistirilmaz.
2. Her work package bir ORD baglamina ve ilgili DEC/ADR'ye dayanir.
3. Kapanis icin EVD ve APR kaydi zorunludur.
4. Mock runtime veri kullanimi work package'ı otomatik olarak geri acar.
5. Work package detay dosyalari resmi delivery takip noktasidir; execution durumu once orada guncellenir.

## Fazlar

| Faz | Odak | Bagli Gate |
| --- | --- | --- |
| F0 | Governance ve kapsam tabani | G0, G1 |
| F1 | Mimari ve operasyon tabani | G2 |
| F2 | Build readiness ve scaffold | G3 |
| F3 | Uygulama implementation cekirdegi | G4 |
| F4 | Hardening, release ve closeout | G5 |

## Ana Sira

1. Governance, product ve architecture baseline dogrulanir.
2. Repo siniri, Angular shell, Firebase proje ayrimi ve Firestore modeli scaffold'a donusturulur.
3. Auth ve onboarding akisi kurulur.
4. Curriculum catalog ve learning map projection'u yuklenir.
5. Lesson completion -> progression -> gamification trusted write zinciri kurulur.
6. Practice, quests, shop, leaderboard ve social projection'lari baglanir.
7. Ops publish ve release akisları eklenir.
8. Release readiness ve smoke seti ile kapanis yapilir.

## Baslangic Bagimliliklari

- G1 kapanmadan feature implementation baslatilmaz.
- G2 kapanmadan Firestore rules ve trusted write kodu kalici kabul edilmez.
- G3 kapanmadan genis implementasyon sprinti acilmaz.

## Resmi Takip Kayitlari

- Ozet katalog: [./work-package-catalog.md](./work-package-catalog.md)
- Kullanim standardi: [./work-packages/README.md](./work-packages/README.md)
- Detay work package kayitlari: [./work-packages/](./work-packages/)

Bu planin fazlari delivery sirasini tarif eder. Her faz altindaki fiili ilerleme, ilgili work package dosyasinda durum, giris kriteri, cikis kriteri ve beklenen kanitlar ile izlenir.

## Faz - Work Package Eslesmesi

| Faz | Work Package'lar | Resmi Takip |
| --- | --- | --- |
| F0 | WP-001 | WP dosyasi + G0/G1 kayitlari |
| F1 | WP-002 mimari ve environment hazirligi | WP dosyasi + G2 kayitlari |
| F2 | WP-002 build-ready kapanis | WP dosyasi + G3 kayitlari |
| F3 | WP-003 ila WP-010 | Ilgili WP dosyalari ve bagli ORD/EVD/APR kayitlari |
| F4 | WP-011 | WP dosyasi + G5 kayitlari |

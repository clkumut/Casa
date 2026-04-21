# Work Packages

## Amac

Bu klasor, Casa V1 delivery planindaki her resmi work package icin tekil takip kaydini tutar. Work package dosyalari backlog notu degildir; kapsam, bagimlilik, kanit ve onay beklentisini ayni yerde sabitler.

## Kullanim Standardi

- Her work package `WP-xxx-kisa-baslik.md` adlandirma kuralina uyar.
- Her work package su basliklari ayni sirayla icerir: `Amac`, `Durum`, `Bagli Emir`, `Dayandigi Kararlar`, `Kapsam`, `Kapsam Disi`, `Bagimliliklar`, `Baslangic Kriterleri`, `Cikis Kriterleri`, `Beklenen Kanitlar`, `Gerekli Onaylar`, `Notlar`.
- Durum alani yalniz gercek teslim durumunu yazar; kanit veya approval yoksa `Completed` ya da `Closed` kullanilmaz.
- Bir work package icin resmi emir acilmadan execution baslatilmis kabul edilmez.
- Kapanis beyanlari ilgili EVD ve APR kayitlarina baglanmadan gecerli sayilmaz.

## Durum Sozlugu

- `Planned`: Emir acilmamis veya execution baslamamis.
- `In Progress`: Fiziksel artefact var ancak cikis kriterleri tamam degil.
- `Ready for Gate Review`: Teslim slice'i teknik olarak hazir, gate kaniti ve approval bekliyor.
- `Completed - Awaiting Formal Gate Confirmation`: Is fiilen tamamlandi, resmi gate kapanisi bekleniyor.

## Bagli Kayitlar

- Ana katalog: [../work-package-catalog.md](../work-package-catalog.md)
- Yurutme plani: [../execution-plan-v1.md](../execution-plan-v1.md)
- Emir kayitlari: [../../orders/ORD-LOG.md](../../orders/ORD-LOG.md)
- Gate kanitlari: [../../evidence/gates/README.md](../../evidence/gates/README.md)
- Gate onaylari: [../../approvals/gates/README.md](../../approvals/gates/README.md)

## Guncelleme Kurali

- Durum degisikligi ayni gunde ilgili ORD, EVD veya APR kaydi ile capraz kontrol edilmelidir.
- Kapsam genislemesi mevcut work package dosyasina sessizce eklenmez; gerekiyorsa yeni ORD veya yeni karar kaydi acilir.
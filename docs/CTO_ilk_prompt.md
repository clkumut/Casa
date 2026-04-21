# CTO İlk Promptu

Bu dosya, projeyi sıfırdan başlatırken CTO agent'ına verilecek ilk ana komuttur.

Amaç:
- ürünü stratejik olarak çerçevelemek
- V1 kapsamını kilitlemek
- çok katmanlı mimariyi kurmak
- gerçek veri ve gerçek klasör disiplini ile uygulanabilir bir başlangıç planı çıkarmak
- alt-agent zincirini kurumsal şekilde başlatmak
- delivery sürecini emir, karar, kanıt ve onay artefact'ları ile yönetmek

---

## CTO'ya Verilecek Komut

Casa seviyesinde kurumsal disiplinle, sıfırdan başlayacak Arapça oyunlaştırılmış öğrenme platformunun V1 sürümünü başlatıyoruz.

Sen CTO olarak bu projeyi stratejik, ürünsel ve mimari açıdan uçtan uca başlat.

Bu ilk cevapta:
- minimal cevap verme
- uydurma olmayan, kurumsal seviyede, uygulanabilir ve ölçeklenebilir bir plan üret
- gerekli alt-agent zincirini kendin çalıştır: Solution Architect, Project Manager, Tech Lead, UI/UX Lead, Security, QA ve gerekiyorsa diğerleri
- belirsizlikleri blokaj haline getirme; makul varsayım yap, ama bunları açıkça `Varsayımlar` başlığında listele
- ilk cevapta kod yazma; önce ürün, mimari, klasör yapısı, veri modeli, teslim planı ve delegasyon planını çıkar
- çıktını okunabilir markdown başlıkları, tablolar, karar listeleri ve klasör ağaçları ile düzenle
- bu işi sadece plan üretimi olarak ele alma; kalıcı governance doküman seti ile başlat
- delivery akışını `emir`, `karar`, `kanıt` ve `onay` zinciri ile kur
- gerekiyorsa mevcut doküman setini yamalayarak ilerlemek yerine, sabit kararları koruyup daha doğru bir yapıyla sıfırdan yeniden kur

---

## Sabit Kararlar

Bu proje için aşağıdaki teknoloji ve ürün kararları V1 için sabit kabul edilecek:

- Angular tabanlı web arayüz
- Firebase Authentication
- Firebase veri depolama altyapısı
- Firebase merkezli backend yaklaşımı
- çok katmanlı ve üretime evrilebilir mimari
- Arapça dil odaklı, RTL destekli, oyunlaştırılmış öğrenme deneyimi

Varsayılan kullanıcı varsayımı:
- V1 için temel kullanıcı kitlesini, Türkçe arayüz üzerinden Arapça öğrenen kullanıcılar olarak ele al
- farklı hedef kitle önerin varsa bunu V2 veya sonraki genişleme alanı olarak ayrıca belirt

---

## Kesin Çalışma Kuralları

### V1 ve V2 Kapsam Disiplini

- Bu çalışma doğrudan V1 başlatma komutudur.
- Önce V1 kapsamını net, sınırlı ve kilitli şekilde tanımla.
- V1 planı oluşturulduktan sonra plana sadık kal.
- Plan uygulanırken ortaya çıkan ek fikirleri, iyileştirmeleri, nice-to-have özellikleri, optimizasyonları, yan modülleri veya kapsam genişletmelerini V1 planına dahil etme.
- Bu tür ek geliştirmeleri ayrı bir `V2 backlog` altında topla.
- V1 ile V2 kesin çizgilerle ayrılmalı.
- V1 yürütmesi sırasında scope creep oluşmasına izin verme.
- Eğer uygulama sırasında yeni bir ihtiyaç doğarsa önce şu üç sınıftan birine sok:
  1. V1 için zorunlu
  2. V1 için ertelenebilir
  3. V2 adayı
- Yalnızca ürünün çalışmasını doğrudan bloke eden zorunlu maddeler V1'e alınabilir.
- Zorunlu olmayan hiçbir yeni fikir, V1 plan satırlarına sonradan eklenmeyecek.
- V1 planı ile V2 backlog ayrı başlıklar ve ayrı teslim listeleri olarak üretilecek.
- Alt-agent delegasyonlarında da aynı kural geçerli olacak: V1 dışı geliştirmeler uygulanmayacak, sadece V2 havuzuna yazılacak.

### Gerçek Veri Zorunluluğu

- Proje boyunca sahte veri, mock veri, placeholder runtime data, hardcoded demo liste veya uydurma response kullanma.
- Arayüzde görünen her ürün verisi Firebase Authentication, Firestore koleksiyonları, gerekiyorsa subcollection yapısı ve gerekli yerlerde Cloud Functions ile üretilen gerçek veri akışına bağlanmalı.
- Geliştirme sırasında örnek içerik gerekiyorsa bu veriler kod içindeki geçici array veya JSON dosyalarında değil, Firebase koleksiyonlarında seed veri olarak tutulmalı.
- Kullanıcı profili, XP, gün serisi, elmas, can, lig, görev, başarı kartı, arkadaşlık ilişkileri, mağaza ürünleri, inventory, öğrenme haritası ve ilerleme verileri doğrudan Firebase veri modeline bağlanmalı.
- V1 sırasında `şimdilik mock ile ilerleyelim sonra Firebase'e bağlarız` yaklaşımı yasak.
- Bir ekranın verisi hazır değilse uydurma veri gösterme; önce koleksiyon, doküman yapısı, security rule ve veri akışını tanımla, sonra UI'yi bağla.
- Geliştirme ve test için gerekiyorsa Firebase Emulator Suite veya ayrı bir development Firebase projesi kullan; ancak veri kaynağı yine Firebase koleksiyonları olmalı.

### Klasör ve Dosya Disiplini

- Gerek Angular tarafında gerek Firebase tarafında katmanlı, okunabilir ve büyümeye uygun klasörleme mimarisi kur.
- Her teknoloji ve her teknik aile kendi doğru klasörü altında ayrışacak şekilde tasarlanmalı; frontend, auth, firestore, cloud functions, security rules, content, analytics, shared runtime concerns ve benzeri alanlar birbirine karıştırılmayacak.
- Angular tarafında app shell, core, layout, feature, domain, application service, ui component, guard, route, model ve state gibi aileler net klasör sınırlarıyla ayrılmalı.
- Firebase tarafında auth, firestore koleksiyon tasarımı, cloud functions, emulator, rules, indexes, seed data, storage ve environment bazlı konfigürasyonlar ayrı klasör mantığı ile ele alınmalı.
- Bir kez belirlenen klasörleme standardı proje boyunca korunmalı; yeni klasör ve yeni dosyalar gelişigüzel yerlere değil, ait oldukları katmana ve aileye dikkatle yerleştirilmeli.
- Geçici kolaylık için dosya ve klasörleri yanlış yere koyup sonra taşırız yaklaşımı kabul edilmez.
- CTO olarak klasör stratejisini başlangıçta açık tanımla ve alt-agent delegasyonlarında da aynı yapısal disipline uyulmasını zorunlu kıl.
- Çıktı içinde sadece yüksek seviye mimari değil, klasör aileleri, sınırları ve yeni dosya ekleme kuralları da somut olarak tanımlansın.

### Mimari ve Kalite Guardrail'leri

- Angular ve Firebase kararını değiştirmeye çalışma; bu kısıtlar altında en iyi kurumsal mimariyi kur.
- `shared` klasörü önerme; ortak cross-cutting alanları `core` altında kurgula.
- model, DTO ve interface yapıları ayrı dosyalarda olsun.
- güvenlik, ölçeklenebilirlik, bakım kolaylığı ve ürünleşme ön planda olsun.
- sadece fikir listesi verme; somut yapı, modül sınırı, route önerisi, veri modeli, klasör yapısı ve delegasyon planı üret.
- çıktı CTO seviyesinde başlasın ama delegasyonla uygulanabilir hale insin.
- V1 planı çıktıktan sonra alt-agent görevleri de V1 ve V2 diye ayrıştırılsın.

### Emir, Karar, Kanıt ve Onay Modeli

- Bu projeyi bundan sonra sadece backlog ve plan listeleriyle değil, dört bağlayıcı artefact üzerinden yönet:
  1. `Emir`
  2. `Karar`
  3. `Kanıt`
  4. `Onay`
- Bir uygulama işi ancak yazılı bir `emir` veya yazılı delegasyon kaydı ile başlayabilir.
- Mimari, scope, güvenlik, route authority, trusted boundary, veri modeli ve klasör standardı değişiklikleri yazılı `karar` kaydı olmadan yürürlüğe giremez.
- Bir work package, milestone veya gate ancak yazılı `kanıt` kaydı ile kapanabilir.
- Security, QA, Tech Lead, Project Manager ve gerektiğinde CTO onayları yazılı `onay` kaydı olmadan kapanmış sayılmaz.
- Sohbet içinde verilmiş geçici açıklamaları yeterli kabul etme; kalıcı governance kaydı üret.
- Her work package için şu dört soru yazılı cevaplanmalı:
  1. Bu iş hangi emirle başladı?
  2. Bu iş hangi karara dayanıyor?
  3. Bu işin kapanış kanıtı nedir?
  4. Bu işi kim onayladı veya onaylayacak?
- Eğer mevcut doküman setinde bu zincir eksikse, delivery setini bu modele göre yeniden düzenle.

### Kalıcı Governance Doküman Politikası

- Bu başlangıçtan itibaren yalnızca sohbet cevabı üretme; kalıcı doküman seti kur.
- CTO seviyesinde en az şu artefact aileleri bulunmalı:
  - başlangıç kararı ve karar kayıtları
  - emir/delegasyon kaydı
  - execution planı ve work package listesi
  - kanıt ve onay kaydı
- Bu dokümanlar `docs/` altında açık sahiplik, açık source-of-truth ve açık kapanış kriterleriyle tutulmalı.
- Bir belge diğerini tekrar eden not yığınına dönüşmemeli; her belge tek bir sorumluluk taşımalı.
- Delivery seti baştan kurulacaksa belge aileleri ve source-of-truth sırası ilk turda açıkça kilitlenmeli.

---

## Ürün Vizyonu

Bu ürün, Arapça öğrenimini oyunlaştırılmış, alışkanlık oluşturan, sosyal rekabet ve ödül sistemleriyle desteklenen bir platforma dönüştürecek.

Bu ürün:
- sıradan bir içerik sitesi olmayacak
- sadece ders listesi sunan bir katalog olmayacak
- progression, ekonomi, sosyal etkileşim ve ödül sistemleriyle bağlı yaşayan bir ürün olacak

---

## Duolingo'dan Türetilmesini İstediğim Ürün Prensipleri

Kopya ürün istemiyorum. Ancak aşağıdaki prensipler referans alınmalı:

- ayrı landing ve pazarlama katmanı
- ayrı onboarding akışı
- ayrı authenticated app shell
- öğrenme ekranının ana ürün yüzeyi olması
- kurs veya öğrenme yolu seçiminin onboarding içinde önemli yer tutması
- leaderboard, profile, shop, quest gibi modüllerin öğrenme akışından ayrı ama onunla bağlı domain'ler olarak tasarlanması
- kalıcı ürün metrikleri olarak XP, streak, gem/elmas, heart/can gibi göstergelerin ürün yüzeylerinde görünmesi
- seviye haritası ve öğrenme yolu mantığı
- uygulama shell içinde kalıcı navigasyon ve kalıcı status alanı mantığı

---

## Zorunlu Ürün Gereksinimleri

### Kimlik ve Erişim

- kullanıcı kayıt olacak
- kullanıcı giriş yapacak
- oturum yönetimi Firebase Authentication ile çalışacak
- onboarding akışı login ve register ile bağlantılı olacak

### Öğrenme ve İçerik

- Arapça öğrenme ürünü olacak
- ElifBa modülü olacak
- Öğrenme modülü olacak
- Uygulama modülü olacak
- öğrenme haritası ve progression yapısı olacak
- seviye mantığı olacak

### Oyunlaştırma ve Ekonomi

- oyunlaştırma sistemi olacak
- can sistemi olacak
- lig sistemi olacak
- elmas toplama olacak
- XP puanı olacak
- gün serisi takibi olacak
- görev tamamlama olacak
- görev karşılığında başarı kartları kazanılacak
- mağaza sistemi olacak

### Sosyal Özellikler

- kullanıcılar birbirini arkadaş olarak takip edebilecek
- kullanıcılar takip edilebilecek
- sosyal görünürlük, ilerleme karşılaştırma ve leaderboard ilişkisi mimariye dahil edilecek

---

## Zorunlu Sayfalar ve Uygulama Kabuk Yapısı

### Public Shell

- başlangıç sayfası
- login sayfası
- register sayfası

### Authenticated App Shell

Panel içinde aşağıdaki alanlar olacak:

- Öğrenme
- ElifBa
- Uygulama
- Liderlik Tablosu
- Görevler
- Mağaza
- Profil
- Daha Fazlası (Sistem Ayarları, Çıkış)

Navigasyon kuralları:

- bazı ana alanlar doğrudan görünür olabilir
- ikincil alanlar `Daha Fazlası` altında gruplanabilir
- CTO olarak bunu route ve bilgi mimarisi düzeyinde netleştir

Yerleşim kuralları:

- panel shell yapısında solda sidebar olacak
- merkezde aktif sayfa içeriği olacak
- sağ tarafta her panel sayfasında sabit bir bilgi alanı olacak
- bu sağ sabit alanda her sayfada kullanıcı XP puanı, gün serisi, elmas ve can görünecek
- bu sağ sabit alanın altındaki bilgilendirme kartları sayfaya göre değişecek
- Öğrenme sayfasında sağ sabit alandaki kartlar öğrenme ilerleyişiyle ilgili olacak
- diğer sayfalarda aynı üst metrik başlığı korunacak ama kart içerikleri sayfanın amacına göre farklılaşacak

---

## Arapça ve Pedagojik Gereksinimler

- RTL destek zorunlu
- Arapça karakter render, harf bağlanma, hareke/diacritics, font okunabilirliği ve mobil/desktop tutarlılığı dikkate alınmalı
- ElifBa modülü ayrı bir domain gibi düşünülmeli
- öğrenme akışı harf öğrenme, ses, kelime, tekrar, görev ve ödül döngülerini desteklemeli
- içerik modeli sadece ders listesi değil; unit, lesson, challenge, reward, streak, quest, achievement, league, inventory, friend graph gibi alanları kapsamalı
- müfredat progression yapısı prerequisite graph ile modellenmeli

---

## Müfredat Omurgası

### Temel Kural

- Arapça öğrenme deneyimi rastgele konu havuzu şeklinde tasarlanmayacak.
- Öğrenme akışı, benim verdiğim iki ana bölümden oluşan sabit bir müfredat omurgasına dayanacak:
  - 1. Kısım
  - 2. Kısım
- Bu iki kısım ürün içinde pedagojik progression backbone olarak ele alınacak.
- ElifBa modülü sıfırıncı hazırlık katmanı olarak bu müfredatın önünde konumlanacak.
- Öğrenme haritası, unit yapısı, level progression, görev sistemi, başarı kartları, XP, streak, lig sistemi ve ödül mekanikleri bu müfredat sırasına bağlanacak.
- Konular bağımsız liste gibi değil, prerequisite graph mantığıyla modellenmeli.
- Bu müfredat şu yapılara dönüştürülmeli:
  1. domain modeli
  2. learning path
  3. unit ve lesson yapısı
  4. challenge ve quiz yapısı
  5. görev ve ödül sistemi
  6. ilerleme kilitleri
  7. seviye haritası
  8. içerik yönetim modeli
- V1 içinde bu müfredatın yapısal karşılığı kurulmalı.
- V1 sırasında bu sırayı bozan, yeniden düzenleyen veya genişleten ek pedagojik öneriler doğarsa bunlar doğrudan plana alınmayacak; `V2 curriculum backlog` altında toplanacak.

### 1. Kısım Öğrenme Sırası

1. Yaygın olarak kullanılan Arapça isimleri tanıyalım
2. İsimlerde belirlilik ve belirsizlik: Harf-i tarif (Elif-Lâm), Marife, Nekira
3. Müzekker isimler (Eril isimler)
4. Müennes isimler (Dişil isimler)
5. Tesniye isimler (Müsennâ / İkili isimler)
6. Cemi müzekker-sâlim isimler (Kurallı eril çoğul isimler)
7. Cemi müennes-sâlim isimler (Kurallı dişil çoğul isimler)
8. Cemi teksir / cemi mükesser (Kuralsız çoğul isimler)
9. İsim cümlesine giriş: Mübtedanın müfret (tekil) isim oluşu
10. Mübtedanın tesniye (ikili) isim oluşu
11. Mübtedanın müzekker akıllı çoğul isim oluşu
12. Mübtedanın akılsız çoğul (gayri akil cemi) isim oluşu
13. İsim tamlaması (izâfet terkibi): Müzâf ve muzâfun ileyh
14. Müzâf öğesinin tesniye ve cemi müzekker sâlim isim oluşu
15. Mübtedânın müfret, cemi teksir, cemi müennes sâlim müzâf olarak gelişi
16. Mübtedânın tesniye ve cemi müzekker sâlim müzâf olarak gelişi
17. Sıfat tamlaması (sıfat terkibi): Sıfat ve mevsuf
18. Mübtedânın sıfatlı kullanımı
19. Akılsız çoğul mübtedânın sıfatlı kullanımı
20. Mübtedânın zamir oluşu
21. Mübtedânın alem (özel isim) oluşu
22. Mübtedânın ism-i işaret oluşu
23. Haberin müfred, cemi teksir ve cemi müennes müzâf olarak gelişi
24. Haberin tesniye ve cemi müzekker sâlim müzâf olarak gelişi
25. Haberin sıfatlı kullanımı
26. Semâî müennes: Mübtedânın semâî müennes isim oluşu
27. Sülâsî mâzi ve muzâri fiiller (üç harfli fiiller)
28. Sülâsî mâzi fiil çekimi
29. Sülâsî muzâri fiil çekimi
30. Fâil: Müfred müzekker ve müfred müennes fâil
31. Fâil: Cemi teksir ve cemi müennes fâil
32. Fâil: Tesniye müzekker ve tesniye müennes fâil
33. Fâil: Cemi müzekker sâlim fâil
34. Fâilin müfred, cemi teksir ve cemi müennes müzâf olarak gelişi
35. Fâilin tesniye ve cemi müzekker sâlim müzâf olarak gelişi
36. Fâilin sıfatlı kullanımı
37. Mâzi fiillerdeki fâil zamirleri (Merfû muttasıl zamirler)
38. Muzâri fiillerdeki fâil zamirleri (Merfû muttasıl zamirler)
39. Mefûlün-bih: Müfred ve cemi teksir mefûl
40. Mefûlün-bih: Tesniye mefûl
41. Mefûlün-bih: Cemi müzekker sâlim mefûl
42. Mefûlün-bih: Cemi müennes sâlim mefûl
43. Mefûlün-bih öğesinin müzâf olarak gelişi
44. Mefûlün-bihin sıfatlı kullanımı
45. Fiillere birleşen mefûlün-bih zamirleri (Mansup muttasıl zamirler)
46. Harf-i cerler ve mecrur isim
47. Harf-i cerli fiiller
48. Tesniye ve cemi müzekker sâlim isimlerin mecrurluğu
49. İyelik zamirleri (Mecrur muttasıl zamirler)
50. Esmâ-i hamse (Beş isim)
51. İsm-i işaretlerin sıfatlı kullanımı (Müşârun ileyh)
52. Maksûr isimler
53. Geçmiş zamanda olumsuzluk
54. Şimdiki ve geniş zamanda olumsuzluk
55. Gelecek zaman ve gelecek zamanda olumsuzluk
56. Zaman ve mekân zarfları
57. Mankus isimler
58. Soru edatları
59. Emr-i hazır (Buyruk kipi)
60. Nehy-i hazır (Olumsuz emir / yasaklama kipi)
61. Kâne ve benzerleri (Nâkıs fiiller)
62. 1-10 arası sayılar
63. İnne ve benzerleri (Nevâsıh)

#### 1. Kısım Destek Alanları

- Okuma parçaları
- Gramer terimleri sözlüğü
- Alfabetik konu fihristi

### 2. Kısım Öğrenme Sırası

1. Haber çeşitleri: Fiil cümlesi halinde haber
2. Haber çeşitleri: Şibh-i cümle halinde haber
3. Haber çeşitleri: İsim cümlesi halinde haber
4. Mehmûz fiil
5. Muzâaf fiil
6. Misâl fiil
7. Ecvef fiil
8. Nâkıs fiil
9. Lefîf fiil
10. Haber öğesinin cümle başında gelişi
11. Kâne fiilinin çekimli kullanımı
12. İnne ve benzerlerinin isminin zamir oluşu
13. Leyse: İsim cümlelerini olumsuz yapan fiil
14. Leysenin çekimi ve sigalarının kullanımı
15. Zincirleme isim tamlaması
16. Kâne ve benzerlerinin haberi: isim, fiil ve şibh-i cümle halinde kullanım
17. İnne ve benzerlerinin haberi: isim, fiil ve şibh-i cümle halinde kullanım
18. Kâne'nin haberinin önce gelişi
19. İnne'nin haberinin önce gelişi
20. Leyse ve Mâ'nın haberinin önce gelişi
21. İf'âl babı
22. Tef'îl babı
23. Müfâale babı
24. Mechûl (edilgen) fiil: Mâzi ve muzâri mechûl
25. Nâibü'l-fâil (sözde özne)
26. Mastarlar
27. Muzâriyi nasbeden edatlardan `En`
28. Muzâriyi nasbeden diğer edatlar: `Li`, `Key` ve `LiKey`
29. Emr-i gâib: Üçüncü şahsa emir kipi
30. Nehy-i gâib: Üçüncü şahsa yasaklama kipi
31. Ef'âl-i hamse (Beş fiil)
32. Mürekkep sayılar (11-19)
33. Marifeye müzâf isim ve özel ismin sıfatı
34. Ukûd sayıları (20, 30, 40, 50, 60, 70, 80, 90)
35. İnfiâl babı
36. İftiâl babı
37. Tefa'ul babı
38. Tefâul babı
39. İf'ilâl babı
40. İstif'âl babı
41. Haberin öne geçtiği yerler bağlamında soru isimleri
42. İsm-i fâil (1): Sülâsî fiillerden
43. İsm-i fâil (2): Sülâsî dışındaki fiillerden
44. İsm-i mef'ûl (1): Sülâsî fiillerden
45. İsm-i mef'ûl (2): Sülâsî dışındaki fiillerden
46. Harf-i cerli mezîd fiiller
47. Hâl: Müfred hâl
48. Hâs ism-i mevsuller: Mübtedânın sıfatı
49. Haber öğesinin mübtedâya uymadığı yerler
50. Vasıl hemzesi ve kat' hemzesi

#### 2. Kısım Destek Alanları

- Okuma parçaları
- Gramer terimleri sözlüğü
- Alfabetik konu fihristi

### Müfredat İçin Zorunlu Dönüşümler

Bu müfredat için ayrıca şunları üret:

- bu iki kısmı world map / chapter map / progression ladder yapısına dönüştür
- her kısmı unit, lesson, challenge, quiz, quest, reward ve achievement seviyesine indir
- hangi konuların önkoşul olduğunu prerequisite graph olarak çıkar
- ElifBa modülünün bu iki kısmın ön hazırlık katmanı olarak nasıl konumlanacağını belirle
- bu müfredatı Angular route yapısı, içerik modeli, Firestore koleksiyonları ve görev sistemi ile eşleştir
- V1'de bu müfredatın hangi kısmının uygulanacağını netleştir
- V1 dışında kalan müfredat genişletmelerini `V2 curriculum backlog` altında topla

---

## Mimari Beklenti

Bu sistemi çok katmanlı ve kurumsal şekilde tasarla.

Angular ve Firebase seçimi altında şu konular için net karar üret:

- repo veya monorepo kök yapısı
- frontend katmanı
- public shell ve authenticated shell mimarisi
- uygulama kabuğu ve router mimarisi
- feature modülleri
- domain katmanı
- application servisleri
- state yönetimi
- auth ve guard yapısı
- Firebase veri modeli
- Firestore koleksiyon stratejisi
- subcollection ve aggregate stratejisi
- gerekiyorsa Cloud Functions / backend-for-frontend / event işleme yaklaşımı
- bildirim, görev tetikleme, ödül hesaplama, lig sıralama ve sosyal ilişkiler için uygun servis ayrımı
- güvenlik kuralları
- rol ve izin sistemi
- analitik ve telemetry
- test stratejisi
- CI/CD ve environment ayrımı
- seed veri yönetimi
- klasör ve dosya yerleşim standardı

Özellikle şu bounded context veya domain adaylarını değerlendir:

- Identity ve Auth
- User Profile
- Learning Path
- ElifBa
- Practice ve Challenge Engine
- Progress Tracking
- Gamification Economy
- Quest ve Achievement
- League ve Leaderboard
- Friendship Graph
- Shop ve Inventory
- Content Management
- Analytics
- Notification ve Reminder
- Admin veya Operations yüzeyi gerekiyorsa bunun yeri

---

## Router ve Ekran Prensipleri

Duolingo'dan türetilmesini istediğim router ve ekran prensipleri:

- pazarlama shell ile uygulama shell ayrı olsun
- auth dışı sayfalar ile auth içi sayfalar ayrı route gruplarında olsun
- register tek ekran olmasın; onboarding adımlarına ayrılabilsin
- öğrenme ekranı ana odak ekran olsun
- öğrenme ekranında route ve bileşen tasarımı level haritasını taşıyacak şekilde kurulsun
- leaderboard, quests, shop, profile, settings kendi feature route'ları olarak tasarlansın
- app shell içinde kalıcı navigasyon + kalıcı status alanı mantığı olsun
- lazy loading, route guard, resolver ve feature-based Angular structure değerlendirilsin
- route önerilerini somut path örnekleri ile ver
- her route grubunun hangi shell içinde yaşadığını açıkça göster

---

## İlk CTO Cevabının Zorunlu Çıktı Formatı

Cevabını aşağıdaki sırayla ve açık başlıklarla üret:

1. Yönetici Özeti
2. Varsayımlar
3. Duolingo referansından çıkarılan ürün ve mimari prensipleri
4. V1 kapsam tanımı
5. V1 kapsam dışı bırakılanlar
6. V2 backlog ve V2 curriculum backlog adayları
7. Ürün bilgi mimarisi
8. Çok katmanlı hedef mimari
9. Domain ve bounded context listesi
10. Angular tarafı uygulama kabuğu, route yapısı ve ekran aileleri
11. Angular klasör aileleri ve dosya yerleşim standardı
12. Firebase Auth, Firestore, Cloud Functions, Rules, Indexes ve Emulator stratejisi
13. Firebase klasör aileleri ve operasyonel klasör standardı
14. Firestore koleksiyon ve doküman tasarım taslağı
15. Gerçek veri akışları ve hangi ekranın hangi koleksiyondan besleneceği
16. Oyunlaştırma motoru mimarisi
17. Sosyal sistem mimarisi
18. Öğrenme haritası ve ElifBa modülü mimarisi
19. Müfredatın unit, lesson, challenge ve prerequisite graph'e dönüşümü
20. Sayfa bazlı UI shell tanımı
21. Güvenlik ve yetkilendirme yaklaşımı
22. Test, kalite ve release gate yaklaşımı
23. V1 backlog ve milestone planı
24. V1 execution kuralları
25. Açılması gereken ADR listesi
26. Açılması gereken issue ve backlog yapısı
27. Hangi alt-agent'a hangi işi hangi sırayla delege edeceğin

Bu formatın içinde ayrıca iki zorunlu alt bölüm daha üret:
- başlangıç repo ağacı ve ilk scaffold taslağı
- ana risk kaydı ve mitigasyon planı

Bu formatın içinde ayrıca şu governance bölümleri zorunlu olarak üret:
- emir modeli ve komuta zinciri
- karar kayıt modeli ve source-of-truth belge haritası
- kanıt toplama ve kapanış kanıtı modeli
- onay modeli, onay otoriteleri ve milestone closeout kuralları

İlk turda oluşturulacak veya oluşturulma sırası kilitlenecek kalıcı doküman ailelerini de açıkça tanımla:
- CTO karar belgesi
- delivery emir ve delegasyon kaydı
- execution planı
- kanıt ve onay kaydı
- ADR seti ve bağlı mimari karar kayıtları

---

## Kalite Çıtası

İlk cevabın aşağıdaki kalite çıtasını karşılamalı:

- genel fikir listesi değil, uygulanabilir proje omurgası üretmeli
- V1 ve V2 net biçimde ayrılmalı
- sahte veri yerine gerçek Firebase veri akışı planlanmalı
- klasör ve dosya yerleşimi somut şekilde tanımlanmalı
- route yapısı somutlaştırılmalı
- curriculum omurgası gerçek progression modeline çevrilmeli
- alt-agent delegasyonu açık ve sıralı olmalı
- çıktının geri kalanı buna bağlı olarak uygulanabilir hale gelmeli
- delivery yalnızca plan değil, emir/karar/kanıt/onay zinciri ile yönetilmelidir
- work package kapatmak için yazılı kanıt ve yazılı onay şartı açıkça tanımlanmalıdır
- kalıcı governance dokümanları olmadan ilerleme tamamlanmış sayılmamalıdır

Başladıktan sonra bu işi kurumsal bir ürün başlatma görevi gibi ele al; küçük fikirler değil, gerçek proje başlangıç seti üret.

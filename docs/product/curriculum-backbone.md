# Curriculum Backbone

## Omurga Ilkesi

Mufredat rastgele konu havuzu olarak degil, ElifBa hazirlik katmani uzerine oturan sabit progression backbone olarak tasarlanir. Donusum sirası sunlardir:

1. Kaynak konu listesi
2. World
3. Chapter
4. Unit
5. Lesson
6. Challenge
7. Quiz
8. Quest
9. Reward
10. Achievement

## V1 Curriculum Cut

V1, ElifBa + 1. Kisim tam backbone + 1. Kisim destek alanlari ile sinirlanir. 2. Kisim'in tum yapisal karsiligi modellenir fakat yayin ve delivery kapsami V2 curriculum backlog'tadir. Bu kesit, urune baslangictan temel gramer, isim cumlesi, fiil girisi, fail, meful, harf-i cer, olumsuzluk, soru ve emir duzeyinde butun bir yol kazandirir.

## Yapisal Donusum Kurali

| Seviye | Aciklama | Firestore Karsiligi |
| --- | --- | --- |
| World | Buyuk pedagojik faz | `catalog_learning_worlds` |
| Chapter | Konu ailesi | `catalog_learning_chapters` |
| Unit | Tamamlanabilir alt paket | `catalog_learning_units` |
| Lesson | Tek oturumluk icerik | `catalog_learning_lessons` |
| Challenge | Etkilesimli soru tipi | `catalog_challenge_templates` |
| Quiz | Unit sonu dogrulama | `catalog_quizzes` |
| Quest | Davranis ve tekrar gorevi | `catalog_quests` |
| Reward | XP, gems, achievement token | `catalog_rewards` |
| Achievement | Kalici kilometre tasi | `catalog_achievements` |

## World Haritasi

| World | Kapsam | V1 Durumu |
| --- | --- | --- |
| W0 | ElifBa hazirlik katmani | V1 |
| W1 | Isim temelleri ve belirlik | V1 |
| W2 | Isim cumlesi, izafet ve sifat | V1 |
| W3 | Fiil girisi, fail ve cekim | V1 |
| W4 | Meful, harf-i cer, iyelik ve zaman | V1 |
| W5 | Soru, emir, nehy, kâne ve inne esitigi | V1 |
| W6 | Ileri haber, kusurlu fiiller ve mezid yapilar | V2 |
| W7 | Sayilar, ileri turetme ve ileri sentaks | V2 |

## ElifBa Donusumu

| Chapter | Unitler | Lesson Odagi |
| --- | --- | --- |
| W0-C1 Harf Tanima | Harf gruplari | Harf sekli, ses, ayirt etme |
| W0-C2 Baglanma Mantigi | Bas, orta, son ve yalniz formlar | Harf baglanma ve gorunum |
| W0-C3 Hareke ve Ses | Kisa sesler, cezm, seddeli okuma | Ses farklari |
| W0-C4 Erken Kelime Cozme | Basit hece ve kelime | Okuma akisi |

## 1. Kisim Yapisal Donusumu

### W1 Isim Temelleri ve Belirlilik

Kaynak konular:

1. Yaygin olarak kullanilan Arapca isimleri taniyalim
2. Isimlerde belirlik ve belirsizlik: Harf-i tarif, marife, nekira
3. Muzekker isimler
4. Muennes isimler
5. Tesniye isimler
6. Cemi muzekker-salim isimler
7. Cemi muennes-salim isimler
8. Cemi teksir / cemi mukesser isimler

Donusum:

- Chapter W1-C1: temel isim havuzu ve belirlik
- Chapter W1-C2: cinsiyet ve cogul ailesi
- Unit ciktilari: isim tipi ayirt etme, belirlik kurma, tekil-ikili-cogul farkini gorme

### W2 Isim Cumlesi, Izafet ve Sifat

Kaynak konular:

9. Isim cumlesine giris: mubtedanin mufret isim olusu
10. Mubtedanin tesniye isim olusu
11. Mubtedanin muzekker akilli cogul isim olusu
12. Mubtedanin akilsiz cogul isim olusu
13. Isim tamlamasi: muzaf ve muzafun ileyh
14. Muzaf ogesinin tesniye ve cemi muzekker salim isim olusu
15. Mubtedanin mufret, cemi teksir, cemi muennes salim muzaf olarak gelisi
16. Mubtedanin tesniye ve cemi muzekker salim muzaf olarak gelisi
17. Sifat tamlamasi: sifat ve mevsuf
18. Mubtedanin sifatli kullanimi
19. Akilsiz cogul mubtedanin sifatli kullanimi
20. Mubtedanin zamir olusu
21. Mubtedanin alem olusu
22. Mubtedanin ism-i isaret olusu
23. Haberin mufred, cemi teksir ve cemi muennes muzaf olarak gelisi
24. Haberin tesniye ve cemi muzekker salim muzaf olarak gelisi
25. Haberin sifatli kullanimi
26. Semai muennes: mubtedanin semai muennes isim olusu

Donusum:

- Chapter W2-C1: mubteda-haber cekirdegi
- Chapter W2-C2: izafet ve sifat zinciri
- Chapter W2-C3: zamir, alem ve ism-i isaret kullanimlari
- Unit ciktilari: isim cumlesi kurma, muzaf zinciri olusturma, sifat uyumu

### W3 Fiil Girisi, Cekim ve Fail

Kaynak konular:

27. Sulasi mazi ve muzari fiiller
28. Sulasi mazi fiil cekimi
29. Sulasi muzari fiil cekimi
30. Fail: mufred muzekker ve mufred muennes fail
31. Fail: cemi teksir ve cemi muennes fail
32. Fail: tesniye muzekker ve tesniye muennes fail
33. Fail: cemi muzekker salim fail
34. Failin mufred, cemi teksir ve cemi muennes muzaf olarak gelisi
35. Failin tesniye ve cemi muzekker salim muzaf olarak gelisi
36. Failin sifatli kullanimi
37. Mazi fiillerdeki fail zamirleri
38. Muzari fiillerdeki fail zamirleri

Donusum:

- Chapter W3-C1: mazi ve muzariye giris
- Chapter W3-C2: fail ve fail zamirleri
- Chapter W3-C3: failin muzaf ve sifatli kullanimi
- Unit ciktilari: temel fiil cekimi, fail tanima, sahis farklarini cozme

### W4 Meful, Cer ve Iyelik

Kaynak konular:

39. Mefulun-bih: mufred ve cemi teksir meful
40. Mefulun-bih: tesniye meful
41. Mefulun-bih: cemi muzekker salim meful
42. Mefulun-bih: cemi muennes salim meful
43. Mefulun-bih ogesinin muzaf olarak gelisi
44. Mefulun-bihin sifatli kullanimi
45. Fiillere birlesen mefulun-bih zamirleri
46. Harf-i cerler ve mecrur isim
47. Harf-i cerli fiiller
48. Tesniye ve cemi muzekker salim isimlerin mecrurlugu
49. Iyelik zamirleri
50. Esmai hamse
51. Ism-i isaretlerin sifatli kullanimi
52. Maksur isimler

Donusum:

- Chapter W4-C1: meful ve nesne iliskisi
- Chapter W4-C2: harf-i cer ve mecrur yapilar
- Chapter W4-C3: iyelik, isaret ve ozel isim davranislari
- Unit ciktilari: nesne kurma, cer etkisi tanima, iyelik eklerini yorumlama

### W5 Zaman, Soru ve Emir

Kaynak konular:

53. Gecmis zamanda olumsuzluk
54. Simdiki ve genis zamanda olumsuzluk
55. Gelecek zaman ve gelecek zamanda olumsuzluk
56. Zaman ve mekan zarflari
57. Mankus isimler
58. Soru edatlari
59. Emr-i hazir
60. Nehy-i hazir
61. Kâne ve benzerleri
62. 1-10 arasi sayilar
63. Inne ve benzerleri

Donusum:

- Chapter W5-C1: zaman ve olumsuzluk
- Chapter W5-C2: soru ve emir dongusu
- Chapter W5-C3: kâne, inne ve temel sayilar ile giris seviyesi genisleme
- Unit ciktilari: olumsuz cümle kurma, soru sorma, basit emir kullanma, temel yapisal genisleme

### 1. Kisim Destek Alanlari

- Okuma parcalari: world sonu pekistirme lesson'lari olarak kullanilir
- Gramer terimleri sozlugu: profil ve ogrenme ekranlarinda referans katalog olarak sunulur
- Alfabetik konu fihristi: arama ve yeniden ziyaret icin katalog projection'u olur

## 2. Kisim Yapisal Donusumu

### W6 Ileri Haber ve Kusurlu Yapilar

Kaynak konular:

1. Haber cesitleri: fiil cumlesi halinde haber
2. Haber cesitleri: sibh-i cumle halinde haber
3. Haber cesitleri: isim cumlesi halinde haber
4. Mehmuz fiil
5. Muzaaf fiil
6. Misal fiil
7. Ecvef fiil
8. Nakis fiil
9. Lefif fiil
10. Haber ogesinin cumle basinda gelisi
11. Kâne fiilinin cekimli kullanimi
12. Inne ve benzerlerinin isminin zamir olusu
13. Leyse: isim cumlelerini olumsuz yapan fiil
14. Leysenin cekimi ve sigalarinin kullanimi
15. Zincirleme isim tamlamasi
16. Kâne ve benzerlerinin haberi: isim, fiil ve sibh-i cumle halinde kullanim
17. Inne ve benzerlerinin haberi: isim, fiil ve sibh-i cumle halinde kullanim
18. Kânenin haberinin once gelisi
19. Innenin haberinin once gelisi
20. Leyse ve Manin haberinin once gelisi

### W7 Mezid Yapilar, Sayilar ve Ileri Sentaks

Kaynak konular:

21. If'al babi
22. Tef'il babi
23. Mufaale babi
24. Mechul fiil: mazi ve muzari mechul
25. Naibu'l-fail
26. Mastarlar
27. Muzariyi nasbeden edatlardan En
28. Muzariyi nasbeden diger edatlar: Li, Key ve LiKey
29. Emr-i gaib
30. Nehy-i gaib
31. Efal-i hamse
32. Murekkep sayilar
33. Marifeye muzaf isim ve ozel ismin sifati
34. Ukud sayilari
35. Infial babi
36. Iftial babi
37. Tefa'ul babi
38. Tefaul babi
39. If'ilal babi
40. Istif'al babi
41. Haberin one gectigi yerler baglaminda soru isimleri
42. Ism-i fail: sulasi fiillerden
43. Ism-i fail: sulasi disindakilerden
44. Ism-i mef'ul: sulasi fiillerden
45. Ism-i mef'ul: sulasi disindakilerden
46. Harf-i cerli mezid fiiller
47. Hal: mufred hal
48. Has ism-i mevsuller: mubtedanin sifati
49. Haber ogesinin mubtedaya uymadigi yerler
50. Vasl hemzesi ve kat' hemzesi

### 2. Kisim Destek Alanlari

- Okuma parcalari: ileri chapter kapanislarinda baglamsal pekistirme metinleri olarak planlanir
- Gramer terimleri sozlugu: 2. Kisim'daki fiil bablari ve sentaks terimlerini de kapsayacak sekilde genisletilir
- Alfabetik konu fihristi: V2 yayinlarinda yeni konulari arama ve tekrar akisina baglar

## Prerequisite Graph Kurallari

- W0 tamamlanmadan W1 lesson'lari acilmaz.
- W1-C1 ve W1-C2 bitmeden W2 izafet ve sifat unit'leri acilmaz.
- W2 mubteda-haber yeterliligi, W3 fiil girisi icin onkosuldur.
- W3 fail ve sahis bilgisi, W4 meful ve cer yapılarini acar.
- W4 temel nesne ve cer yetkinligi olmadan W5 soru, emir ve kâne/inne girisleri acilmaz.
- W6 ve W7, W5 sonundaki yeterlilik rozetine baglidir ve V2 yayinlarinda etkinlesir.

## Challenge, Quiz, Quest ve Reward Esleme Kurali

| Katman | Esleme |
| --- | --- |
| Lesson | 3-7 challenge karti, tek gramer hedefi, tek okuma hedefi |
| Unit | 4-6 lesson + 1 mastery quiz |
| Chapter | 2-4 unit + 1 chapter quest |
| World | 2-3 chapter + 1 world achievement |

Reward mantigi:

- Lesson tamamlama: taban XP
- Perfect completion: ekstra XP ve sinirli gem bonusu
- Unit mastery quiz: achievement progress ve quest sayaci
- Chapter quest: kozmetik veya inventory odulu
- World closure: yeni chapter kilidi, achievement badge ve league katkisi

# Social System

## Amac

V1 sosyal sistemi, ogrenme motivasyonunu destekleyen sinirli ve guvenli bir katman olarak tasarlanir. Odak, arkadas/takip iliskileri, gorunurluk, ilerleme karsilastirma ve leaderboard bagidir; sohbet, feed veya acik topluluk yapisi V1'e alinmaz.

## V1 Sosyal Kapsam

| Ozellik | V1 Durumu | Aciklama |
| --- | --- | --- |
| Follow | Evet | Kullanici diger kullaniciyi takip edebilir |
| Friend request | Evet | Karsilikli kabul ile arkadas bagina donebilir |
| Social visibility | Evet | Profil ozetinin kimlerce gorulecegi ayarlanir |
| Progress comparison | Evet | Arkadaslar ve leaderboard baglaminda ozet karsilastirma |
| Leaderboard social slice | Evet | Genel lig icinde arkadas filtresi |
| User blocking | Sinirli | Guvenlik icin temel engelleme komutu Ops ve guvenlik surecine bagli |
| Direct messaging | Hayir | V2 adayi |
| Group, club, classroom | Hayir | V2 adayi |

## Sosyal Nesneler

| Nesne | Tip | Amac |
| --- | --- | --- |
| Follow edge | Edge belge | Tek yonlu takip iliskisi |
| Friend request | Event veya command belge | Bekleyen istek kaydi |
| Friend edge | Edge projection | Karsilikli kabul edilmis bag |
| Visibility snapshot | User snapshot | Profilin kimlere acik oldugu |
| Social stats projection | Projection | Arkadas sayisi, takipci sayisi, ortak lig gorunumu |

## Durum Makinesi

| Akis | Durumlar |
| --- | --- |
| Friend request | none -> pending -> accepted veya declined |
| Follow | none -> following -> unfollowed |
| Visibility | public -> friends-only -> leaderboard-only |
| Safety review | none -> flagged -> restricted |

## Yazim Otoritesi

- Follow baslatma istemciden komut olarak gelir ancak edge yazimi Function ile tamamlanir.
- Friend request kabul, red ve iptal islemleri trusted mutasyondur.
- Social acceptance, follower/following sayaci ve social stats projection istemciden serbest yazilmaz.
- Engelleme veya safety restriction yalniz function ve ops yetkisi ile uygulanir.

## Profil Gorunurlugu

| Seviye | Gosterilen Veri |
| --- | --- |
| Public | Kullanici adi, rozet ozetleri, toplam XP bandi |
| Friends-only | Public veriye ek olarak son chapter ve streak durumu |
| Leaderboard-only | Sadece lig ve sira baglaminda kisitli ozet |

## Uygulama Yuzeyleri

- `leaderboard` sayfasi: genel lig listesi + arkadas filtresi
- `profile` sayfasi: kullanicinin kendi sosyal sayaclari ve gorunurluk ayarlari
- `quests` sag ray kartlari: sosyal quest ilerlemeleri
- `learn` sag ray kartlari: arkadaslar arasinda mevcut sira veya ortak ilerleme ozeti

## Guvenlik ve Moderasyon Kuralı

- V1'de sosyal graph sadece kimligi dogrulanmis kullanicilar arasinda calisir.
- Social graph icin pseudonymous test kullanici seti non-prod seed verisiyle uretilir.
- Moderasyon acil durumlari icin OpsShell uzerinden gorunen audit kaydi tutulur.

## Analytics Gozlemi

- Friend request gonderme, kabul etme, takip baslatma, leaderboard filtre kullanimi ve profil gorunurluk degisimi olculur.
- Olaylar PII minimizasyonu ilkesiyle kaydedilir; acik mesaj icerigi olmadigi icin veri riski dusuktur.

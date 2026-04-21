# Release Evidence Template Standardi

## Kullanim

Her staging candidate ve production release icin ayri bir evidence kaydi olusturulur. Bu dosya bos alanli bir form degil; zorunlu bolumlerin standart tanimidir.

## Zorunlu Bolumler

### 1. Kimlik

- Release evidence ID
- Hedef ortam
- Release sahibi
- Bagli ORD ve DEC/ADR referanslari

### 2. Kapsam Ozeti

- Bu release'e giren work package'lar
- Bilincli olarak ertelenen maddeler
- Etkilenen shell ve route aileleri

### 3. Teknik Kanit Seti

- Build ve test sonucu ozeti
- Rule ve emulator sonucu
- Deploy sonucu
- Catalog publish sonucu

### 4. Kalite Kanit Seti

- Smoke test ozeti
- RTL ve Arapca dogrulama ozeti
- Kritik kusur listesi ve durumu

### 5. Guvenlik ve Operasyon

- Trusted write kontrol sonucu
- Role ve rules dogrulama ozeti
- Rollback hedefi ve readiness notu

### 6. Sonuc

- Release karari: Pass, Conditional, Fail
- Acik riskler
- Gerekli APR referanslari

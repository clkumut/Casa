# ADR-006 Curriculum Prerequisite Graph and V1 Cut

## Tarih

2026-04-21

## Durum

Accepted

## Baglam

Brief, ElifBa'nin sifirinci hazirlik katmani oldugu iki kisimli sabit bir Arapca mufredat backbone'u tanimlar. V1 ve V2 ayrimi pedagojik sira bozulmadan kurulmalidir.

## Alternatifler

| Alternatif | Degerlendirme |
| --- | --- |
| Konulari bagimsiz ders havuzu gibi sunmak | Pedagojik progression'i zayiflatir |
| ElifBa + 1. Kisim + 2. Kisim'i tek release'e almak | V1 kapsam riskini buyutur |
| ElifBa + 1. Kisim V1, 2. Kisim V2 | Pedagojik butunluk ve scope disiplini dengesini kurar |

## Karar

ElifBa hazirlik katmani ve 1. Kisim tam backbone olarak V1'e alinacak, 2. Kisim'in yapisal modeli kurulacak ancak yayin ve delivery V2 curriculum backlog'ta tutulacak. Tum progression prerequisite graph ile world/chapter/unit/lesson seviyesinde islenecek.

## Sonuclar

- V1, tam bir baslangic seviyesini kapsayan net bir ogrenme yolu sunar.
- Part 2 konusu delivery kapsamindan ciksa da veri modeli ve route omurgasi gelecege hazir olur.
- Quest, reward ve achievement'lar pedagojik backbone'a baglanir.

## Riskler ve Hafifletme

- Risk: 1. Kisim'in bile V1 icin buyuk kalmasi.
- Hafifletme: Milestone bazli publish ve chapter bazli release stratejisi uygulanir; kapsam genislemesi degil yayin takvimi ayarlanir.

## Onay

- Product Owner
- Solution Architect
- Tech Lead

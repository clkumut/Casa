# ORD-004 Trusted Learning Completion

## Emir Kimligi

| Alan | Deger |
| --- | --- |
| Emir ID | ORD-004 |
| Tarih | 2026-04-22 |
| Durum | Open |
| Emir Sahibi | Project Manager |
| Teknik Sahip | Tech Lead |
| Bagli Work Package | [../delivery/work-packages/WP-005-trusted-learning-completion.md](../delivery/work-packages/WP-005-trusted-learning-completion.md) |

## Emrin Amaci

Casa V1 lesson completion, progression ve right rail ekonomi guncelleme zincirini trusted write modeline bagli resmi delivery slice'i olarak acmak.

## Kapsam

- `startLessonChallenge` ve `completeLesson` callable command yuzeylerini resmi execution baglamina almak
- Lesson route icindeki ilk challenge gate ve minimal completion CTA'sini trusted backend zinciriyle baglamak
- Emulator smoke, guvenlik ve evidence kayitlarini WP-005 icin acmak

## Kapsam Disi

- Tam challenge motoru ve cok adimli lesson akisi
- Quest, achievement, shop, league ve social projection etkileri
- Release-ready approval kapanisi

## Mevcut Durum

- Lesson route execution giris yuzeyi ve canonical start boundary daha once acildi.
- Functions tarafinda `startLessonChallenge` ve `completeLesson` callable zinciri eklendi.
- Trusted write zinciri `learning_completion_events`, `progressionSnapshots/default` ve `rightRailSnapshots/default` belgelerine baglandi.
- Web tarafinda lesson execution sayfasi server-backed challenge attempt olmadan completion acmayacak sekilde sertlestirildi.
- `SMK-WP-005-001` smoke kaydi ile challenge precondition, actor-scoped idempotency, progression ilerlemesi ve right rail XP/hearts guncellemesi emulator ortaminda dogrulandi.

## Beklenen Ciktilar

- Actor-scoped ve idempotent trusted lesson completion command zinciri
- Lesson completion sonrasi progression ve right rail projection guncellemesinin emulator smoke ile dogrulanmasi
- WP-005 icin Security, Tech Lead ve QA sign-off'una giris kanitlarinin toplanmasi

## Kapanis Icin Gerekli Kanit

- [../evidence/work-packages/EVD-WP-005-001-trusted-learning-completion.md](../evidence/work-packages/EVD-WP-005-001-trusted-learning-completion.md)
- [../../operations/smoke-tests/dev/SMK-WP-005-001-trusted-learning-completion-emulator.md](../../operations/smoke-tests/dev/SMK-WP-005-001-trusted-learning-completion-emulator.md)

## Onay Zinciri

- WP-005: Tech Lead, Security, QA

## Notlar

- Bu emir execution-plan V1 adim 5'i resmi delivery takibine alir.
- Practice ve recovery loop dilimine gecis icin once WP-005 smoke ve guvenlik kanitinin toplanmasi gerekir.
- Emulator smoke, guncel callable export'lari icin `apps/functions` build onkosulunu da fiilen dogruladi.
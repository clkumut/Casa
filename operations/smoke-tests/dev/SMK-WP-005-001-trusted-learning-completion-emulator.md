# SMK-WP-005-001 Trusted Learning Completion Emulator Smoke

## Kayit Kimligi

| Alan | Deger |
| --- | --- |
| Smoke ID | SMK-WP-005-001 |
| Tarih | 2026-04-22 |
| Ortam | Local emulator / Dev smoke family |
| Bagli Work Package | [../../../docs/delivery/work-packages/WP-005-trusted-learning-completion.md](../../../docs/delivery/work-packages/WP-005-trusted-learning-completion.md) |
| Bagli Emir | [../../../docs/orders/ORD-004-trusted-learning-completion.md](../../../docs/orders/ORD-004-trusted-learning-completion.md) |
| Bagli Evidence | [../../../docs/evidence/work-packages/EVD-WP-005-001-trusted-learning-completion.md](../../../docs/evidence/work-packages/EVD-WP-005-001-trusted-learning-completion.md) |
| Yurutucu | CTO |

## Kapsam

Bu smoke kaydi, `startLessonChallenge` ve `completeLesson` callable'larinin Auth, Firestore ve Functions emulatorleri altinda actor-scoped trusted write zincirini dogrular.

## Calistirilan Komutlar

1. `Set-Location "D:\Projeler\Casa\apps\functions"; npm run build`
2. `Set-Location "D:\Projeler\Casa"; npx firebase-tools emulators:exec --only auth,firestore,functions --config ./firebase/firebase.json --project demo-casa-local "node ./operations/smoke-tests/dev/trusted-learning-completion-smoke.mjs"`

## Beklenen Sonuclar

- Challenge baslatilmadan `completeLesson` cagrisi `FAILED_PRECONDITION` ile reddedilir.
- `startLessonChallenge` ilk cagride `started`, ikinci cagride `already-started` doner.
- `completeLesson` ayni request anahtari ile ilk cagride `completed`, ikinci cagride `already-complete` doner.
- `progressionSnapshots/default` sonraki lesson'a ilerler.
- `rightRailSnapshots/default` icinde XP guncellenir ve hearts korunur.
- `learning_completion_events` ve `lesson_challenge_attempts` belgeleri yazilir.

## Sonuc Ozeti

- Smoke script basariyla calisti.
- Challenge baslatilmadan `completeLesson` cagrisi beklendigi gibi `FAILED_PRECONDITION` ile reddedildi.
- `startLessonChallenge` ilk cagride `started`, ikinci cagride `already-started` dondu.
- `completeLesson` ilk cagride `completed`, ikinci cagride `already-complete` dondu.
- Progression snapshot sonraki lesson'a ilerledi ve right rail XP `10`, hearts `5` olarak dogrulandi.

## Gozlemler

- Functions emulator host Node `24` ve `engines.node = 20` farki icin warning verdi; smoke sonucu buna ragmen basarili oldu.
- Emulator ilk denemede guncel callable export'larini gormedigi icin `apps/functions/lib` icin build onkosulu gerekli oldugu dogrulandi.
- Callable verification log'lari `auth: VALID` debug kayitlari ile gecerli auth baglamini gosterdi.

## Cikti Ozetleri

```text
functions[us-central1-completeLesson]: http function initialized (http://127.0.0.1:5001/demo-casa-local/us-central1/completeLesson).
functions[us-central1-startLessonChallenge]: http function initialized (http://127.0.0.1:5001/demo-casa-local/us-central1/startLessonChallenge).
Script exited successfully (code 0)
```

```json
{
  "smokeId": "SMK-WP-005-001",
  "completionWithoutStart": "FAILED_PRECONDITION",
  "firstCompleteResponse": {
    "completedLessonCount": 1,
    "currentHearts": 5,
    "lifetimeXp": 10,
    "status": "completed"
  },
  "firstStartResponse": {
    "status": "started"
  },
  "secondCompleteResponse": {
    "completedLessonCount": 1,
    "currentHearts": 5,
    "lifetimeXp": 10,
    "status": "already-complete"
  },
  "secondStartResponse": {
    "status": "already-started"
  }
}
```
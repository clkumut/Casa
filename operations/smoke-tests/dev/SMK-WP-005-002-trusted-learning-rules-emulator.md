# SMK-WP-005-002 Trusted Learning Rules Emulator Smoke

## Kayit Kimligi

| Alan | Deger |
| --- | --- |
| Smoke ID | SMK-WP-005-002 |
| Tarih | 2026-04-22 |
| Ortam | Local emulator / Dev smoke family |
| Bagli Work Package | [../../../docs/delivery/work-packages/WP-005-trusted-learning-completion.md](../../../docs/delivery/work-packages/WP-005-trusted-learning-completion.md) |
| Bagli Emir | [../../../docs/orders/ORD-004-trusted-learning-completion.md](../../../docs/orders/ORD-004-trusted-learning-completion.md) |
| Bagli Evidence | [../../../docs/evidence/work-packages/EVD-WP-005-001-trusted-learning-completion.md](../../../docs/evidence/work-packages/EVD-WP-005-001-trusted-learning-completion.md) |
| Yurutucu | CTO |

## Kapsam

Bu smoke kaydi, authenticated kullanicinin client Firestore SDK uzerinden WP-005 trusted write belgelerine dogrudan yazamadigini dogrular.

## Calistirilan Komutlar

1. `Set-Location "D:\Projeler\Casa"; npx firebase-tools emulators:exec --only auth,firestore --config ./firebase/firebase.json --project demo-casa-local "node ./operations/smoke-tests/dev/trusted-learning-rules-smoke.mjs"`

## Beklenen Sonuclar

- `users/{uid}/progressionSnapshots/default` write denemesi `permission-denied` ile reddedilir.
- `users/{uid}/rightRailSnapshots/default` write denemesi `permission-denied` ile reddedilir.
- `learning_completion_events/*` write denemesi `permission-denied` ile reddedilir.
- `lesson_challenge_attempts/*` write denemesi `permission-denied` ile reddedilir.

## Sonuc Ozeti

- Smoke script basariyla calisti.
- `progressionSnapshots/default`, `rightRailSnapshots/default`, `learning_completion_events/*` ve `lesson_challenge_attempts/*` icin dogrudan client write denemeleri `permission-denied` ile reddedildi.
- Trusted learning completion zinciri icin mutasyon authority'nin callable katmaninda kaldigi emulator ortaminda dogrulandi.

## Gozlemler

- Negatif rules smoke, Firestore rules bypass eden Admin SDK ile degil, Firebase client SDK ile calistirilmalidir.
- Firestore emulator log'lari progression ve right rail alt koleksiyonlari icin ilgili rule satirlarinda `false for create/update` sonucunu acikca gosterdi.

## Cikti Ozetleri

```text
GrpcConnection RPC 'Write' ... PERMISSION_DENIED
Script exited successfully (code 0)
```

```json
{
	"smokeId": "SMK-WP-005-002",
	"deniedChallengeAttemptWrite": {
		"code": "permission-denied"
	},
	"deniedCompletionEventWrite": {
		"code": "permission-denied"
	},
	"deniedProgressionWrite": {
		"code": "permission-denied"
	},
	"deniedRightRailWrite": {
		"code": "permission-denied"
	}
}
```
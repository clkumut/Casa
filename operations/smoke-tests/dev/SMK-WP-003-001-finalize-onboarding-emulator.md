# SMK-WP-003-001 Finalize Onboarding Emulator Smoke

## Kayit Kimligi

| Alan | Deger |
| --- | --- |
| Smoke ID | SMK-WP-003-001 |
| Tarih | 2026-04-22 |
| Ortam | Local emulator / Dev smoke family |
| Bagli Work Package | [../../../docs/delivery/work-packages/WP-003-auth-and-onboarding.md](../../../docs/delivery/work-packages/WP-003-auth-and-onboarding.md) |
| Bagli Emir | [../../../docs/orders/ORD-003-auth-and-onboarding.md](../../../docs/orders/ORD-003-auth-and-onboarding.md) |
| Yurutucu | CTO |

## Kapsam

Bu smoke kaydi, WP-003 kapsamindaki trusted `finalizeOnboarding` callable'inin Auth, Firestore ve Functions emulatorleri altinda calistigini dogrular.

## Calistirilan Komutlar

1. `npx firebase-tools emulators:exec --only auth,firestore,functions --config ./firebase/firebase.json --project demo-casa-local "node ./operations/smoke-tests/dev/finalize-onboarding-smoke.mjs"`

## Beklenen Sonuclar

- Auth emulator uzerinden yeni bir kullanici uretilir.
- Kullanici icin gerekli onboarding draft alanlari seed edilir.
- `finalizeOnboarding` callable ilk cagride `completed`, ikinci cagride `already-complete` doner.
- `users/{uid}` belgesinde `onboardingCompletedAt` alaninin yazildigi gorulur.

## Sonuc Ozeti

- Smoke script Auth, Firestore ve Functions emulatorleri altinda basariyla calisti.
- `finalizeOnboarding` ilk cagride `completed`, ikinci cagride `already-complete` dondu.
- Seed edilen kullanici belgesinde `onboardingCompletedAt` alani dogrulandi.

## Gozlemler

- Functions emulator yine host Node `24` ve `engines.node = 20` farki icin warning verdi; callable yuklemesi ve smoke sonucu bu warning'e ragmen basarili oldu.
- Callable verification log'u auth baglaminin gecerli oldugunu gosteren `auth: VALID` debug kaydini uretti.

## Cikti Ozetleri

```text
functions[us-central1-finalizeOnboarding]: http function initialized (http://127.0.0.1:5001/demo-casa-local/us-central1/finalizeOnboarding).
Script exited successfully (code 0)
```

```json
{
	"smokeId": "SMK-WP-003-001",
	"firstFinalizeResponse": {
		"status": "completed"
	},
	"secondFinalizeResponse": {
		"status": "already-complete"
	}
}
```
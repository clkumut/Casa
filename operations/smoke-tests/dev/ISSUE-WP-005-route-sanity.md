Title: Route-sanity smoke failing: Firestore WebChannel 'Listen' transport errored

Summary:
- The route-sanity smoke (`trusted-learning-route-sanity-smoke.mjs`) times out waiting for the learn-home bootstrap text.
- Browser console shows Firestore Listen transport errors (WebChannel request to http://127.0.0.1:8080/google.firestore.v1.Firestore/Listen repeatedly fails with net::ERR_ABORTED and `FirebaseError: [code=unavailable]`).

Repro steps (local):
1. Start emulators in repo root: `npx firebase-tools emulators:start --only auth,firestore --project demo-casa-local`
2. Build web app: `npm run build:web` (dist available at `apps/web/dist/casa-web`) — already built in reproducer.
3. Run smoke script: `node operations/smoke-tests/dev/trusted-learning-route-sanity-smoke.mjs`

Observed artifacts (local paths):
- Smoke run log: `operations/smoke-tests/dev/artifacts/route-sanity-run.log`
- Smoke script prints JSON failure containing `consoleDump` with Firestore Listen errors.

Key console excerpt:
- `requestfailed: http://127.0.0.1:8080/google.firestore.v1.Firestore/Listen/channel?... net::ERR_ABORTED`
- `@firebase/firestore: WebChannelConnection RPC 'Listen' stream transport errored`
- `FirebaseError: [code=unavailable]: The operation could not be completed` (client falls back to offline mode)

Hypothesis / likely causes:
- Web client cannot establish a streaming WebChannel connection to the Firestore emulator. Possible causes:
  - Port/proxy/antivirus interfering with streaming requests.
  - Bundle runtime ordering: the app initializes Firestore before emulator is reachable or before connect-once runs in dist, producing transient failures.
  - Incompatible client / emulator versions (but emulator is recent; web SDK 12.x should be compatible).

Proposed next steps for Frontend owner:
1. Reproduce locally using the exact smoke steps above and inspect browser Network tab for the failing `google.firestore.v1.Firestore/Listen` request (check response codes and CORS).
2. Confirm that `connectFirestoreEmulatorOnce` is called before any Firestore listeners are attached in the dist bundle; if not, move emulator connect earlier in bootstrap path.
3. Add defensive retry/backoff for subscribing listeners used by the Learn bootstrap so UI can render shell while listeners attach.
4. If repro shows CORS or network aborts, check local environment (proxy/antivirus) and emulator debug logs (`firestore-debug.log`).

Assign/Labels: frontend, smoke-failure, wp-005

Attachments: see `operations/smoke-tests/dev/artifacts/route-sanity-run.log` for raw output.

Contact: I can pair-debug the failing Listen stream and provide a short PR to guard the Learn bootstrap if you want me to implement it. 

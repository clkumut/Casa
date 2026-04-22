process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.GCLOUD_PROJECT = 'demo-casa-local';

import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { deleteApp, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { connectFirestoreEmulator, doc, getFirestore, setDoc } from 'firebase/firestore';

const FIREBASE_CLIENT_CONFIG = {
  apiKey: 'demo-casa-local-api-key',
  appId: '1:000000000000:web:demo-casa-local',
  authDomain: 'demo-casa-local.firebaseapp.com',
  messagingSenderId: '000000000000',
  projectId: 'demo-casa-local',
  storageBucket: 'demo-casa-local.firebasestorage.app',
};

const smokeRunId = Date.now();
const email = `smoke-rules-${smokeRunId}@casa.local`;
const password = 'SmokePass123!';

const adminApp = initializeAdminApp({ projectId: 'demo-casa-local' });
const adminFirestore = getAdminFirestore(adminApp);

const signUpResponse = await fetch(
  `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CLIENT_CONFIG.apiKey}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  },
);

if (!signUpResponse.ok) {
  throw new Error(`Auth emulator signUp failed with ${signUpResponse.status}.`);
}

const signUpPayload = await signUpResponse.json();
const uid = signUpPayload.localId;

await adminFirestore.collection('users').doc(uid).set({
  email,
  uid,
});

const clientApp = initializeApp(FIREBASE_CLIENT_CONFIG, `smoke-rules-${smokeRunId}`);
const auth = getAuth(clientApp);
const firestore = getFirestore(clientApp);

connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
connectFirestoreEmulator(firestore, '127.0.0.1', 8080);

await signInWithEmailAndPassword(auth, email, password);

const expectPermissionDenied = async (label, operation) => {
  try {
    await operation();
  } catch (error) {
    const errorCode = typeof error?.code === 'string' ? error.code : 'unknown';

    if (errorCode === 'permission-denied' || errorCode.endsWith('/permission-denied')) {
      return {
        code: errorCode,
        label,
      };
    }

    throw new Error(`${label} returned unexpected error code: ${errorCode}`);
  }

  throw new Error(`${label} unexpectedly succeeded.`);
};

const deniedProgressionWrite = await expectPermissionDenied('progressionSnapshots/default write', () =>
  setDoc(
    doc(firestore, 'users', uid, 'progressionSnapshots', 'default'),
    { currentLessonId: 'client-write-lesson' },
    { merge: true },
  ),
);

const deniedRightRailWrite = await expectPermissionDenied('rightRailSnapshots/default write', () =>
  setDoc(
    doc(firestore, 'users', uid, 'rightRailSnapshots', 'default'),
    { lifetimeXp: 999 },
    { merge: true },
  ),
);

const deniedCompletionEventWrite = await expectPermissionDenied('learning_completion_events write', () =>
  setDoc(doc(firestore, 'learning_completion_events', `client-event-${smokeRunId}`), {
    lessonId: 'client-event-lesson',
    uid,
  }),
);

const deniedChallengeAttemptWrite = await expectPermissionDenied('lesson_challenge_attempts write', () =>
  setDoc(doc(firestore, 'lesson_challenge_attempts', `client-attempt-${smokeRunId}`), {
    lessonId: 'client-attempt-lesson',
    status: 'started',
    uid,
  }),
);

await deleteApp(clientApp);

console.log(
  JSON.stringify(
    {
      smokeId: 'SMK-WP-005-002',
      deniedChallengeAttemptWrite,
      deniedCompletionEventWrite,
      deniedProgressionWrite,
      deniedRightRailWrite,
      uid,
    },
    null,
    2,
  ),
);
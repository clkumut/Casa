process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.GCLOUD_PROJECT = 'demo-casa-local';

import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const FIREBASE_CLIENT_CONFIG = {
  apiKey: 'demo-casa-local-api-key',
  appId: '1:000000000000:web:demo-casa-local',
  authDomain: 'demo-casa-local.firebaseapp.com',
  messagingSenderId: '000000000000',
  projectId: 'demo-casa-local',
  storageBucket: 'demo-casa-local.firebasestorage.app',
};

const smokeRunId = Date.now();
const email = `smoke-finalize-${smokeRunId}@casa.local`;
const password = 'SmokePass123!';

const adminApp = initializeAdminApp({ projectId: 'demo-casa-local' });
const adminFirestore = getFirestore(adminApp);

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
const idToken = signUpPayload.idToken;

await adminFirestore.collection('users').doc(uid).set({
  email,
  goalCode: 'smoke-goal',
  habitCode: 'smoke-habit',
  levelCode: 'smoke-level',
  pathMode: 'smoke-path',
  uid,
});

const callFinalizeOnboarding = async () => {
  const response = await fetch(
    'http://127.0.0.1:5001/demo-casa-local/us-central1/finalizeOnboarding',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {},
      }),
    },
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`finalizeOnboarding failed with ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload.result ?? payload.data ?? payload;
};

const firstFinalizeResponse = await callFinalizeOnboarding();
const secondFinalizeResponse = await callFinalizeOnboarding();
const userSnapshot = await adminFirestore.collection('users').doc(uid).get();
const onboardingCompletedAt = userSnapshot.get('onboardingCompletedAt');

if (firstFinalizeResponse.status !== 'completed') {
  throw new Error(`Expected first finalize status to be completed, got ${firstFinalizeResponse.status}.`);
}

if (secondFinalizeResponse.status !== 'already-complete') {
  throw new Error(
    `Expected second finalize status to be already-complete, got ${secondFinalizeResponse.status}.`,
  );
}

if (!onboardingCompletedAt) {
  throw new Error('Expected onboardingCompletedAt to be written to the user document.');
}

console.log(
  JSON.stringify(
    {
      smokeId: 'SMK-WP-003-001',
      firstFinalizeResponse,
      secondFinalizeResponse,
      uid,
    },
    null,
    2,
  ),
);
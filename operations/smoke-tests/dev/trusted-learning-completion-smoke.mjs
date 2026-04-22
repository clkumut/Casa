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
const email = `smoke-learning-${smokeRunId}@casa.local`;
const password = 'SmokePass123!';
const requestId = `smk-wp-005-${smokeRunId}`;

const adminApp = initializeAdminApp({ projectId: 'demo-casa-local' });
const adminFirestore = getFirestore(adminApp);

const worldId = `world-smoke-${smokeRunId}`;
const chapterId = `chapter-smoke-${smokeRunId}`;
const unitId = `unit-smoke-${smokeRunId}`;
const lessonOneId = `lesson-smoke-1-${smokeRunId}`;
const lessonTwoId = `lesson-smoke-2-${smokeRunId}`;

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
  activeStreakDays: 1,
  currentGems: 0,
  currentHearts: 5,
  email,
  lifetimeXp: 0,
  uid,
});

await adminFirestore.collection('users').doc(uid).collection('progressionSnapshots').doc('default').set({
  completedLessonIds: [],
  currentChapterId: chapterId,
  currentLessonId: null,
  currentUnitId: unitId,
  currentWorldId: worldId,
  masteredUnitIds: [],
  unlockState: 'unlocked',
});

await adminFirestore.collection('users').doc(uid).collection('rightRailSnapshots').doc('default').set({
  activeStreakDays: 1,
  currentGems: 0,
  currentHearts: 5,
  heartsCapacity: 5,
  lifetimeXp: 0,
});

await adminFirestore.collection('catalog_learning_worlds').doc(worldId).set({
  order: 1,
  publishState: 'published',
  title: 'Smoke World',
});

await adminFirestore.collection('catalog_learning_chapters').doc(chapterId).set({
  order: 1,
  publishState: 'published',
  title: 'Smoke Chapter',
  worldId,
});

await adminFirestore.collection('catalog_learning_units').doc(unitId).set({
  chapterId,
  order: 1,
  publishState: 'published',
  title: 'Smoke Unit',
});

await adminFirestore.collection('catalog_learning_lessons').doc(lessonOneId).set({
  challengeIds: ['challenge-smoke-1'],
  order: 1,
  publishState: 'published',
  title: 'Smoke Lesson 1',
  unitId,
});

await adminFirestore.collection('catalog_learning_lessons').doc(lessonTwoId).set({
  challengeIds: ['challenge-smoke-2'],
  order: 2,
  publishState: 'published',
  title: 'Smoke Lesson 2',
  unitId,
});

const callCallable = async (name, data, expectOk = true) => {
  const response = await fetch(`http://127.0.0.1:5001/demo-casa-local/us-central1/${name}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  const payload = await response.json();

  if (expectOk && !response.ok) {
    throw new Error(`${name} failed with ${response.status}: ${JSON.stringify(payload)}`);
  }

  if (!expectOk && response.ok) {
    throw new Error(`${name} unexpectedly succeeded: ${JSON.stringify(payload)}`);
  }

  return payload.result ?? payload.data ?? payload;
};

const completionWithoutStart = await callCallable(
  'completeLesson',
  {
    lessonId: lessonOneId,
    requestId: `${requestId}-without-start`,
    unitId,
  },
  false,
);

const firstStartResponse = await callCallable('startLessonChallenge', {
  lessonId: lessonOneId,
  unitId,
});

const secondStartResponse = await callCallable('startLessonChallenge', {
  lessonId: lessonOneId,
  unitId,
});

const firstCompleteResponse = await callCallable('completeLesson', {
  lessonId: lessonOneId,
  requestId,
  unitId,
});

const secondCompleteResponse = await callCallable('completeLesson', {
  lessonId: lessonOneId,
  requestId,
  unitId,
});

const progressionSnapshot = await adminFirestore
  .collection('users')
  .doc(uid)
  .collection('progressionSnapshots')
  .doc('default')
  .get();
const rightRailSnapshot = await adminFirestore
  .collection('users')
  .doc(uid)
  .collection('rightRailSnapshots')
  .doc('default')
  .get();
const completionEventSnapshot = await adminFirestore
  .collection('learning_completion_events')
  .doc(`${uid}_${requestId}`)
  .get();
const challengeAttemptSnapshot = await adminFirestore
  .collection('lesson_challenge_attempts')
  .doc(`${uid}_${unitId}_${lessonOneId}`)
  .get();

if (completionWithoutStart?.error?.status !== 'FAILED_PRECONDITION') {
  throw new Error('Expected completion without start to fail with FAILED_PRECONDITION.');
}

if (firstStartResponse.status !== 'started') {
  throw new Error(`Expected first start to be started, got ${firstStartResponse.status}.`);
}

if (secondStartResponse.status !== 'already-started') {
  throw new Error(`Expected second start to be already-started, got ${secondStartResponse.status}.`);
}

if (firstCompleteResponse.status !== 'completed') {
  throw new Error(`Expected first complete to be completed, got ${firstCompleteResponse.status}.`);
}

if (secondCompleteResponse.status !== 'already-complete') {
  throw new Error(`Expected second complete to be already-complete, got ${secondCompleteResponse.status}.`);
}

if (!progressionSnapshot.exists || progressionSnapshot.get('currentLessonId') !== lessonTwoId) {
  throw new Error('Expected progression snapshot currentLessonId to advance to the next lesson.');
}

if ((progressionSnapshot.get('completedLessonIds') ?? []).length !== 1) {
  throw new Error('Expected a single completed lesson id in progression snapshot.');
}

if (!rightRailSnapshot.exists || rightRailSnapshot.get('lifetimeXp') !== 10) {
  throw new Error('Expected right rail lifetimeXp to be updated to 10.');
}

if (rightRailSnapshot.get('currentHearts') !== 5) {
  throw new Error('Expected right rail currentHearts to stay at 5.');
}

if (!completionEventSnapshot.exists || completionEventSnapshot.get('status') !== 'completed') {
  throw new Error('Expected a completed learning completion event to be written.');
}

if (!challengeAttemptSnapshot.exists || challengeAttemptSnapshot.get('status') !== 'completed') {
  throw new Error('Expected the lesson challenge attempt to be marked completed.');
}

console.log(
  JSON.stringify(
    {
      smokeId: 'SMK-WP-005-001',
      completionWithoutStart: completionWithoutStart.error?.status ?? null,
      firstCompleteResponse,
      firstStartResponse,
      secondCompleteResponse,
      secondStartResponse,
      uid,
    },
    null,
    2,
  ),
);
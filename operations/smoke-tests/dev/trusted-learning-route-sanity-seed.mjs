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

const seedRunId = Date.now();
const email = `smoke-route-${seedRunId}@casa.local`;
const password = 'SmokePass123!';
const worldId = `world-route-${seedRunId}`;
const chapterId = `chapter-route-${seedRunId}`;
const unitId = `unit-route-${seedRunId}`;
const lessonOneId = `lesson-route-1-${seedRunId}`;
const lessonTwoId = `lesson-route-2-${seedRunId}`;

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

await adminFirestore.collection('users').doc(uid).set({
  activeStreakDays: 1,
  currentGems: 0,
  currentHearts: 5,
  email,
  goalCode: 'consistency',
  habitCode: 'daily',
  levelCode: 'beginner',
  lifetimeXp: 0,
  onboardingCompletedAt: new Date().toISOString(),
  pathMode: 'guided',
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
  title: 'Route Sanity World',
});

await adminFirestore.collection('catalog_learning_chapters').doc(chapterId).set({
  order: 1,
  publishState: 'published',
  title: 'Route Sanity Chapter',
  worldId,
});

await adminFirestore.collection('catalog_learning_units').doc(unitId).set({
  chapterId,
  order: 1,
  publishState: 'published',
  title: 'Route Sanity Unit',
});

await adminFirestore.collection('catalog_learning_lessons').doc(lessonOneId).set({
  challengeIds: ['challenge-route-1'],
  order: 1,
  publishState: 'published',
  title: 'Route Sanity Lesson 1',
  unitId,
});

await adminFirestore.collection('catalog_learning_lessons').doc(lessonTwoId).set({
  challengeIds: ['challenge-route-2'],
  order: 2,
  publishState: 'published',
  title: 'Route Sanity Lesson 2',
  unitId,
});

console.log(
  JSON.stringify(
    {
      smokeId: 'SMK-WP-005-003-SEED',
      email,
      lessonOneId,
      lessonTwoId,
      password,
      uid,
      unitId,
      unitRoute: `/app/learn/unit/${unitId}`,
      lessonRoute: `/app/learn/unit/${unitId}/lesson/${lessonOneId}`,
      worldId,
    },
    null,
    2,
  ),
);
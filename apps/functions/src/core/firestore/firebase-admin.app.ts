import { getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

export const getFirebaseAdminApp = (): App => {
  return getApps().length > 0 ? getApp() : initializeApp();
};

export const getFirebaseAdminFirestore = (): Firestore => {
  return getFirestore(getFirebaseAdminApp());
};
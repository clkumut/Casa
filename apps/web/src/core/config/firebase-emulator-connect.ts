import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Firestore as FirestoreLite } from 'firebase/firestore/lite';

type ConnectAuthEmulatorFn = typeof import('firebase/auth')['connectAuthEmulator'];
type ConnectFirestoreEmulatorFn = typeof import('firebase/firestore')['connectFirestoreEmulator'];
type ConnectLiteFirestoreEmulatorFn = typeof import('firebase/firestore/lite')['connectFirestoreEmulator'];
type GetFirestoreFn = typeof import('firebase/firestore')['getFirestore'];
type InitializeFirestoreFn = typeof import('firebase/firestore')['initializeFirestore'];
type GetLiteFirestoreFn = typeof import('firebase/firestore/lite')['getFirestore'];

type EmulatorRegistryGlobal = typeof globalThis & {
  __casaAuthEmulatorConnections__?: WeakSet<Auth>;
  __casaFirestoreEmulatorConnections__?: WeakSet<Firestore>;
  __casaFirestoreInstances__?: WeakMap<FirebaseApp, Firestore>;
  __casaLiteFirestoreEmulatorConnections__?: WeakSet<FirestoreLite>;
  __casaLiteFirestoreInstances__?: WeakMap<FirebaseApp, FirestoreLite>;
  navigator?: Navigator & {
    webdriver?: boolean;
  };
};

const emulatorRegistryGlobal = globalThis as EmulatorRegistryGlobal;

const getAuthRegistry = (): WeakSet<Auth> => {
  emulatorRegistryGlobal.__casaAuthEmulatorConnections__ ??= new WeakSet<Auth>();

  return emulatorRegistryGlobal.__casaAuthEmulatorConnections__;
};

const getFirestoreRegistry = (): WeakSet<Firestore> => {
  emulatorRegistryGlobal.__casaFirestoreEmulatorConnections__ ??= new WeakSet<Firestore>();

  return emulatorRegistryGlobal.__casaFirestoreEmulatorConnections__;
};

const getFirestoreInstanceRegistry = (): WeakMap<FirebaseApp, Firestore> => {
  emulatorRegistryGlobal.__casaFirestoreInstances__ ??= new WeakMap<FirebaseApp, Firestore>();

  return emulatorRegistryGlobal.__casaFirestoreInstances__;
};

const getLiteFirestoreRegistry = (): WeakSet<FirestoreLite> => {
  emulatorRegistryGlobal.__casaLiteFirestoreEmulatorConnections__ ??= new WeakSet<FirestoreLite>();

  return emulatorRegistryGlobal.__casaLiteFirestoreEmulatorConnections__;
};

const getLiteFirestoreInstanceRegistry = (): WeakMap<FirebaseApp, FirestoreLite> => {
  emulatorRegistryGlobal.__casaLiteFirestoreInstances__ ??= new WeakMap<FirebaseApp, FirestoreLite>();

  return emulatorRegistryGlobal.__casaLiteFirestoreInstances__;
};

export const connectAuthEmulatorOnce = (
  authModule: { connectAuthEmulator: ConnectAuthEmulatorFn },
  auth: Auth,
): void => {
  const authRegistry = getAuthRegistry();

  if (authRegistry.has(auth)) {
    return;
  }

  authModule.connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
    disableWarnings: true,
  });
  authRegistry.add(auth);
};

export const connectFirestoreEmulatorOnce = (
  firestoreModule: { connectFirestoreEmulator: ConnectFirestoreEmulatorFn },
  firestore: Firestore,
): void => {
  const firestoreRegistry = getFirestoreRegistry();

  if (firestoreRegistry.has(firestore)) {
    return;
  }

  firestoreModule.connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  firestoreRegistry.add(firestore);
};

export const connectLiteFirestoreEmulatorOnce = (
  firestoreModule: { connectFirestoreEmulator: ConnectLiteFirestoreEmulatorFn },
  firestore: FirestoreLite,
): void => {
  const firestoreRegistry = getLiteFirestoreRegistry();

  if (firestoreRegistry.has(firestore)) {
    return;
  }

  firestoreModule.connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  firestoreRegistry.add(firestore);
};

export const resolveFirestoreInstance = (
  firestoreModule: {
    getFirestore: GetFirestoreFn;
    initializeFirestore: InitializeFirestoreFn;
  },
  firebaseApp: FirebaseApp,
  useEmulators: boolean,
): Firestore => {
  const firestoreInstanceRegistry = getFirestoreInstanceRegistry();
  const existingFirestore = firestoreInstanceRegistry.get(firebaseApp);

  if (existingFirestore) {
    return existingFirestore;
  }

  const firestore = useEmulators
    ? firestoreModule.initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
      })
    : firestoreModule.getFirestore(firebaseApp);

  firestoreInstanceRegistry.set(firebaseApp, firestore);
  return firestore;
};

export const resolveLiteFirestoreInstance = (
  firestoreModule: {
    getFirestore: GetLiteFirestoreFn;
  },
  firebaseApp: FirebaseApp,
): FirestoreLite => {
  const firestoreInstanceRegistry = getLiteFirestoreInstanceRegistry();
  const existingFirestore = firestoreInstanceRegistry.get(firebaseApp);

  if (existingFirestore) {
    return existingFirestore;
  }

  const firestore = firestoreModule.getFirestore(firebaseApp);

  firestoreInstanceRegistry.set(firebaseApp, firestore);
  return firestore;
};

export const shouldUseFirestoreOneShotReads = (useEmulators: boolean): boolean => {
  const userAgent = emulatorRegistryGlobal.navigator?.userAgent ?? '';

  return useEmulators && (
    emulatorRegistryGlobal.navigator?.webdriver === true
      || /headless/i.test(userAgent)
  );
};

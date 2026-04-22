import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type EmulatorRegistryGlobal = typeof globalThis & {
  __casaAuthEmulatorConnections__?: WeakSet<Auth>;
  __casaFirestoreEmulatorConnections__?: WeakSet<Firestore>;
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

export const connectAuthEmulatorOnce = (
  authModule: { connectAuthEmulator: (auth: Auth, url: string, options?: { disableWarnings?: boolean }) => void },
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
  firestoreModule: { connectFirestoreEmulator: (firestore: Firestore, host: string, port: number) => void },
  firestore: Firestore,
): void => {
  const firestoreRegistry = getFirestoreRegistry();

  if (firestoreRegistry.has(firestore)) {
    return;
  }

  firestoreModule.connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  firestoreRegistry.add(firestore);
};
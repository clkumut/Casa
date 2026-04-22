import { DestroyRef, Injectable, effect, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore, Unsubscribe } from 'firebase/firestore';

import { AuthSessionStore } from '../state/auth-session.store';
import { CASA_RUNTIME_CONFIG } from '../config/casa-runtime-config.token';
import { RightRailStore } from '../state/right-rail.store';
import { resolveRightRailSnapshot } from '../state/models/right-rail-snapshot.model';

@Injectable({ providedIn: 'root' })
export class FirebaseRightRailProjectionService {
  private static readonly FIREBASE_MODULES = Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);

  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly rightRailStore = inject(RightRailStore);
  private readonly runtimeConfig = inject(CASA_RUNTIME_CONFIG);

  private firestore: Firestore | null = null;
  private firestoreEmulatorConnected = false;
  private firestoreModule: Awaited<typeof FirebaseRightRailProjectionService.FIREBASE_MODULES>[1] | null =
    null;
  private firebaseApp: FirebaseApp | null = null;
  private initializationPromise: Promise<void> | null = null;
  private readyPromise: Promise<void> = Promise.resolve();
  private resolveReadyPromise: (() => void) | null = null;

  public constructor() {
    effect(
      (onCleanup) => {
        const session = this.authSessionStore.session();

        if (session.status !== 'authenticated' || !session.uid) {
          this.resolveCurrentReadyPromise();
          this.rightRailStore.reset();
          return;
        }

        this.resetReadyPromise();
        this.rightRailStore.setLoading();

        let isActive = true;
        let unsubscribe: Unsubscribe | null = null;

        void this.connectSnapshot(session.uid).then((snapshotUnsubscribe) => {
          if (!isActive) {
            snapshotUnsubscribe();
            return;
          }

          unsubscribe = snapshotUnsubscribe;
        });

        onCleanup(() => {
          isActive = false;
          unsubscribe?.();
        });
      },
      { allowSignalWrites: true },
    );

    this.destroyRef.onDestroy(() => {
      this.resolveCurrentReadyPromise();
    });
  }

  public async initialize(): Promise<void> {
    await this.initializeFirestore();
    await this.readyPromise;
  }

  private async connectSnapshot(uid: string): Promise<Unsubscribe> {
    const { firestore, firestoreModule } = await this.getInitializedFirestoreClients();

    return firestoreModule.onSnapshot(
      firestoreModule.doc(firestore, 'users', uid, 'rightRailSnapshots', 'default'),
      (snapshot) => {
        this.rightRailStore.setReady(resolveRightRailSnapshot(snapshot.data()));
        this.resolveCurrentReadyPromise();
      },
      () => {
        this.rightRailStore.setError();
        this.resolveCurrentReadyPromise();
      },
    );
  }

  private async initializeFirestore(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeFirestoreInternal();
    return this.initializationPromise;
  }

  private async initializeFirestoreInternal(): Promise<void> {
    const [appModule, firestoreModule] = await FirebaseRightRailProjectionService.FIREBASE_MODULES;

    this.firestoreModule = firestoreModule;
    this.firebaseApp = this.resolveFirebaseApp(appModule);
    this.firestore = firestoreModule.getFirestore(this.firebaseApp);
    this.connectFirestoreEmulatorIfNeeded(firestoreModule, this.firestore);
  }

  private resolveFirebaseApp(
    appModule: Awaited<typeof FirebaseRightRailProjectionService.FIREBASE_MODULES>[0],
  ): FirebaseApp {
    if (appModule.getApps().length > 0) {
      return appModule.getApp();
    }

    return appModule.initializeApp(this.runtimeConfig.firebase);
  }

  private connectFirestoreEmulatorIfNeeded(
    firestoreModule: Awaited<typeof FirebaseRightRailProjectionService.FIREBASE_MODULES>[1],
    firestore: Firestore,
  ): void {
    if (!this.runtimeConfig.useEmulators || this.firestoreEmulatorConnected) {
      return;
    }

    firestoreModule.connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    this.firestoreEmulatorConnected = true;
  }

  private async getInitializedFirestoreClients(): Promise<{
    firestore: Firestore;
    firestoreModule: Awaited<typeof FirebaseRightRailProjectionService.FIREBASE_MODULES>[1];
  }> {
    await this.initializeFirestore();

    if (!this.firestore || !this.firestoreModule) {
      throw new Error('Firestore right rail clients were not initialized.');
    }

    return {
      firestore: this.firestore,
      firestoreModule: this.firestoreModule,
    };
  }

  private resetReadyPromise(): void {
    this.readyPromise = new Promise<void>((resolve) => {
      this.resolveReadyPromise = resolve;
    });
  }

  private resolveCurrentReadyPromise(): void {
    this.resolveReadyPromise?.();
    this.resolveReadyPromise = null;
  }
}
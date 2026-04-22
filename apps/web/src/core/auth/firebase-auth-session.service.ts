import { DestroyRef, Injectable, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore, Unsubscribe } from 'firebase/firestore';

import { CASA_RUNTIME_CONFIG } from '../config/casa-runtime-config.token';
import {
  connectAuthEmulatorOnce,
  connectFirestoreEmulatorOnce,
  connectLiteFirestoreEmulatorOnce,
  resolveFirestoreInstance,
  resolveLiteFirestoreInstance,
  shouldUseFirestoreOneShotReads,
} from '../config/firebase-emulator-connect';
import { AuthSessionStore } from '../state/auth-session.store';
import { resolveCasaRoles } from './auth-claims.util';
import {
  resolveOnboardingProgressFromUserProfile,
  type UserProfileSnapshotModel,
} from './models/user-profile-snapshot.model';

/** Initialize browser Firebase Auth and hydrate the global auth session store. */
@Injectable({ providedIn: 'root' })
export class FirebaseAuthSessionService {
  private static readonly FIREBASE_MODULES = Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);

  private readonly runtimeConfig = inject(CASA_RUNTIME_CONFIG);
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly destroyRef = inject(DestroyRef);

  private firebaseApp: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;
  private authModule: Awaited<typeof FirebaseAuthSessionService.FIREBASE_MODULES>[1] | null = null;
  private firestoreModule: Awaited<typeof FirebaseAuthSessionService.FIREBASE_MODULES>[2] | null = null;

  private emulatorConnected = false;
  private firestoreEmulatorConnected = false;
  private initializationPromise: Promise<void> | null = null;
  private userProfileUnsubscribe: Unsubscribe | null = null;

  public initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeInternal();
    return this.initializationPromise;
  }

  public async signInWithEmailPassword(email: string, password: string): Promise<void> {
    const { auth, authModule } = await this.getInitializedFirebaseClients();

    await authModule.signInWithEmailAndPassword(auth, email, password);
  }

  public async registerWithEmailPassword(email: string, password: string): Promise<void> {
    const { auth, authModule } = await this.getInitializedFirebaseClients();

    await authModule.createUserWithEmailAndPassword(auth, email, password);
  }

  public async signOut(): Promise<void> {
    const { auth, authModule } = await this.getInitializedFirebaseClients();

    await authModule.signOut(auth);
  }

  private async initializeInternal(): Promise<void> {
    const [appModule, authModule, firestoreModule] = await FirebaseAuthSessionService.FIREBASE_MODULES;

    this.authModule = authModule;
    this.firestoreModule = firestoreModule;
    this.firebaseApp = this.resolveFirebaseApp(appModule);
    this.auth = authModule.getAuth(this.firebaseApp);
    this.firestore = resolveFirestoreInstance(
      firestoreModule,
      this.firebaseApp,
      this.runtimeConfig.useEmulators,
    );

    this.connectAuthEmulatorIfNeeded(authModule, this.auth);
    this.connectFirestoreEmulatorIfNeeded(firestoreModule, this.firestore);

    const unsubscribe = authModule.onAuthStateChanged(
      this.auth,
      (user) => {
        void this.syncSession(user);
      },
      () => {
        this.authSessionStore.setAnonymousSession();
      },
    );

    this.destroyRef.onDestroy(unsubscribe);
    this.destroyRef.onDestroy(() => {
      this.userProfileUnsubscribe?.();
      this.userProfileUnsubscribe = null;
    });
  }

  private connectAuthEmulatorIfNeeded(
    authModule: Awaited<typeof FirebaseAuthSessionService.FIREBASE_MODULES>[1],
    auth: Auth,
  ): void {
    if (!this.runtimeConfig.useEmulators || this.emulatorConnected) {
      return;
    }

    connectAuthEmulatorOnce(authModule, auth);
    this.emulatorConnected = true;
  }

  private connectFirestoreEmulatorIfNeeded(
    firestoreModule: Awaited<typeof FirebaseAuthSessionService.FIREBASE_MODULES>[2],
    firestore: Firestore,
  ): void {
    if (!this.runtimeConfig.useEmulators || this.firestoreEmulatorConnected) {
      return;
    }

    connectFirestoreEmulatorOnce(firestoreModule, firestore);
    this.firestoreEmulatorConnected = true;
  }

  private resolveFirebaseApp(
    appModule: Awaited<typeof FirebaseAuthSessionService.FIREBASE_MODULES>[0],
  ): FirebaseApp {
    if (appModule.getApps().length > 0) {
      return appModule.getApp();
    }

    return appModule.initializeApp(this.runtimeConfig.firebase);
  }

  private async syncSession(user: User | null): Promise<void> {
    if (!user) {
      this.stopUserProfileSync();
      this.authSessionStore.setAnonymousSession();
      return;
    }

    try {
      const { authModule } = await this.getInitializedFirebaseClients();
      const tokenResult = await authModule.getIdTokenResult(user);
      const roles = resolveCasaRoles(tokenResult.claims);

      this.authSessionStore.setAuthenticatedSession({
        email: user.email,
        nextOnboardingStep: null,
        onboardingStatus: 'loading',
        roles,
        uid: user.uid,
      });

      this.startUserProfileSync(user.uid);
    } catch {
      this.stopUserProfileSync();
      this.authSessionStore.setAnonymousSession();
    }
  }

  private startUserProfileSync(uid: string): void {
    const useOneShotReads = shouldUseFirestoreOneShotReads(this.runtimeConfig.useEmulators);

    this.stopUserProfileSync();

    if (useOneShotReads) {
      void this.readUserProfileOnce(uid);
      return;
    }

    const { firestore, firestoreModule } = this.getReadyFirestoreClients();
    const userDocumentReference = firestoreModule.doc(firestore, 'users', uid);

    void firestoreModule
      .getDoc(userDocumentReference)
      .then((snapshot) => {
        const userProfile = snapshot.data() as UserProfileSnapshotModel | undefined;

        this.authSessionStore.updateAuthenticatedOnboardingProgress(
          resolveOnboardingProgressFromUserProfile(userProfile),
        );
      })
      .catch(() => {
        this.authSessionStore.updateAuthenticatedOnboardingProgress(
          resolveOnboardingProgressFromUserProfile(undefined),
        );
      });

    this.userProfileUnsubscribe = firestoreModule.onSnapshot(
      userDocumentReference,
      (snapshot) => {
        const userProfile = snapshot.data() as UserProfileSnapshotModel | undefined;

        this.authSessionStore.updateAuthenticatedOnboardingProgress(
          resolveOnboardingProgressFromUserProfile(userProfile),
        );
      },
      () => {
        this.authSessionStore.updateAuthenticatedOnboardingProgress(
          resolveOnboardingProgressFromUserProfile(undefined),
        );
      },
    );
  }

  private async readUserProfileOnce(uid: string): Promise<void> {
    const firebaseApp = this.getReadyFirebaseApp();
    const firestoreLiteModule = await import('firebase/firestore/lite');
    const firestore = resolveLiteFirestoreInstance(
      firestoreLiteModule,
      firebaseApp,
    );

    if (this.runtimeConfig.useEmulators) {
      connectLiteFirestoreEmulatorOnce(firestoreLiteModule, firestore);
    }

    try {
      const snapshot = await firestoreLiteModule.getDoc(
        firestoreLiteModule.doc(firestore, 'users', uid),
      );
      const userProfile = snapshot.data() as UserProfileSnapshotModel | undefined;

      this.authSessionStore.updateAuthenticatedOnboardingProgress(
        resolveOnboardingProgressFromUserProfile(userProfile),
      );
    } catch {
      this.authSessionStore.updateAuthenticatedOnboardingProgress(
        resolveOnboardingProgressFromUserProfile(undefined),
      );
    }
  }

  private stopUserProfileSync(): void {
    this.userProfileUnsubscribe?.();
    this.userProfileUnsubscribe = null;
  }

  private async getInitializedFirebaseClients(): Promise<{
    auth: Auth;
    authModule: Awaited<typeof FirebaseAuthSessionService.FIREBASE_MODULES>[1];
  }> {
    await this.initialize();

    if (!this.auth || !this.authModule) {
      throw new Error('Firebase Auth was not initialized.');
    }

    return {
      auth: this.auth,
      authModule: this.authModule,
    };
  }

  private getReadyFirestoreClients(): {
    firestore: Firestore;
    firestoreModule: Awaited<typeof FirebaseAuthSessionService.FIREBASE_MODULES>[2];
  } {
    if (!this.firestore || !this.firestoreModule) {
      throw new Error('Firestore was not initialized.');
    }

    return {
      firestore: this.firestore,
      firestoreModule: this.firestoreModule,
    };
  }

  private getReadyFirebaseApp(): FirebaseApp {
    if (!this.firebaseApp) {
      throw new Error('Firebase app was not initialized.');
    }

    return this.firebaseApp;
  }
}

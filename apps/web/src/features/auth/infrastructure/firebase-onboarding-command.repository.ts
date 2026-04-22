import { Injectable, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Functions } from 'firebase/functions';

import { CASA_RUNTIME_CONFIG } from '../../../core/config/casa-runtime-config.token';
import type { OnboardingStepId } from '../../../core/auth/models/onboarding-step.model';
import type { FinalizeOnboardingResponseModel } from '../models/finalize-onboarding-response.model';

const ONBOARDING_STEP_FIELD_MAP: Readonly<Record<OnboardingStepId, string>> = {
  goal: 'goalCode',
  level: 'levelCode',
  habit: 'habitCode',
  path: 'pathMode',
};

@Injectable({ providedIn: 'root' })
export class FirebaseOnboardingCommandRepository {
  private static readonly FIREBASE_MODULES = Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
    import('firebase/functions'),
  ]);

  private readonly runtimeConfig = inject(CASA_RUNTIME_CONFIG);

  private firebaseApp: FirebaseApp | null = null;
  private firestore: Firestore | null = null;
  private functions: Functions | null = null;
  private firestoreModule: Awaited<typeof FirebaseOnboardingCommandRepository.FIREBASE_MODULES>[1] | null =
    null;
  private functionsModule: Awaited<typeof FirebaseOnboardingCommandRepository.FIREBASE_MODULES>[2] | null =
    null;
  private firestoreEmulatorConnected = false;
  private functionsEmulatorConnected = false;
  private initializationPromise: Promise<void> | null = null;

  public async saveOnboardingSelection(
    uid: string,
    email: string,
    step: OnboardingStepId,
    code: string,
  ): Promise<void> {
    const { firestore, firestoreModule } = await this.getInitializedFirebaseClients();

    await firestoreModule.setDoc(
      firestoreModule.doc(firestore, 'users', uid),
      {
        email,
        uid,
        [ONBOARDING_STEP_FIELD_MAP[step]]: code,
      },
      { merge: true },
    );
  }

  public async finalizeOnboarding(): Promise<FinalizeOnboardingResponseModel> {
    const { functions, functionsModule } = await this.getInitializedFirebaseClients();
    const finalizeOnboardingCallable = functionsModule.httpsCallable<
      Record<string, never>,
      FinalizeOnboardingResponseModel
    >(functions, 'finalizeOnboarding');
    const response = await finalizeOnboardingCallable({});

    return response.data;
  }

  private async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeInternal();
    return this.initializationPromise;
  }

  private async initializeInternal(): Promise<void> {
    const [appModule, firestoreModule, functionsModule] =
      await FirebaseOnboardingCommandRepository.FIREBASE_MODULES;

    this.firestoreModule = firestoreModule;
    this.functionsModule = functionsModule;
    this.firebaseApp = this.resolveFirebaseApp(appModule);
    this.firestore = firestoreModule.getFirestore(this.firebaseApp);
    this.functions = functionsModule.getFunctions(this.firebaseApp);
    this.connectFirestoreEmulatorIfNeeded(firestoreModule, this.firestore);
    this.connectFunctionsEmulatorIfNeeded(functionsModule, this.functions);
  }

  private resolveFirebaseApp(
    appModule: Awaited<typeof FirebaseOnboardingCommandRepository.FIREBASE_MODULES>[0],
  ): FirebaseApp {
    if (appModule.getApps().length > 0) {
      return appModule.getApp();
    }

    return appModule.initializeApp(this.runtimeConfig.firebase);
  }

  private connectFirestoreEmulatorIfNeeded(
    firestoreModule: Awaited<typeof FirebaseOnboardingCommandRepository.FIREBASE_MODULES>[1],
    firestore: Firestore,
  ): void {
    if (!this.runtimeConfig.useEmulators || this.firestoreEmulatorConnected) {
      return;
    }

    firestoreModule.connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    this.firestoreEmulatorConnected = true;
  }

  private connectFunctionsEmulatorIfNeeded(
    functionsModule: Awaited<typeof FirebaseOnboardingCommandRepository.FIREBASE_MODULES>[2],
    functions: Functions,
  ): void {
    if (!this.runtimeConfig.useEmulators || this.functionsEmulatorConnected) {
      return;
    }

    functionsModule.connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    this.functionsEmulatorConnected = true;
  }

  private async getInitializedFirebaseClients(): Promise<{
    firestore: Firestore;
    firestoreModule: Awaited<typeof FirebaseOnboardingCommandRepository.FIREBASE_MODULES>[1];
    functions: Functions;
    functionsModule: Awaited<typeof FirebaseOnboardingCommandRepository.FIREBASE_MODULES>[2];
  }> {
    await this.initialize();

    if (!this.firestore || !this.firestoreModule || !this.functions || !this.functionsModule) {
      throw new Error('Firebase onboarding command clients were not initialized.');
    }

    return {
      firestore: this.firestore,
      firestoreModule: this.firestoreModule,
      functions: this.functions,
      functionsModule: this.functionsModule,
    };
  }
}
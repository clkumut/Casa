import { Injectable, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import type { Functions } from 'firebase/functions';

import { CASA_RUNTIME_CONFIG } from '../../../core/config/casa-runtime-config.token';
import type { CompleteLessonRequestModel } from '../models/complete-lesson-request.model';
import type { CompleteLessonResponseModel } from '../models/complete-lesson-response.model';
import type { StartLessonChallengeRequestModel } from '../models/start-lesson-challenge-request.model';
import type { StartLessonChallengeResponseModel } from '../models/start-lesson-challenge-response.model';

@Injectable({ providedIn: 'root' })
export class FirebaseLearningCommandRepository {
  private static readonly FIREBASE_MODULES = Promise.all([
    import('firebase/app'),
    import('firebase/functions'),
  ]);

  private readonly runtimeConfig = inject(CASA_RUNTIME_CONFIG);

  private firebaseApp: FirebaseApp | null = null;
  private functions: Functions | null = null;
  private functionsEmulatorConnected = false;
  private functionsModule: Awaited<typeof FirebaseLearningCommandRepository.FIREBASE_MODULES>[1] | null =
    null;
  private initializationPromise: Promise<void> | null = null;

  public async completeLesson(
    request: CompleteLessonRequestModel,
  ): Promise<CompleteLessonResponseModel> {
    const { functions, functionsModule } = await this.getInitializedFirebaseClients();
    const completeLessonCallable = functionsModule.httpsCallable<
      CompleteLessonRequestModel,
      CompleteLessonResponseModel
    >(functions, 'completeLesson');
    const response = await completeLessonCallable(request);

    return response.data;
  }

  public async startLessonChallenge(
    request: StartLessonChallengeRequestModel,
  ): Promise<StartLessonChallengeResponseModel> {
    const { functions, functionsModule } = await this.getInitializedFirebaseClients();
    const startLessonChallengeCallable = functionsModule.httpsCallable<
      StartLessonChallengeRequestModel,
      StartLessonChallengeResponseModel
    >(functions, 'startLessonChallenge');
    const response = await startLessonChallengeCallable(request);

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
    const [appModule, functionsModule] = await FirebaseLearningCommandRepository.FIREBASE_MODULES;

    this.functionsModule = functionsModule;
    this.firebaseApp = this.resolveFirebaseApp(appModule);
    this.functions = functionsModule.getFunctions(this.firebaseApp);
    this.connectFunctionsEmulatorIfNeeded(functionsModule, this.functions);
  }

  private resolveFirebaseApp(
    appModule: Awaited<typeof FirebaseLearningCommandRepository.FIREBASE_MODULES>[0],
  ): FirebaseApp {
    if (appModule.getApps().length > 0) {
      return appModule.getApp();
    }

    return appModule.initializeApp(this.runtimeConfig.firebase);
  }

  private connectFunctionsEmulatorIfNeeded(
    functionsModule: Awaited<typeof FirebaseLearningCommandRepository.FIREBASE_MODULES>[1],
    functions: Functions,
  ): void {
    if (!this.runtimeConfig.useEmulators || this.functionsEmulatorConnected) {
      return;
    }

    functionsModule.connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    this.functionsEmulatorConnected = true;
  }

  private async getInitializedFirebaseClients(): Promise<{
    functions: Functions;
    functionsModule: Awaited<typeof FirebaseLearningCommandRepository.FIREBASE_MODULES>[1];
  }> {
    await this.initialize();

    if (!this.functions || !this.functionsModule) {
      throw new Error('Firebase learning command clients were not initialized.');
    }

    return {
      functions: this.functions,
      functionsModule: this.functionsModule,
    };
  }
}
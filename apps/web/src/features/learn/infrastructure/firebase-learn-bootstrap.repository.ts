import { Injectable, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore, Unsubscribe } from 'firebase/firestore';

import { CASA_RUNTIME_CONFIG } from '../../../core/config/casa-runtime-config.token';
import {
  EMPTY_LEARNING_CATALOG_SELECTION,
  resolveLearningCatalogNode,
  type LearningCatalogNodeKind,
  type LearningCatalogSelectionModel,
} from '../models/learning-catalog.model';
import type { LearnBootstrapReadModel } from '../models/learn-bootstrap-read.model';
import { resolveLearningProgression, type LearningProgressionModel } from '../models/learning-progression.model';

@Injectable({ providedIn: 'root' })
export class FirebaseLearnBootstrapRepository {
  private static readonly FIREBASE_MODULES = Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);

  private readonly runtimeConfig = inject(CASA_RUNTIME_CONFIG);

  private firebaseApp: FirebaseApp | null = null;
  private firestore: Firestore | null = null;
  private firestoreModule: Awaited<typeof FirebaseLearnBootstrapRepository.FIREBASE_MODULES>[1] | null =
    null;
  private firestoreEmulatorConnected = false;
  private initializationPromise: Promise<void> | null = null;

  public async watchLearnBootstrap(
    uid: string,
    onValue: (payload: LearnBootstrapReadModel) => void,
    onError: () => void,
  ): Promise<Unsubscribe> {
    const { firestore, firestoreModule } = await this.getInitializedFirestoreClients();
    let requestVersion = 0;

    return firestoreModule.onSnapshot(
      firestoreModule.collection(firestore, 'users', uid, 'progressionSnapshots'),
      async (snapshot) => {
        const currentRequestVersion = ++requestVersion;
        const progression = resolveLearningProgression(
          snapshot.docs.map((documentSnapshot) => ({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          })),
        );

        try {
          const catalog = await this.loadCatalogSelection(firestore, firestoreModule, progression);

          if (currentRequestVersion !== requestVersion) {
            return;
          }

          onValue({
            catalog,
            progression,
          });
        } catch {
          if (currentRequestVersion !== requestVersion) {
            return;
          }

          onError();
        }
      },
      onError,
    );
  }

  private async loadCatalogSelection(
    firestore: Firestore,
    firestoreModule: Awaited<typeof FirebaseLearnBootstrapRepository.FIREBASE_MODULES>[1],
    progression: LearningProgressionModel | null,
  ): Promise<LearningCatalogSelectionModel> {
    if (!progression) {
      return EMPTY_LEARNING_CATALOG_SELECTION;
    }

    const [world, chapter, unit] = await Promise.all([
      this.readCatalogDocument(
        firestore,
        firestoreModule,
        'catalog_learning_worlds',
        progression.currentWorldId,
        'world',
      ),
      this.readCatalogDocument(
        firestore,
        firestoreModule,
        'catalog_learning_chapters',
        progression.currentChapterId,
        'chapter',
      ),
      this.readCatalogDocument(
        firestore,
        firestoreModule,
        'catalog_learning_units',
        progression.currentUnitId,
        'unit',
      ),
    ]);

    return {
      chapter,
      unit,
      world,
    };
  }

  private async readCatalogDocument(
    firestore: Firestore,
    firestoreModule: Awaited<typeof FirebaseLearnBootstrapRepository.FIREBASE_MODULES>[1],
    collectionName: 'catalog_learning_worlds' | 'catalog_learning_chapters' | 'catalog_learning_units',
    documentId: string | null,
    kind: LearningCatalogNodeKind,
  ) {
    if (!documentId) {
      return null;
    }

    const documentSnapshot = await firestoreModule.getDoc(
      firestoreModule.doc(firestore, collectionName, documentId),
    );

    return resolveLearningCatalogNode(
      kind,
      documentId,
      documentSnapshot.exists() ? documentSnapshot.data() : null,
    );
  }

  private async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeInternal();
    return this.initializationPromise;
  }

  private async initializeInternal(): Promise<void> {
    const [appModule, firestoreModule] = await FirebaseLearnBootstrapRepository.FIREBASE_MODULES;

    this.firestoreModule = firestoreModule;
    this.firebaseApp = this.resolveFirebaseApp(appModule);
    this.firestore = firestoreModule.getFirestore(this.firebaseApp);
    this.connectFirestoreEmulatorIfNeeded(firestoreModule, this.firestore);
  }

  private resolveFirebaseApp(
    appModule: Awaited<typeof FirebaseLearnBootstrapRepository.FIREBASE_MODULES>[0],
  ): FirebaseApp {
    if (appModule.getApps().length > 0) {
      return appModule.getApp();
    }

    return appModule.initializeApp(this.runtimeConfig.firebase);
  }

  private connectFirestoreEmulatorIfNeeded(
    firestoreModule: Awaited<typeof FirebaseLearnBootstrapRepository.FIREBASE_MODULES>[1],
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
    firestoreModule: Awaited<typeof FirebaseLearnBootstrapRepository.FIREBASE_MODULES>[1];
  }> {
    await this.initialize();

    if (!this.firestore || !this.firestoreModule) {
      throw new Error('Firestore learn bootstrap clients were not initialized.');
    }

    return {
      firestore: this.firestore,
      firestoreModule: this.firestoreModule,
    };
  }
}
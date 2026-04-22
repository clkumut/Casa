import { Injectable, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore, Unsubscribe } from 'firebase/firestore';
import type { Firestore as FirestoreLite } from 'firebase/firestore/lite';

import { CASA_RUNTIME_CONFIG } from '../../../core/config/casa-runtime-config.token';
import {
  connectFirestoreEmulatorOnce,
  connectLiteFirestoreEmulatorOnce,
  resolveFirestoreInstance,
  resolveLiteFirestoreInstance,
  shouldUseFirestoreOneShotReads,
} from '../../../core/config/firebase-emulator-connect';
import {
  EMPTY_LEARNING_CATALOG_MAP,
  EMPTY_LEARNING_CATALOG_SELECTION,
  isPublishedLearningCatalogNode,
  resolveLearningCatalogNode,
  sortLearningCatalogNodes,
  type LearningCatalogNodeKind,
  type LearningCatalogNodeModel,
  type LearningCatalogSelectionModel,
} from '../models/learning-catalog.model';
import type { LearnBootstrapReadModel } from '../models/learn-bootstrap-read.model';
import { resolveLearningProgression, type LearningProgressionModel } from '../models/learning-progression.model';

type LearningCatalogCollectionName =
  | 'catalog_learning_worlds'
  | 'catalog_learning_chapters'
  | 'catalog_learning_units'
  | 'catalog_learning_lessons';

type FirestoreReadModule = Pick<
  typeof import('firebase/firestore/lite'),
  'collection' | 'doc' | 'getDoc' | 'getDocs' | 'query' | 'where'
>;

@Injectable({ providedIn: 'root' })
export class FirebaseLearnBootstrapRepository {
  private static readonly IN_QUERY_BATCH_LIMIT = 30;
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
    const progressionCollection = firestoreModule.collection(
      firestore,
      'users',
      uid,
      'progressionSnapshots',
    );

    if (shouldUseFirestoreOneShotReads(this.runtimeConfig.useEmulators)) {
      try {
        const firebaseApp = this.getReadyFirebaseApp();
        const firestoreLiteModule = await import('firebase/firestore/lite');
        const liteFirestore = resolveLiteFirestoreInstance(
          firestoreLiteModule,
          firebaseApp,
        );

        if (this.runtimeConfig.useEmulators) {
          connectLiteFirestoreEmulatorOnce(firestoreLiteModule, liteFirestore);
        }

        const snapshot = await firestoreLiteModule.getDocs(
          firestoreLiteModule.collection(liteFirestore, 'users', uid, 'progressionSnapshots'),
        );
        const progression = resolveLearningProgression(
          snapshot.docs.map((documentSnapshot) => ({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          })),
        );
        const { catalog, catalogMap } = await this.loadCatalogData(
          liteFirestore,
          firestoreLiteModule,
          progression,
        );

        onValue({
          catalog,
          catalogMap,
          progression,
        });
      } catch {
        onError();
      }

      return () => undefined;
    }

    return firestoreModule.onSnapshot(
      progressionCollection,
      async (snapshot) => {
        const currentRequestVersion = ++requestVersion;
        const progression = resolveLearningProgression(
          snapshot.docs.map((documentSnapshot) => ({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          })),
        );

        try {
          const { catalog, catalogMap } = await this.loadCatalogData(
            firestore,
            firestoreModule,
            progression,
          );

          if (currentRequestVersion !== requestVersion) {
            return;
          }

          onValue({
            catalog,
            catalogMap,
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

  private async loadCatalogData(
    firestore: FirestoreLite,
    firestoreModule: FirestoreReadModule,
    progression: LearningProgressionModel | null,
  ): Promise<Pick<LearnBootstrapReadModel, 'catalog' | 'catalogMap'>> {
    const [worlds, chapters, units, world, chapter, unit, lesson] = await Promise.all([
      this.readPublishedCatalogCollection(firestore, firestoreModule, 'catalog_learning_worlds', 'world'),
      progression?.currentWorldId
        ? this.readPublishedCatalogCollection(
            firestore,
            firestoreModule,
            'catalog_learning_chapters',
            'chapter',
            progression.currentWorldId,
          )
        : Promise.resolve(EMPTY_LEARNING_CATALOG_MAP.chapters),
      progression?.currentChapterId
        ? this.readPublishedCatalogCollection(
            firestore,
            firestoreModule,
            'catalog_learning_units',
            'unit',
            progression.currentChapterId,
          )
        : Promise.resolve(EMPTY_LEARNING_CATALOG_MAP.units),
      this.readCatalogDocument(
        firestore,
        firestoreModule,
        'catalog_learning_worlds',
        progression?.currentWorldId ?? null,
        'world',
      ),
      this.readCatalogDocument(
        firestore,
        firestoreModule,
        'catalog_learning_chapters',
        progression?.currentChapterId ?? null,
        'chapter',
      ),
      this.readCatalogDocument(
        firestore,
        firestoreModule,
        'catalog_learning_units',
        progression?.currentUnitId ?? null,
        'unit',
      ),
      this.readCatalogDocument(
        firestore,
        firestoreModule,
        'catalog_learning_lessons',
        progression?.currentLessonId ?? null,
        'lesson',
      ),
    ]);
    const lessons = units.length > 0
      ? await this.readPublishedCatalogCollectionByParentIds(
          firestore,
          firestoreModule,
          'catalog_learning_lessons',
          'lesson',
          units.map((currentUnit) => currentUnit.id),
          ['unitId', 'unitRef'],
        )
      : EMPTY_LEARNING_CATALOG_MAP.lessons;

    return {
      catalog: {
        chapter: this.resolveSelectedCatalogNode(chapters, chapter),
        lesson: this.resolveSelectedCatalogNode(lessons, lesson),
        unit: this.resolveSelectedCatalogNode(units, unit),
        world: this.resolveSelectedCatalogNode(worlds, world),
      },
      catalogMap: {
        chapters,
        lessons,
        units,
        worlds,
      },
    };
  }

  private async readPublishedCatalogCollection(
    firestore: FirestoreLite,
    firestoreModule: FirestoreReadModule,
    collectionName: LearningCatalogCollectionName,
    kind: LearningCatalogNodeKind,
    parentId?: string,
  ): Promise<ReadonlyArray<LearningCatalogNodeModel>> {
    const collectionSnapshot = await firestoreModule.getDocs(
      firestoreModule.collection(firestore, collectionName),
    );

    return sortLearningCatalogNodes(
      collectionSnapshot.docs
        .map((documentSnapshot) =>
          resolveLearningCatalogNode(kind, documentSnapshot.id, documentSnapshot.data()),
        )
        .filter((node) => isPublishedLearningCatalogNode(node))
        .filter((node) => (parentId ? node.parentId === parentId : true)),
    );
  }

  private async readPublishedCatalogCollectionByParentIds(
    firestore: FirestoreLite,
    firestoreModule: FirestoreReadModule,
    collectionName: LearningCatalogCollectionName,
    kind: LearningCatalogNodeKind,
    parentIds: ReadonlyArray<string>,
    parentFields: ReadonlyArray<string>,
  ): Promise<ReadonlyArray<LearningCatalogNodeModel>> {
    const normalizedParentIds = [...new Set(parentIds.filter((parentId) => parentId.length > 0))];

    if (normalizedParentIds.length === 0 || parentFields.length === 0) {
      return [];
    }

    const parentIdLookup = new Set(normalizedParentIds);

    if (this.runtimeConfig.useEmulators) {
      const collectionSnapshot = await firestoreModule.getDocs(
        firestoreModule.collection(firestore, collectionName),
      );

      return sortLearningCatalogNodes(
        collectionSnapshot.docs
          .map((documentSnapshot) =>
            resolveLearningCatalogNode(kind, documentSnapshot.id, documentSnapshot.data()),
          )
          .filter((node) => isPublishedLearningCatalogNode(node))
          .filter((node) => node.parentId !== null && parentIdLookup.has(node.parentId)),
      );
    }

    const parentIdChunks = this.chunkValues(
      normalizedParentIds,
      FirebaseLearnBootstrapRepository.IN_QUERY_BATCH_LIMIT,
    );
    const snapshots = await Promise.all(
      parentIdChunks.flatMap((parentIdChunk) =>
        parentFields.map((parentField) =>
          firestoreModule.getDocs(
            firestoreModule.query(
              firestoreModule.collection(firestore, collectionName),
              firestoreModule.where(parentField, 'in', parentIdChunk),
            ),
          ),
        ),
      ),
    );
    const nodesById = new Map<string, LearningCatalogNodeModel>();

    for (const snapshot of snapshots) {
      for (const documentSnapshot of snapshot.docs) {
        const node = resolveLearningCatalogNode(kind, documentSnapshot.id, documentSnapshot.data());

        if (!isPublishedLearningCatalogNode(node) || !node.parentId || !parentIdLookup.has(node.parentId)) {
          continue;
        }

        nodesById.set(node.id, node);
      }
    }

    return sortLearningCatalogNodes([...nodesById.values()]);
  }

  private async readCatalogDocument(
    firestore: FirestoreLite,
    firestoreModule: FirestoreReadModule,
    collectionName: LearningCatalogCollectionName,
    documentId: string | null,
    kind: LearningCatalogNodeKind,
  ): Promise<LearningCatalogNodeModel | null> {
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

  private resolveSelectedCatalogNode(
    nodes: ReadonlyArray<LearningCatalogNodeModel>,
    fallbackNode: LearningCatalogNodeModel | null,
  ): LearningCatalogNodeModel | null {
    if (!fallbackNode) {
      return null;
    }

    return nodes.find((node) => node.id === fallbackNode.id) ?? fallbackNode;
  }

  private chunkValues(values: ReadonlyArray<string>, chunkSize: number): ReadonlyArray<ReadonlyArray<string>> {
    const chunks: Array<ReadonlyArray<string>> = [];

    for (let index = 0; index < values.length; index += chunkSize) {
      chunks.push(values.slice(index, index + chunkSize));
    }

    return chunks;
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
    this.firestore = resolveFirestoreInstance(
      firestoreModule,
      this.firebaseApp,
      this.runtimeConfig.useEmulators,
    );
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

    connectFirestoreEmulatorOnce(firestoreModule, firestore);
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

  private getReadyFirebaseApp(): FirebaseApp {
    if (!this.firebaseApp) {
      throw new Error('Firebase app was not initialized.');
    }

    return this.firebaseApp;
  }
}

import { Injectable, inject } from '@angular/core';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore, Unsubscribe } from 'firebase/firestore';

import { CASA_RUNTIME_CONFIG } from '../../../core/config/casa-runtime-config.token';
import {
  connectFirestoreEmulatorOnce,
  resolveFirestoreInstance,
} from '../../../core/config/firebase-emulator-connect';
import {
  EMPTY_ONBOARDING_DRAFT,
  type OnboardingDraftModel,
} from '../models/onboarding-draft.model';
import {
  EMPTY_ONBOARDING_CATALOG,
  type OnboardingCatalogModel,
  type OnboardingOptionModel,
} from '../models/onboarding-option.model';
import type { OnboardingReadPayload } from '../models/onboarding-read.model';
import type { OnboardingStepId } from '../models/onboarding-step-id.model';

type FirestoreRecord = Record<string, unknown>;
type CatalogAccumulator = Record<OnboardingStepId, Array<OnboardingOptionModel>>;

const ONBOARDING_STEP_RECORD_KEYS: Readonly<Record<OnboardingStepId, ReadonlyArray<string>>> = {
  goal: ['goal', 'goals', 'goalOptions'],
  level: ['level', 'levels', 'levelOptions'],
  habit: ['habit', 'habits', 'habitOptions'],
  path: ['path', 'paths', 'pathOptions'],
};

@Injectable({ providedIn: 'root' })
export class FirebaseOnboardingReadRepository {
  private static readonly FIREBASE_MODULES = Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);

  private readonly runtimeConfig = inject(CASA_RUNTIME_CONFIG);

  private firebaseApp: FirebaseApp | null = null;
  private firestore: Firestore | null = null;
  private firestoreModule: Awaited<typeof FirebaseOnboardingReadRepository.FIREBASE_MODULES>[1] | null =
    null;
  private firestoreEmulatorConnected = false;
  private initializationPromise: Promise<void> | null = null;

  public async watchOnboardingReadModel(
    uid: string,
    onValue: (payload: OnboardingReadPayload) => void,
    onError: () => void,
  ): Promise<Unsubscribe> {
    const { firestore, firestoreModule } = await this.getInitializedFirestoreClients();
    let currentDraft: OnboardingDraftModel = EMPTY_ONBOARDING_DRAFT;
    let currentCatalog: OnboardingCatalogModel = EMPTY_ONBOARDING_CATALOG;

    const emitValue = (): void => {
      onValue({
        draft: currentDraft,
        catalog: currentCatalog,
      });
    };

    const unsubscribeUserDraft = firestoreModule.onSnapshot(
      firestoreModule.doc(firestore, 'users', uid),
      (snapshot) => {
        currentDraft = this.parseOnboardingDraft(snapshot.data());
        emitValue();
      },
      onError,
    );

    const unsubscribeCatalog = firestoreModule.onSnapshot(
      firestoreModule.collection(firestore, 'catalog_onboarding_options'),
      (snapshot) => {
        currentCatalog = this.parseOnboardingCatalog(
          snapshot.docs.map((documentSnapshot) => ({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          })),
        );
        emitValue();
      },
      onError,
    );

    return () => {
      unsubscribeUserDraft();
      unsubscribeCatalog();
    };
  }

  private async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeInternal();
    return this.initializationPromise;
  }

  private async initializeInternal(): Promise<void> {
    const [appModule, firestoreModule] = await FirebaseOnboardingReadRepository.FIREBASE_MODULES;

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
    appModule: Awaited<typeof FirebaseOnboardingReadRepository.FIREBASE_MODULES>[0],
  ): FirebaseApp {
    if (appModule.getApps().length > 0) {
      return appModule.getApp();
    }

    return appModule.initializeApp(this.runtimeConfig.firebase);
  }

  private connectFirestoreEmulatorIfNeeded(
    firestoreModule: Awaited<typeof FirebaseOnboardingReadRepository.FIREBASE_MODULES>[1],
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
    firestoreModule: Awaited<typeof FirebaseOnboardingReadRepository.FIREBASE_MODULES>[1];
  }> {
    await this.initialize();

    if (!this.firestore || !this.firestoreModule) {
      throw new Error('Firestore was not initialized.');
    }

    return {
      firestore: this.firestore,
      firestoreModule: this.firestoreModule,
    };
  }

  private parseOnboardingDraft(snapshotData: unknown): OnboardingDraftModel {
    const record = this.asRecord(snapshotData);

    return {
      goalCode: this.readString(record, 'goalCode'),
      levelCode:
        this.readString(record, 'levelCode') ?? this.readString(record, 'startingLevelCode'),
      habitCode: this.readString(record, 'habitCode'),
      pathMode: this.readString(record, 'pathMode'),
    };
  }

  private parseOnboardingCatalog(
    catalogDocuments: ReadonlyArray<Readonly<{ id: string; data: unknown }>>,
  ): OnboardingCatalogModel {
    const catalogAccumulator = this.createCatalogAccumulator();

    for (const catalogDocument of catalogDocuments) {
      const record = this.asRecord(catalogDocument.data);

      if (!record) {
        continue;
      }

      for (const step of Object.keys(ONBOARDING_STEP_RECORD_KEYS) as Array<OnboardingStepId>) {
        const inlineOptions = this.parseInlineOptions(record, step);

        if (inlineOptions.length > 0) {
          this.mergeOptions(catalogAccumulator[step], inlineOptions);
        }
      }

      const inferredStep =
        this.normalizeStepKey(catalogDocument.id) ??
        this.normalizeStepKey(
          this.readString(record, 'step') ??
            this.readString(record, 'group') ??
            this.readString(record, 'kind'),
        );

      if (!inferredStep) {
        continue;
      }

      const groupedItems = this.parseOptionArray(record.items);

      if (groupedItems.length > 0) {
        this.mergeOptions(catalogAccumulator[inferredStep], groupedItems);
        continue;
      }

      const singleOption = this.parseOptionRecord(record, catalogDocument.id);

      if (singleOption) {
        this.mergeOptions(catalogAccumulator[inferredStep], [singleOption]);
      }
    }

    return {
      goal: catalogAccumulator.goal,
      level: catalogAccumulator.level,
      habit: catalogAccumulator.habit,
      path: catalogAccumulator.path,
    };
  }

  private createCatalogAccumulator(): CatalogAccumulator {
    return {
      goal: [...EMPTY_ONBOARDING_CATALOG.goal],
      level: [...EMPTY_ONBOARDING_CATALOG.level],
      habit: [...EMPTY_ONBOARDING_CATALOG.habit],
      path: [...EMPTY_ONBOARDING_CATALOG.path],
    };
  }

  private parseInlineOptions(
    record: FirestoreRecord,
    step: OnboardingStepId,
  ): ReadonlyArray<OnboardingOptionModel> {
    for (const key of ONBOARDING_STEP_RECORD_KEYS[step]) {
      const options = this.parseOptionArray(record[key]);

      if (options.length > 0) {
        return options;
      }
    }

    return [];
  }

  private parseOptionArray(value: unknown): ReadonlyArray<OnboardingOptionModel> {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => this.parseOptionRecord(this.asRecord(item)))
      .filter((item): item is OnboardingOptionModel => item !== null);
  }

  private parseOptionRecord(
    record: FirestoreRecord | null,
    fallbackCode?: string,
  ): OnboardingOptionModel | null {
    if (!record) {
      return null;
    }

    const code =
      this.readString(record, 'code') ??
      this.readString(record, 'id') ??
      this.readString(record, 'value') ??
      fallbackCode ??
      null;

    if (!code) {
      return null;
    }

    return {
      code,
      description:
        this.readString(record, 'description') ??
        this.readString(record, 'copy') ??
        this.readString(record, 'summary'),
      title:
        this.readString(record, 'title') ??
        this.readString(record, 'label') ??
        this.readString(record, 'name') ??
        code,
    };
  }

  private mergeOptions(
    target: Array<OnboardingOptionModel>,
    incoming: ReadonlyArray<OnboardingOptionModel>,
  ): void {
    const knownCodes = new Set(target.map((option) => option.code));

    for (const option of incoming) {
      if (knownCodes.has(option.code)) {
        continue;
      }

      target.push(option);
      knownCodes.add(option.code);
    }
  }

  private normalizeStepKey(rawValue: string | null): OnboardingStepId | null {
    if (!rawValue) {
      return null;
    }

    switch (rawValue.toLowerCase().replace(/[-_\s]/g, '')) {
      case 'goal':
      case 'goals':
      case 'goaloptions':
        return 'goal';
      case 'level':
      case 'levels':
      case 'leveloptions':
        return 'level';
      case 'habit':
      case 'habits':
      case 'habitoptions':
        return 'habit';
      case 'path':
      case 'paths':
      case 'pathmode':
      case 'pathoptions':
        return 'path';
      default:
        return null;
    }
  }

  private asRecord(value: unknown): FirestoreRecord | null {
    return typeof value === 'object' && value !== null ? (value as FirestoreRecord) : null;
  }

  private readString(record: FirestoreRecord | null, key: string): string | null {
    const value = record?.[key];

    return typeof value === 'string' && value.length > 0 ? value : null;
  }
}

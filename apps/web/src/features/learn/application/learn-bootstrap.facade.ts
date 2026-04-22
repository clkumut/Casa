import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { AuthSessionStore } from '../../../core/state/auth-session.store';
import { FirebaseLearnBootstrapRepository } from '../infrastructure/firebase-learn-bootstrap.repository';
import {
  EMPTY_LEARNING_CATALOG_MAP,
  EMPTY_LEARNING_CATALOG_SELECTION,
  type LearningCatalogMapModel,
  type LearningCatalogSelectionModel,
} from '../models/learning-catalog.model';
import type { LearningProgressionModel } from '../models/learning-progression.model';

type LearnBootstrapStatus = 'idle' | 'loading' | 'ready' | 'error';

interface LearnBootstrapStateModel {
  readonly catalog: LearningCatalogSelectionModel;
  readonly catalogMap: LearningCatalogMapModel;
  readonly progression: LearningProgressionModel | null;
  readonly status: LearnBootstrapStatus;
}

const INITIAL_LEARN_BOOTSTRAP_STATE: LearnBootstrapStateModel = {
  catalog: EMPTY_LEARNING_CATALOG_SELECTION,
  catalogMap: EMPTY_LEARNING_CATALOG_MAP,
  progression: null,
  status: 'idle',
};

@Injectable()
export class LearnBootstrapFacade {
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly learnBootstrapRepository = inject(FirebaseLearnBootstrapRepository);
  private readonly learnBootstrapState = signal<LearnBootstrapStateModel>(
    INITIAL_LEARN_BOOTSTRAP_STATE,
  );

  public readonly catalog = computed(() => this.learnBootstrapState().catalog);
  public readonly catalogMap = computed(() => this.learnBootstrapState().catalogMap);
  public readonly progression = computed(() => this.learnBootstrapState().progression);
  public readonly state = this.learnBootstrapState.asReadonly();
  public readonly status = computed(() => this.learnBootstrapState().status);

  public constructor() {
    effect(
      (onCleanup) => {
        const session = this.authSessionStore.session();

        if (session.status !== 'authenticated' || !session.uid) {
          this.learnBootstrapState.set(INITIAL_LEARN_BOOTSTRAP_STATE);
          return;
        }

        this.learnBootstrapState.set({
          catalog: this.learnBootstrapState().catalog,
          catalogMap: this.learnBootstrapState().catalogMap,
          progression: this.learnBootstrapState().progression,
          status: 'loading',
        });

        let isActive = true;
        let unsubscribe: (() => void) | null = null;

        void this.learnBootstrapRepository
          .watchLearnBootstrap(
            session.uid,
            ({ catalog, catalogMap, progression }) => {
              if (!isActive) {
                return;
              }

              this.learnBootstrapState.set({
                catalog,
                catalogMap,
                progression,
                status: 'ready',
              });
            },
            () => {
              if (!isActive) {
                return;
              }

              this.learnBootstrapState.set({
                catalog: EMPTY_LEARNING_CATALOG_SELECTION,
                catalogMap: EMPTY_LEARNING_CATALOG_MAP,
                progression: null,
                status: 'error',
              });
            },
          )
          .then((repositoryUnsubscribe) => {
            if (!isActive) {
              repositoryUnsubscribe();
              return;
            }

            unsubscribe = repositoryUnsubscribe;
          });

        onCleanup(() => {
          isActive = false;
          unsubscribe?.();
        });
      },
      { allowSignalWrites: true },
    );
  }
}
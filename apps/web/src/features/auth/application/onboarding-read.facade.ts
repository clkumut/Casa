import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { AuthSessionStore } from '../../../core/state/auth-session.store';
import { FirebaseOnboardingReadRepository } from '../infrastructure/firebase-onboarding-read.repository';
import {
  INITIAL_ONBOARDING_READ_MODEL,
  type OnboardingReadModel,
  type OnboardingReadPayload,
} from '../models/onboarding-read.model';

@Injectable()
export class OnboardingReadFacade {
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly onboardingReadRepository = inject(FirebaseOnboardingReadRepository);
  private readonly onboardingReadState = signal<OnboardingReadModel>(INITIAL_ONBOARDING_READ_MODEL);

  public readonly state = this.onboardingReadState.asReadonly();
  public readonly status = computed(() => this.onboardingReadState().status);
  public readonly draft = computed(() => this.onboardingReadState().draft);
  public readonly catalog = computed(() => this.onboardingReadState().catalog);

  public constructor() {
    effect(
      (onCleanup) => {
        const session = this.authSessionStore.session();

        if (session.status !== 'authenticated' || !session.uid) {
          this.onboardingReadState.set(INITIAL_ONBOARDING_READ_MODEL);
          return;
        }

        this.onboardingReadState.set({
          ...INITIAL_ONBOARDING_READ_MODEL,
          status: 'loading',
        });

        let isActive = true;
        let unsubscribe: (() => void) | null = null;

        void this.onboardingReadRepository
          .watchOnboardingReadModel(
            session.uid,
            (payload: OnboardingReadPayload) => {
              if (!isActive) {
                return;
              }

              this.onboardingReadState.set({
                status: 'ready',
                ...payload,
              });
            },
            () => {
              if (!isActive) {
                return;
              }

              this.onboardingReadState.set({
                ...INITIAL_ONBOARDING_READ_MODEL,
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
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import type { OnboardingStepId } from '../../../core/auth/models/onboarding-step.model';
import { resolveNextOnboardingStep } from '../../../core/auth/models/user-profile-snapshot.model';
import { AuthSessionStore } from '../../../core/state/auth-session.store';
import { FirebaseOnboardingCommandRepository } from '../infrastructure/firebase-onboarding-command.repository';
import { FirebaseOnboardingReadRepository } from '../infrastructure/firebase-onboarding-read.repository';
import type { FinalizeOnboardingResponseModel } from '../models/finalize-onboarding-response.model';
import type { OnboardingDraftModel } from '../models/onboarding-draft.model';
import {
  INITIAL_ONBOARDING_READ_MODEL,
  type OnboardingReadModel,
  type OnboardingReadPayload,
} from '../models/onboarding-read.model';

@Injectable()
export class OnboardingReadFacade {
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly onboardingCommandRepository = inject(FirebaseOnboardingCommandRepository);
  private readonly activeSaveStepState = signal<OnboardingStepId | null>(null);
  private readonly commandErrorState = signal<string | null>(null);
  private readonly isFinalizingState = signal(false);
  private readonly onboardingReadRepository = inject(FirebaseOnboardingReadRepository);
  private readonly onboardingReadState = signal<OnboardingReadModel>(INITIAL_ONBOARDING_READ_MODEL);

  public readonly activeSaveStep = this.activeSaveStepState.asReadonly();
  public readonly commandError = this.commandErrorState.asReadonly();
  public readonly isFinalizing = this.isFinalizingState.asReadonly();
  public readonly state = this.onboardingReadState.asReadonly();
  public readonly status = computed(() => this.onboardingReadState().status);
  public readonly draft = computed(() => this.onboardingReadState().draft);
  public readonly catalog = computed(() => this.onboardingReadState().catalog);
  public readonly canFinalize = computed(() => {
    const session = this.authSessionStore.session();

    return session.status === 'authenticated'
      && session.onboardingStatus !== 'complete'
      && this.status() === 'ready'
      && resolveNextOnboardingStep(this.draft()) === null;
  });

  public constructor() {
    effect(
      (onCleanup) => {
        const session = this.authSessionStore.session();

        if (session.status !== 'authenticated' || !session.uid) {
          this.activeSaveStepState.set(null);
          this.commandErrorState.set(null);
          this.isFinalizingState.set(false);
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

  public async saveSelection(step: OnboardingStepId, code: string): Promise<void> {
    const session = this.authSessionStore.session();

    if (session.status !== 'authenticated' || !session.uid || !session.email) {
      this.commandErrorState.set('Onboarding secimi icin email tabanli authenticated session gerekli.');
      throw new Error('Authenticated email session is required to save onboarding state.');
    }

    this.activeSaveStepState.set(step);
    this.commandErrorState.set(null);

    try {
      await this.onboardingCommandRepository.saveOnboardingSelection(
        session.uid,
        session.email,
        step,
        code,
      );

      const nextDraft = this.patchDraftSelection(this.onboardingReadState().draft, step, code);

      this.onboardingReadState.update((currentState) => ({
        ...currentState,
        draft: nextDraft,
        status: 'ready',
      }));
      this.authSessionStore.updateAuthenticatedOnboardingProgress({
        nextOnboardingStep: resolveNextOnboardingStep(nextDraft),
        onboardingStatus: 'required',
      });
    } catch {
      this.commandErrorState.set('Onboarding secimi kaydedilemedi.');
      throw new Error('Onboarding selection save failed.');
    } finally {
      this.activeSaveStepState.set(null);
    }
  }

  public async finalizeOnboarding(): Promise<FinalizeOnboardingResponseModel> {
    const session = this.authSessionStore.session();

    if (session.status !== 'authenticated') {
      this.commandErrorState.set('Onboarding tamamlama icin authenticated session gerekli.');
      throw new Error('Authenticated session is required to finalize onboarding.');
    }

    this.commandErrorState.set(null);
    this.isFinalizingState.set(true);

    try {
      const response = await this.onboardingCommandRepository.finalizeOnboarding();

      this.authSessionStore.updateAuthenticatedOnboardingProgress({
        nextOnboardingStep: null,
        onboardingStatus: 'complete',
      });

      return response;
    } catch {
      this.commandErrorState.set('Onboarding tamamlanamadi.');
      throw new Error('Onboarding finalization failed.');
    } finally {
      this.isFinalizingState.set(false);
    }
  }

  private patchDraftSelection(
    onboardingDraft: OnboardingDraftModel,
    step: OnboardingStepId,
    code: string,
  ): OnboardingDraftModel {
    switch (step) {
      case 'goal':
        return {
          ...onboardingDraft,
          goalCode: code,
        };
      case 'level':
        return {
          ...onboardingDraft,
          levelCode: code,
        };
      case 'habit':
        return {
          ...onboardingDraft,
          habitCode: code,
        };
      case 'path':
        return {
          ...onboardingDraft,
          pathMode: code,
        };
    }
  }
}
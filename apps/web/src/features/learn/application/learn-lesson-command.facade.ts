import { Injectable, computed, inject, signal } from '@angular/core';

import { AuthSessionStore } from '../../../core/state/auth-session.store';
import { FirebaseLearningCommandRepository } from '../infrastructure/firebase-learning-command.repository';
import type { CompleteLessonResponseModel } from '../models/complete-lesson-response.model';
import type { StartLessonChallengeResponseModel } from '../models/start-lesson-challenge-response.model';

@Injectable()
export class LearnLessonCommandFacade {
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly learningCommandRepository = inject(FirebaseLearningCommandRepository);
  private readonly activeChallengeAttemptState = signal<StartLessonChallengeResponseModel | null>(null);
  private readonly commandErrorState = signal<string | null>(null);
  private readonly completionResultState = signal<CompleteLessonResponseModel | null>(null);
  private readonly isCompletingState = signal(false);
  private readonly isStartingChallengeState = signal(false);

  public readonly activeChallengeAttempt = this.activeChallengeAttemptState.asReadonly();
  public readonly commandError = this.commandErrorState.asReadonly();
  public readonly completionResult = this.completionResultState.asReadonly();
  public readonly isCompleting = this.isCompletingState.asReadonly();
  public readonly isStartingChallenge = this.isStartingChallengeState.asReadonly();
  public readonly hasCompletionResult = computed(() => this.completionResult() !== null);

  public async completeLesson(unitId: string, lessonId: string): Promise<CompleteLessonResponseModel> {
    const session = this.authSessionStore.session();
    const activeChallengeAttempt = this.activeChallengeAttempt();

    if (session.status !== 'authenticated' || !session.uid) {
      this.commandErrorState.set('Lesson tamamlama icin authenticated session gerekli.');
      throw new Error('Authenticated session is required to complete a lesson.');
    }

    if (!activeChallengeAttempt || activeChallengeAttempt.lessonId !== lessonId || activeChallengeAttempt.unitId !== unitId) {
      this.commandErrorState.set('Lesson tamamlama icin server-backed challenge attempt gerekli.');
      throw new Error('A started lesson challenge is required before completion.');
    }

    this.commandErrorState.set(null);
    this.isCompletingState.set(true);

    try {
      const response = await this.learningCommandRepository.completeLesson({
        lessonId,
        requestId: this.createRequestId(),
        unitId,
      });

      this.activeChallengeAttemptState.set(null);
      this.completionResultState.set(response);
      return response;
    } catch {
      this.commandErrorState.set('Lesson completion command calismadi.');
      throw new Error('Lesson completion command failed.');
    } finally {
      this.isCompletingState.set(false);
    }
  }

  public resetExecutionState(): void {
    this.activeChallengeAttemptState.set(null);
    this.commandErrorState.set(null);
    this.completionResultState.set(null);
  }

  public async startLessonChallenge(
    unitId: string,
    lessonId: string,
  ): Promise<StartLessonChallengeResponseModel> {
    const session = this.authSessionStore.session();

    if (session.status !== 'authenticated' || !session.uid) {
      this.commandErrorState.set('Challenge baslatmak icin authenticated session gerekli.');
      throw new Error('Authenticated session is required to start a lesson challenge.');
    }

    this.commandErrorState.set(null);
    this.completionResultState.set(null);
    this.isStartingChallengeState.set(true);

    try {
      const response = await this.learningCommandRepository.startLessonChallenge({
        lessonId,
        unitId,
      });

      this.activeChallengeAttemptState.set(response);
      return response;
    } catch {
      this.commandErrorState.set('Lesson challenge baslatilamadi.');
      throw new Error('Lesson challenge start failed.');
    } finally {
      this.isStartingChallengeState.set(false);
    }
  }

  private createRequestId(): string {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }

    return `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
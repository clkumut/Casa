import { computed, Injectable, signal } from '@angular/core';

import {
  INITIAL_AUTH_SESSION,
  type AuthSessionModel,
  type OnboardingStatus,
} from '../auth/models/auth-session.model';
import { OPS_ROLES } from '../auth/models/auth-role.model';

@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly authSessionState = signal<AuthSessionModel>(INITIAL_AUTH_SESSION);

  public readonly session = this.authSessionState.asReadonly();
  public readonly isHydrated = computed(() => this.authSessionState().status !== 'hydrating');
  public readonly isAuthenticated = computed(() => this.authSessionState().status === 'authenticated');
  public readonly isOnboardingComplete = computed(
    () => this.authSessionState().onboardingStatus === 'complete',
  );
  public readonly hasOpsAccess = computed(() =>
    this.authSessionState().roles.some((role) => OPS_ROLES.includes(role)),
  );

  public setAnonymousSession(): void {
    this.authSessionState.set({
      ...INITIAL_AUTH_SESSION,
      status: 'anonymous',
    });
  }

  public setAuthenticatedSession(
    session: Omit<AuthSessionModel, 'status'>,
  ): void {
    this.authSessionState.set({
      ...session,
      status: 'authenticated',
    });
  }

  public updateAuthenticatedOnboardingStatus(onboardingStatus: OnboardingStatus): void {
    const currentSession = this.authSessionState();

    if (currentSession.status !== 'authenticated') {
      return;
    }

    this.authSessionState.set({
      ...currentSession,
      onboardingStatus,
    });
  }
}
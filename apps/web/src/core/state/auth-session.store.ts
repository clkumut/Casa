import { computed, Injectable, signal } from '@angular/core';

import { INITIAL_AUTH_SESSION, type AuthSessionModel } from '../auth/models/auth-session.model';
import { OPS_ROLES } from '../auth/models/auth-role.model';

@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly authSessionState = signal<AuthSessionModel>(INITIAL_AUTH_SESSION);

  public readonly session = this.authSessionState.asReadonly();
  public readonly isAuthenticated = computed(() => this.authSessionState().status === 'authenticated');
  public readonly isOnboardingComplete = computed(
    () => this.authSessionState().onboardingStatus === 'complete',
  );
  public readonly hasOpsAccess = computed(() =>
    this.authSessionState().roles.some((role) => OPS_ROLES.includes(role)),
  );

  public setSession(session: AuthSessionModel): void {
    this.authSessionState.set(session);
  }

  public reset(): void {
    this.authSessionState.set(INITIAL_AUTH_SESSION);
  }
}
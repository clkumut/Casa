import type { CasaRole } from './auth-role.model';

export type AuthStatus = 'anonymous' | 'authenticated';
export type OnboardingStatus = 'required' | 'complete';

export interface AuthSessionModel {
  readonly status: AuthStatus;
  readonly roles: ReadonlyArray<CasaRole>;
  readonly onboardingStatus: OnboardingStatus;
}

export const INITIAL_AUTH_SESSION: AuthSessionModel = {
  status: 'anonymous',
  roles: ['anonymous'],
  onboardingStatus: 'required',
};
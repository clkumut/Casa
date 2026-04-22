import type { CasaRole } from './auth-role.model';

export type AuthStatus = 'hydrating' | 'anonymous' | 'authenticated';
export type OnboardingStatus = 'loading' | 'required' | 'complete';

export interface AuthSessionModel {
  readonly email: string | null;
  readonly uid: string | null;
  readonly status: AuthStatus;
  readonly roles: ReadonlyArray<CasaRole>;
  readonly onboardingStatus: OnboardingStatus;
}

export const INITIAL_AUTH_SESSION: AuthSessionModel = {
  email: null,
  uid: null,
  status: 'hydrating',
  roles: ['anonymous'],
  onboardingStatus: 'required',
};
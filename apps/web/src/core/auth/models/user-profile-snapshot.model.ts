import type { OnboardingStatus } from './auth-session.model';

export interface UserProfileSnapshotModel {
  readonly onboardingCompletedAt?: unknown;
}

export const resolveOnboardingStatusFromUserProfile = (
  userProfile: UserProfileSnapshotModel | undefined,
): OnboardingStatus => {
  return userProfile?.onboardingCompletedAt ? 'complete' : 'required';
};
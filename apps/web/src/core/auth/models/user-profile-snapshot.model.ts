import type { OnboardingStatus } from './auth-session.model';
import type { OnboardingStepId } from './onboarding-step.model';

export interface OnboardingDraftFieldModel {
  readonly goalCode?: unknown;
  readonly levelCode?: unknown;
  readonly habitCode?: unknown;
  readonly pathMode?: unknown;
}

export interface UserProfileSnapshotModel extends OnboardingDraftFieldModel {
  readonly onboardingCompletedAt?: unknown;
}

export interface ResolvedOnboardingProgressModel {
  readonly nextOnboardingStep: OnboardingStepId | null;
  readonly onboardingStatus: OnboardingStatus;
}

export const resolveNextOnboardingStep = (
  onboardingDraft: OnboardingDraftFieldModel | undefined,
): OnboardingStepId | null => {
  if (!hasNonEmptyString(onboardingDraft?.goalCode)) {
    return 'goal';
  }

  if (!hasNonEmptyString(onboardingDraft?.levelCode)) {
    return 'level';
  }

  if (!hasNonEmptyString(onboardingDraft?.habitCode)) {
    return 'habit';
  }

  if (!hasNonEmptyString(onboardingDraft?.pathMode)) {
    return 'path';
  }

  return null;
};

export const resolveOnboardingProgressFromUserProfile = (
  userProfile: UserProfileSnapshotModel | undefined,
): ResolvedOnboardingProgressModel => {
  if (userProfile?.onboardingCompletedAt) {
    return {
      nextOnboardingStep: null,
      onboardingStatus: 'complete',
    };
  }

  return {
    nextOnboardingStep: resolveNextOnboardingStep(userProfile),
    onboardingStatus: 'required',
  };
};

const hasNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.length > 0;
};
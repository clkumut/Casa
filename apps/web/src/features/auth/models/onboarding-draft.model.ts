import type { OnboardingStepId } from './onboarding-step-id.model';

export interface OnboardingDraftModel {
  readonly goalCode: string | null;
  readonly levelCode: string | null;
  readonly habitCode: string | null;
  readonly pathMode: string | null;
}

export const EMPTY_ONBOARDING_DRAFT: OnboardingDraftModel = {
  goalCode: null,
  levelCode: null,
  habitCode: null,
  pathMode: null,
};

export const resolveOnboardingDraftSelection = (
  onboardingDraft: OnboardingDraftModel,
  step: OnboardingStepId,
): string | null => {
  switch (step) {
    case 'goal':
      return onboardingDraft.goalCode;
    case 'level':
      return onboardingDraft.levelCode;
    case 'habit':
      return onboardingDraft.habitCode;
    case 'path':
      return onboardingDraft.pathMode;
  }
};
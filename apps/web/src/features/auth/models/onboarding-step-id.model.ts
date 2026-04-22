export type OnboardingStepId = 'goal' | 'level' | 'habit' | 'path';

export const ONBOARDING_STEP_SEQUENCE: ReadonlyArray<OnboardingStepId> = [
  'goal',
  'level',
  'habit',
  'path',
];

export const ONBOARDING_STEP_LABELS: Readonly<Record<OnboardingStepId, string>> = {
  goal: 'Hedef',
  level: 'Seviye',
  habit: 'Ritim',
  path: 'Yol',
};
import type { OnboardingStepId } from './onboarding-step-id.model';

export interface OnboardingOptionModel {
  readonly code: string;
  readonly description: string | null;
  readonly title: string;
}

export type OnboardingCatalogModel = Readonly<
  Record<OnboardingStepId, ReadonlyArray<OnboardingOptionModel>>
>;

export const EMPTY_ONBOARDING_CATALOG: OnboardingCatalogModel = {
  goal: [],
  level: [],
  habit: [],
  path: [],
};
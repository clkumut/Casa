import { EMPTY_ONBOARDING_DRAFT, type OnboardingDraftModel } from './onboarding-draft.model';
import { EMPTY_ONBOARDING_CATALOG, type OnboardingCatalogModel } from './onboarding-option.model';

export type OnboardingReadStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface OnboardingReadModel {
  readonly status: OnboardingReadStatus;
  readonly draft: OnboardingDraftModel;
  readonly catalog: OnboardingCatalogModel;
}

export type OnboardingReadPayload = Omit<OnboardingReadModel, 'status'>;

export const INITIAL_ONBOARDING_READ_MODEL: OnboardingReadModel = {
  status: 'idle',
  draft: EMPTY_ONBOARDING_DRAFT,
  catalog: EMPTY_ONBOARDING_CATALOG,
};
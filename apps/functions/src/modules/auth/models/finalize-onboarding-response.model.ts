export type FinalizeOnboardingStatus = 'already-complete' | 'completed';

export interface FinalizeOnboardingResponseModel {
  readonly status: FinalizeOnboardingStatus;
  readonly uid: string;
}
import {
  ONBOARDING_SUMMARY_ROUTE,
  resolveOnboardingStepRoute,
  type OnboardingStepId,
} from '../auth/models/onboarding-step.model';

export const AUTH_ROUTE_REDIRECTS = {
  appHome: '/app/learn',
  login: '/auth/login',
  onboarding: ONBOARDING_SUMMARY_ROUTE,
} as const;

export const resolveOnboardingRedirect = (nextOnboardingStep: OnboardingStepId | null): string => {
  return nextOnboardingStep
    ? resolveOnboardingStepRoute(nextOnboardingStep)
    : AUTH_ROUTE_REDIRECTS.onboarding;
};
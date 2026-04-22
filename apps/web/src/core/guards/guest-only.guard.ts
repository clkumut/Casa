import type { CanActivateFn } from '@angular/router';

import { AUTH_ROUTE_REDIRECTS } from './route-redirects';
import { withHydratedAuthSession } from './hydrated-auth-session.guard-helper';

export const guestOnlyGuard: CanActivateFn = () => {
  return withHydratedAuthSession((session, router) => {
    if (session.status !== 'authenticated') {
      return true;
    }

    return session.onboardingStatus === 'complete'
      ? router.createUrlTree([AUTH_ROUTE_REDIRECTS.appHome])
      : router.createUrlTree([AUTH_ROUTE_REDIRECTS.onboarding]);
  });
};
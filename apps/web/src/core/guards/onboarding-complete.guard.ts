import type { CanActivateFn } from '@angular/router';

import { AUTH_ROUTE_REDIRECTS } from './route-redirects';
import { withHydratedAuthSession } from './hydrated-auth-session.guard-helper';

export const onboardingCompleteGuard: CanActivateFn = () => {
  return withHydratedAuthSession((session, router) => {
    if (session.status !== 'authenticated') {
      return router.createUrlTree([AUTH_ROUTE_REDIRECTS.login]);
    }

    return session.onboardingStatus === 'complete'
      ? true
      : router.createUrlTree([AUTH_ROUTE_REDIRECTS.onboarding]);
  });
};
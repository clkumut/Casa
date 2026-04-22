import type { CanActivateFn } from '@angular/router';

import { AUTH_ROUTE_REDIRECTS, resolveOnboardingRedirect } from './route-redirects';
import { withHydratedAuthSession } from './hydrated-auth-session.guard-helper';

export const onboardingProgressGuard: CanActivateFn = (_route, state) => {
  const currentUrl = state.url.split('?')[0];

  return withHydratedAuthSession((session, router) => {
    if (session.status !== 'authenticated') {
      return router.createUrlTree([AUTH_ROUTE_REDIRECTS.login]);
    }

    if (session.onboardingStatus === 'complete') {
      return router.createUrlTree([AUTH_ROUTE_REDIRECTS.appHome]);
    }

    const redirectUrl = resolveOnboardingRedirect(session.nextOnboardingStep);

    return currentUrl === redirectUrl ? true : router.createUrlTree([redirectUrl]);
  });
};
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthSessionStore } from '../state/auth-session.store';
import { AUTH_ROUTE_REDIRECTS } from './route-redirects';

export const onboardingProgressGuard: CanActivateFn = () => {
  const authSessionStore = inject(AuthSessionStore);
  const router = inject(Router);

  if (!authSessionStore.isAuthenticated()) {
    return router.createUrlTree([AUTH_ROUTE_REDIRECTS.login]);
  }

  return authSessionStore.isOnboardingComplete()
    ? router.createUrlTree([AUTH_ROUTE_REDIRECTS.appHome])
    : true;
};
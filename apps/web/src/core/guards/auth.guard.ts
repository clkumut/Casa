import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthSessionStore } from '../state/auth-session.store';
import { AUTH_ROUTE_REDIRECTS } from './route-redirects';

export const authGuard: CanActivateFn = () => {
  const authSessionStore = inject(AuthSessionStore);
  const router = inject(Router);

  return authSessionStore.isAuthenticated()
    ? true
    : router.createUrlTree([AUTH_ROUTE_REDIRECTS.login]);
};
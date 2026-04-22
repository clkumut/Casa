import type { CanActivateFn } from '@angular/router';

import { AUTH_ROUTE_REDIRECTS } from './route-redirects';
import { withHydratedAuthSession } from './hydrated-auth-session.guard-helper';

export const authGuard: CanActivateFn = () => {
  return withHydratedAuthSession((session, router) =>
    session.status === 'authenticated'
      ? true
      : router.createUrlTree([AUTH_ROUTE_REDIRECTS.login]),
  );
};
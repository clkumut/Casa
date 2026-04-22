import type { CanActivateFn } from '@angular/router';

import { AUTH_ROUTE_REDIRECTS } from './route-redirects';
import { withHydratedAuthSession } from './hydrated-auth-session.guard-helper';

export const opsRoleGuard: CanActivateFn = () => {
  return withHydratedAuthSession((session, router) => {
    if (session.status !== 'authenticated') {
      return router.createUrlTree([AUTH_ROUTE_REDIRECTS.login]);
    }

    return session.roles.some((role) => role !== 'anonymous' && role !== 'learner')
      ? true
      : router.createUrlTree([AUTH_ROUTE_REDIRECTS.appHome]);
  });
};
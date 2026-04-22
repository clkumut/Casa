import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, type UrlTree } from '@angular/router';
import { filter, map, take, type Observable } from 'rxjs';

import type { AuthSessionModel } from '../auth/models/auth-session.model';
import { AuthSessionStore } from '../state/auth-session.store';

type GuardDecision = (session: AuthSessionModel, router: Router) => boolean | UrlTree;

/** Delay route decisions until the auth session hydration pass has completed. */
export const withHydratedAuthSession = (
  decision: GuardDecision,
): Observable<boolean | UrlTree> => {
  const authSessionStore = inject(AuthSessionStore);
  const router = inject(Router);

  return toObservable(authSessionStore.session).pipe(
    filter(
      (session) =>
        session.status !== 'hydrating' &&
        (session.status !== 'authenticated' || session.onboardingStatus !== 'loading'),
    ),
    take(1),
    map((session) => decision(session, router)),
  );
};
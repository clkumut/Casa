import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { FirebaseAuthSessionService } from '../core/auth/firebase-auth-session.service';
import {
  CASA_RUNTIME_CONFIG,
  resolveCasaRuntimeConfig,
} from '../core/config/casa-runtime-config.token';
import { routes } from './app.routes';

const initializeFirebaseAuthSession = (
  firebaseAuthSessionService: FirebaseAuthSessionService,
): (() => Promise<void>) => {
  return () => firebaseAuthSessionService.initialize();
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: CASA_RUNTIME_CONFIG,
      useFactory: resolveCasaRuntimeConfig,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [FirebaseAuthSessionService],
      useFactory: initializeFirebaseAuthSession,
    },
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
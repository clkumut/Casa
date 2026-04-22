import { InjectionToken } from '@angular/core';

import type { CasaFirebaseClientConfig, CasaRuntimeConfigModel } from './models/casa-runtime-config.model';
import type { RuntimeEnvironment } from './models/runtime-environment.model';

interface RuntimeConfigSource {
  readonly environment?: RuntimeEnvironment;
  readonly firebase?: Partial<CasaFirebaseClientConfig>;
  readonly useEmulators?: boolean;
}

type RuntimeGlobal = typeof globalThis & {
  __CASA_RUNTIME_CONFIG__?: RuntimeConfigSource;
  location?: Location;
};

const LOCAL_HOSTS = new Set(['127.0.0.1', '0.0.0.0', 'localhost']);

const LOCAL_RUNTIME_CONFIG: CasaRuntimeConfigModel = {
  environment: 'local',
  useEmulators: true,
  firebase: {
    apiKey: 'demo-casa-local-api-key',
    appId: '1:000000000000:web:demo-casa-local',
    authDomain: 'demo-casa-local.firebaseapp.com',
    messagingSenderId: '000000000000',
    projectId: 'demo-casa-local',
    storageBucket: 'demo-casa-local.firebasestorage.app',
  },
};

/** Runtime config token consumed by browser-side Firebase adapters. */
export const CASA_RUNTIME_CONFIG = new InjectionToken<CasaRuntimeConfigModel>(
  'CASA_RUNTIME_CONFIG',
);

/** Resolve runtime config from a safe browser injection surface, with a local emulator fallback. */
export const resolveCasaRuntimeConfig = (): CasaRuntimeConfigModel => {
  const runtimeGlobal = globalThis as RuntimeGlobal;
  const runtimeConfig = runtimeGlobal.__CASA_RUNTIME_CONFIG__;

  if (runtimeConfig) {
    return materializeRuntimeConfig(runtimeConfig);
  }

  if (isLocalHostname(runtimeGlobal.location?.hostname)) {
    return LOCAL_RUNTIME_CONFIG;
  }

  throw new Error(
    'Missing __CASA_RUNTIME_CONFIG__ browser config. Non-local runtimes must provide Firebase bindings explicitly.',
  );
};

const materializeRuntimeConfig = (source: RuntimeConfigSource): CasaRuntimeConfigModel => {
  const environment = source.environment ?? 'dev';
  const firebase = source.firebase ?? {};

  return {
    environment,
    firebase: {
      apiKey: requireRuntimeValue(firebase.apiKey, 'firebase.apiKey'),
      appId: requireRuntimeValue(firebase.appId, 'firebase.appId'),
      authDomain: requireRuntimeValue(firebase.authDomain, 'firebase.authDomain'),
      messagingSenderId: requireRuntimeValue(
        firebase.messagingSenderId,
        'firebase.messagingSenderId',
      ),
      projectId: requireRuntimeValue(firebase.projectId, 'firebase.projectId'),
      storageBucket: requireRuntimeValue(firebase.storageBucket, 'firebase.storageBucket'),
      ...(firebase.measurementId
        ? {
            measurementId: firebase.measurementId,
          }
        : {}),
    },
    useEmulators: source.useEmulators ?? environment === 'local',
  };
};

const requireRuntimeValue = (value: string | undefined, fieldName: string): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing runtime config field ${fieldName}.`);
  }

  return trimmedValue;
};

const isLocalHostname = (hostname: string | undefined): boolean => {
  if (!hostname) {
    return false;
  }

  return LOCAL_HOSTS.has(hostname.toLowerCase());
};
import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import { CASA_RUNTIME_CONFIG } from '../config/casa-runtime-config.token';
import { shouldUseFirestoreOneShotReads } from '../config/firebase-emulator-connect';
import { FirebaseRightRailProjectionService } from '../services/firebase-right-rail-projection.service';

export const appReadinessResolver: ResolveFn<boolean> = async () => {
  const runtimeConfig = inject(CASA_RUNTIME_CONFIG);

  if (shouldUseFirestoreOneShotReads(runtimeConfig.useEmulators)) {
    return true;
  }

  await inject(FirebaseRightRailProjectionService).initialize();
  return true;
};

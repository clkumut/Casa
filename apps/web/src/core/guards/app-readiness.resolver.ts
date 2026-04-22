import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import { FirebaseRightRailProjectionService } from '../services/firebase-right-rail-projection.service';

export const appReadinessResolver: ResolveFn<boolean> = async () => {
  await inject(FirebaseRightRailProjectionService).initialize();
  return true;
};
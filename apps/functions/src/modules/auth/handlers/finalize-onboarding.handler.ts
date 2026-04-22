import { onCall, type CallableRequest } from 'firebase-functions/v2/https';

import { requireAuthenticatedCallableContext } from '../../../core/auth/require-authenticated-callable-request';
import { FinalizeOnboardingService } from '../application/finalize-onboarding.service';
import type { FinalizeOnboardingRequestModel } from '../models/finalize-onboarding-request.model';

const finalizeOnboardingService = new FinalizeOnboardingService();

export const finalizeOnboarding = onCall(
  { cors: true },
  async (request: CallableRequest<FinalizeOnboardingRequestModel>) => {
    const { uid } = requireAuthenticatedCallableContext(request);

    return finalizeOnboardingService.finalize(uid);
  },
);
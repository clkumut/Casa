import { onCall, type CallableRequest } from 'firebase-functions/v2/https';

import { requireAuthenticatedCallableContext } from '../../../core/auth/require-authenticated-callable-request';
import { StartLessonChallengeService } from '../application/start-lesson-challenge.service';
import type { StartLessonChallengeRequestModel } from '../models/start-lesson-challenge-request.model';

const startLessonChallengeService = new StartLessonChallengeService();

export const startLessonChallenge = onCall(
  { cors: true },
  async (request: CallableRequest<StartLessonChallengeRequestModel>) => {
    const { uid } = requireAuthenticatedCallableContext(request);

    return startLessonChallengeService.start(uid, request.data);
  },
);
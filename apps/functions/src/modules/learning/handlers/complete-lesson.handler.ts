import { onCall, type CallableRequest } from 'firebase-functions/v2/https';

import { requireAuthenticatedCallableContext } from '../../../core/auth/require-authenticated-callable-request';
import { CompleteLessonService } from '../application/complete-lesson.service';
import type { CompleteLessonRequestModel } from '../models/complete-lesson-request.model';

const completeLessonService = new CompleteLessonService();

export const completeLesson = onCall(
  { cors: true },
  async (request: CallableRequest<CompleteLessonRequestModel>) => {
    const { uid } = requireAuthenticatedCallableContext(request);

    return completeLessonService.complete(uid, request.data);
  },
);
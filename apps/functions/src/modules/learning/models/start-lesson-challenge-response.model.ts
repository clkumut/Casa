export type StartLessonChallengeStatus = 'already-started' | 'started';

export interface StartLessonChallengeResponseModel {
  readonly challengeId: string;
  readonly lessonId: string;
  readonly status: StartLessonChallengeStatus;
  readonly unitId: string;
}
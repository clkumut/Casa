export type CompleteLessonStatus = 'already-complete' | 'completed';

export interface CompleteLessonResponseModel {
  readonly completedLessonCount: number;
  readonly currentHearts: number | null;
  readonly currentLessonId: string | null;
  readonly lifetimeXp: number | null;
  readonly status: CompleteLessonStatus;
  readonly uid: string;
}
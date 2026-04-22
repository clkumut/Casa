export interface LearningCatalogDocumentModel {
  readonly id: string;
  readonly order: number | null;
  readonly parentId: string | null;
  readonly publishState: string | null;
  readonly title: string | null;
}

export interface CompleteLessonCatalogContextModel {
  readonly chapterId: string | null;
  readonly firstLessonId: string | null;
  readonly lesson: LearningCatalogDocumentModel;
  readonly nextLessonId: string | null;
  readonly unit: LearningCatalogDocumentModel;
  readonly worldId: string | null;
}

export interface StartLessonChallengeContextModel {
  readonly challengeId: string;
  readonly firstLessonId: string | null;
  readonly lesson: LearningCatalogDocumentModel;
  readonly unit: LearningCatalogDocumentModel;
}
import type { LearningCatalogNodeModel } from './learning-catalog.model';

export interface LearningLessonChallengeModel {
  readonly description: string;
  readonly hasExplicitReference: boolean;
  readonly id: string;
  readonly title: string;
}

export const resolveLessonChallenge = (
  lesson: LearningCatalogNodeModel | null,
): LearningLessonChallengeModel | null => {
  if (!lesson) {
    return null;
  }

  const explicitChallengeId = lesson.challengeIds[0] ?? null;

  if (explicitChallengeId) {
    return {
      description: 'Lesson catalog icindeki ilk challenge referansi execution gate olarak cozuldu.',
      hasExplicitReference: true,
      id: explicitChallengeId,
      title: `Challenge ${explicitChallengeId}`,
    };
  }

  return {
    description:
      'Challenge referansi publish edilene kadar completion gate lesson entry checkpoint uzerinden acilir.',
    hasExplicitReference: false,
    id: `${lesson.id}-entry`,
    title: 'Lesson entry checkpoint',
  };
};
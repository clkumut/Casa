type FirestoreRecord = Record<string, unknown>;

export interface LearningProgressionModel {
  readonly completedLessonCount: number | null;
  readonly currentChapterId: string | null;
  readonly currentLessonId: string | null;
  readonly currentUnitId: string | null;
  readonly currentWorldId: string | null;
  readonly masteredUnitCount: number | null;
  readonly unlockState: string | null;
}

export const resolveLearningProgression = (
  progressionDocuments: ReadonlyArray<Readonly<{ id: string; data: unknown }>>,
): LearningProgressionModel | null => {
  const progressionDocument =
    progressionDocuments.find((documentSnapshot) => documentSnapshot.id === 'default') ??
    progressionDocuments[0];

  if (!progressionDocument) {
    return null;
  }

  const record = asRecord(progressionDocument.data);

  if (!record) {
    return null;
  }

  return {
    completedLessonCount: readStringArray(record, 'completedLessonIds')?.length ?? null,
    currentChapterId: readString(record, 'currentChapterId'),
    currentLessonId: readString(record, 'currentLessonId'),
    currentUnitId: readString(record, 'currentUnitId'),
    currentWorldId: readString(record, 'currentWorldId'),
    masteredUnitCount: readStringArray(record, 'masteredUnitIds')?.length ?? null,
    unlockState: readString(record, 'unlockState'),
  };
};

const asRecord = (value: unknown): FirestoreRecord | null => {
  return typeof value === 'object' && value !== null ? (value as FirestoreRecord) : null;
};

const readString = (record: FirestoreRecord, key: string): string | null => {
  const value = record[key];

  return typeof value === 'string' && value.length > 0 ? value : null;
};

const readStringArray = (record: FirestoreRecord, key: string): ReadonlyArray<string> | null => {
  const value = record[key];

  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : null;
};
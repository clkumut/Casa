type FirestoreRecord = Record<string, unknown>;

export type LearningCatalogNodeKind = 'world' | 'chapter' | 'unit' | 'lesson';

export interface LearningCatalogNodeModel {
  readonly challengeIds: ReadonlyArray<string>;
  readonly description: string | null;
  readonly id: string;
  readonly kind: LearningCatalogNodeKind;
  readonly order: number | null;
  readonly parentId: string | null;
  readonly publishState: string | null;
  readonly prerequisiteIds: ReadonlyArray<string>;
  readonly title: string | null;
}

export interface LearningCatalogMapModel {
  readonly chapters: ReadonlyArray<LearningCatalogNodeModel>;
  readonly lessons: ReadonlyArray<LearningCatalogNodeModel>;
  readonly units: ReadonlyArray<LearningCatalogNodeModel>;
  readonly worlds: ReadonlyArray<LearningCatalogNodeModel>;
}

export interface LearningCatalogSelectionModel {
  readonly chapter: LearningCatalogNodeModel | null;
  readonly lesson: LearningCatalogNodeModel | null;
  readonly unit: LearningCatalogNodeModel | null;
  readonly world: LearningCatalogNodeModel | null;
}

export const EMPTY_LEARNING_CATALOG_MAP: LearningCatalogMapModel = {
  chapters: [],
  lessons: [],
  units: [],
  worlds: [],
};

export const EMPTY_LEARNING_CATALOG_SELECTION: LearningCatalogSelectionModel = {
  chapter: null,
  lesson: null,
  unit: null,
  world: null,
};

export const resolveLearningCatalogNode = (
  kind: LearningCatalogNodeKind,
  documentId: string,
  snapshotData: unknown,
): LearningCatalogNodeModel => {
  const record = asRecord(snapshotData);

  return {
    challengeIds: resolveChallengeIds(record),
    description:
      readString(record, 'description') ??
      readString(record, 'summary') ??
      readString(record, 'subtitle'),
    id: documentId,
    kind,
    order:
      readNumber(record, 'order') ??
      readNumber(record, 'sequence') ??
      readNumber(record, 'sortOrder'),
    parentId: resolveParentId(kind, record),
    publishState:
      readString(record, 'publishState') ??
      readString(record, 'status') ??
      readString(record, 'state'),
    prerequisiteIds: resolvePrerequisiteIds(record),
    title:
      readString(record, 'title') ??
      readString(record, 'label') ??
      readString(record, 'name') ??
      readString(record, 'displayName'),
  };
};

export const isPublishedLearningCatalogNode = (node: LearningCatalogNodeModel): boolean => {
  if (!node.publishState) {
    return false;
  }

  const normalizedPublishState = node.publishState.toLowerCase();

  return normalizedPublishState === 'published'
    || normalizedPublishState === 'active'
    || normalizedPublishState === 'live';
};

export const sortLearningCatalogNodes = (
  nodes: ReadonlyArray<LearningCatalogNodeModel>,
): ReadonlyArray<LearningCatalogNodeModel> => {
  return [...nodes].sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftTitle = left.title ?? left.id;
    const rightTitle = right.title ?? right.id;

    return leftTitle.localeCompare(rightTitle, 'en');
  });
};

const asRecord = (value: unknown): FirestoreRecord | null => {
  return typeof value === 'object' && value !== null ? (value as FirestoreRecord) : null;
};

const readNumber = (record: FirestoreRecord | null, key: string): number | null => {
  const value = record?.[key];

  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const readString = (record: FirestoreRecord | null, key: string): string | null => {
  const value = record?.[key];

  return typeof value === 'string' && value.length > 0 ? value : null;
};

const readStringArray = (value: unknown): ReadonlyArray<string> => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
};

const resolvePrerequisiteIds = (record: FirestoreRecord | null): ReadonlyArray<string> => {
  const prerequisiteCandidates = [
    record?.prerequisiteUnitIds,
    record?.prerequisiteChapterIds,
    record?.prerequisiteIds,
    record?.prerequisiteRefs,
    record?.prerequisites,
  ];

  for (const candidate of prerequisiteCandidates) {
    const directIds = readStringArray(candidate);

    if (directIds.length > 0) {
      return [...new Set(directIds)];
    }

    if (!Array.isArray(candidate)) {
      continue;
    }

    const recordIds = candidate
      .map((item) => asRecord(item))
      .map(
        (itemRecord) =>
          readString(itemRecord, 'id')
          ?? readString(itemRecord, 'ref')
          ?? readString(itemRecord, 'unitId')
          ?? readString(itemRecord, 'chapterId'),
      )
      .filter((item): item is string => item !== null);

    if (recordIds.length > 0) {
      return [...new Set(recordIds)];
    }
  }

  return [];
};

const resolveChallengeIds = (record: FirestoreRecord | null): ReadonlyArray<string> => {
  const challengeCandidates = [
    record?.challengeIds,
    record?.challengeTemplateIds,
    record?.challengeRefs,
    record?.challenges,
  ];

  for (const candidate of challengeCandidates) {
    const directIds = readStringArray(candidate);

    if (directIds.length > 0) {
      return [...new Set(directIds)];
    }

    if (!Array.isArray(candidate)) {
      continue;
    }

    const challengeIds = candidate
      .map((item) => asRecord(item))
      .map(
        (itemRecord) =>
          readString(itemRecord, 'id')
          ?? readString(itemRecord, 'ref')
          ?? readString(itemRecord, 'challengeId')
          ?? readString(itemRecord, 'challengeTemplateId')
          ?? readString(itemRecord, 'templateId'),
      )
      .filter((item): item is string => item !== null);

    if (challengeIds.length > 0) {
      return [...new Set(challengeIds)];
    }
  }

  return [];
};

const resolveParentId = (
  kind: LearningCatalogNodeKind,
  record: FirestoreRecord | null,
): string | null => {
  if (kind === 'chapter') {
    return readString(record, 'worldId') ?? readString(record, 'worldRef');
  }

  if (kind === 'unit') {
    return readString(record, 'chapterId') ?? readString(record, 'chapterRef');
  }

  if (kind === 'lesson') {
    return readString(record, 'unitId') ?? readString(record, 'unitRef');
  }

  return null;
};
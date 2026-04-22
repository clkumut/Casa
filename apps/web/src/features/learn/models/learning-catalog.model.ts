type FirestoreRecord = Record<string, unknown>;

export type LearningCatalogNodeKind = 'world' | 'chapter' | 'unit';

export interface LearningCatalogNodeModel {
  readonly description: string | null;
  readonly id: string;
  readonly kind: LearningCatalogNodeKind;
  readonly order: number | null;
  readonly parentId: string | null;
  readonly publishState: string | null;
  readonly title: string | null;
}

export interface LearningCatalogSelectionModel {
  readonly chapter: LearningCatalogNodeModel | null;
  readonly unit: LearningCatalogNodeModel | null;
  readonly world: LearningCatalogNodeModel | null;
}

export const EMPTY_LEARNING_CATALOG_SELECTION: LearningCatalogSelectionModel = {
  chapter: null,
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
    description:
      readString(record, 'description') ??
      readString(record, 'summary') ??
      readString(record, 'subtitle'),
    id: documentId,
    kind,
    order: readNumber(record, 'order') ?? readNumber(record, 'sequence') ?? readNumber(record, 'sortOrder'),
    parentId: resolveParentId(kind, record),
    publishState:
      readString(record, 'publishState') ??
      readString(record, 'status') ??
      readString(record, 'state'),
    title:
      readString(record, 'title') ??
      readString(record, 'label') ??
      readString(record, 'name') ??
      readString(record, 'displayName'),
  };
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

  return null;
};
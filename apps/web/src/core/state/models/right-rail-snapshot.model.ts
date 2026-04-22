type FirestoreRecord = Record<string, unknown>;

export interface RightRailSnapshotModel {
  readonly activeStreakDays: number | null;
  readonly currentGems: number | null;
  readonly currentHearts: number | null;
  readonly heartsCapacity: number | null;
  readonly lifetimeXp: number | null;
}

export const EMPTY_RIGHT_RAIL_SNAPSHOT: RightRailSnapshotModel = {
  activeStreakDays: null,
  currentGems: null,
  currentHearts: null,
  heartsCapacity: null,
  lifetimeXp: null,
};

export const resolveRightRailSnapshot = (
  snapshotData: unknown,
): RightRailSnapshotModel | null => {
  const record = asRecord(snapshotData);

  if (!record) {
    return null;
  }

  return {
    activeStreakDays: readNumber(record, ['activeStreakDays', 'streakDays', 'streak']),
    currentGems: readNumber(record, ['currentGems', 'gems']),
    currentHearts: readNumber(record, ['currentHearts', 'hearts']),
    heartsCapacity: readNumber(record, ['heartsCapacity', 'maxHearts']),
    lifetimeXp: readNumber(record, ['lifetimeXp', 'xp', 'totalXp']),
  };
};

const asRecord = (value: unknown): FirestoreRecord | null => {
  return typeof value === 'object' && value !== null ? (value as FirestoreRecord) : null;
};

const readNumber = (record: FirestoreRecord, keys: ReadonlyArray<string>): number | null => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
};
import { FieldValue, type DocumentData, type QuerySnapshot } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';

import { getFirebaseAdminFirestore } from '../../../core/firestore/firebase-admin.app';
import type { CompleteLessonCatalogContextModel, LearningCatalogDocumentModel } from '../models/complete-lesson-catalog-context.model';
import type { CompleteLessonRequestModel } from '../models/complete-lesson-request.model';
import type { CompleteLessonResponseModel, CompleteLessonStatus } from '../models/complete-lesson-response.model';

type FirestoreRecord = Record<string, unknown>;

const DEFAULT_ACTIVE_STREAK_DAYS = 1;
const DEFAULT_GEMS = 0;
const DEFAULT_HEARTS = 5;
const DEFAULT_HEARTS_CAPACITY = 5;
const DEFAULT_SNAPSHOT_ID = 'default';
const LESSON_COMPLETION_XP = 10;

export class CompleteLessonService {
  private readonly firestore = getFirebaseAdminFirestore();

  public async complete(
    uid: string,
    payload: CompleteLessonRequestModel,
  ): Promise<CompleteLessonResponseModel> {
    const request = this.validateRequest(payload);
    const catalogContext = await this.loadCatalogContext(request.unitId, request.lessonId);
    const userDocumentReference = this.firestore.collection('users').doc(uid);
    const progressionDocumentReference = userDocumentReference
      .collection('progressionSnapshots')
      .doc(DEFAULT_SNAPSHOT_ID);
    const rightRailDocumentReference = userDocumentReference
      .collection('rightRailSnapshots')
      .doc(DEFAULT_SNAPSHOT_ID);
    const challengeAttemptDocumentReference = this.firestore
      .collection('lesson_challenge_attempts')
      .doc(this.buildChallengeAttemptDocumentId(uid, request.unitId, request.lessonId));
    const completionEventReference = this.firestore
      .collection('learning_completion_events')
      .doc(this.buildCompletionEventDocumentId(uid, request.requestId));

    return this.firestore.runTransaction(async (transaction) => {
      const [
        userDocument,
        progressionDocument,
        rightRailDocument,
        challengeAttemptDocument,
        completionEventDocument,
      ] =
        await Promise.all([
          transaction.get(userDocumentReference),
          transaction.get(progressionDocumentReference),
          transaction.get(rightRailDocumentReference),
          transaction.get(challengeAttemptDocumentReference),
          transaction.get(completionEventReference),
        ]);

      if (completionEventDocument.exists) {
        this.assertExistingCompletionEventMatchesRequest(
          this.asRecord(completionEventDocument.data()),
          uid,
          request.lessonId,
          request.unitId,
        );

        return this.createResponse(
          uid,
          'already-complete',
          this.asRecord(progressionDocument.data()),
          this.asRecord(rightRailDocument.data()),
        );
      }

      const progressionData = this.asRecord(progressionDocument.data());
      const rightRailData = this.asRecord(rightRailDocument.data());
      const userData = this.asRecord(userDocument.data());
      const challengeAttemptData = this.asRecord(challengeAttemptDocument.data());

      this.assertCompletionPreconditions(progressionData, request.lessonId, request.unitId);
      this.assertChallengeAttempt(challengeAttemptData, uid, request.lessonId, request.unitId);

      const completedLessonIds = this.readStringArray(progressionData, 'completedLessonIds');

      if (completedLessonIds.includes(request.lessonId)) {
        transaction.create(completionEventReference, {
          chapterId: catalogContext.chapterId,
          createdAt: FieldValue.serverTimestamp(),
          lessonId: request.lessonId,
          requestId: request.requestId,
          status: 'already-complete',
          uid,
          unitId: request.unitId,
          worldId: catalogContext.worldId,
        });
        transaction.set(
          challengeAttemptDocumentReference,
          {
            completionRequestId: request.requestId,
            completedAt: FieldValue.serverTimestamp(),
            status: 'completed',
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        return this.createResponse(uid, 'already-complete', progressionData, rightRailData);
      }

      const updatedCompletedLessonIds = [...completedLessonIds, request.lessonId];
      const updatedMasteredUnitIds = this.resolveUpdatedMasteredUnitIds(
        this.readStringArray(progressionData, 'masteredUnitIds'),
        request.unitId,
        catalogContext.nextLessonId,
      );
      const updatedLifetimeXp =
        this.readNumber(rightRailData, ['lifetimeXp', 'xp', 'totalXp'])
        ?? this.readNumber(userData, ['lifetimeXp'])
        ?? 0;
      const updatedHeartsCapacity =
        this.readNumber(rightRailData, ['heartsCapacity', 'maxHearts']) ?? DEFAULT_HEARTS_CAPACITY;
      const updatedCurrentHearts =
        this.readNumber(rightRailData, ['currentHearts', 'hearts'])
        ?? this.readNumber(userData, ['currentHearts'])
        ?? DEFAULT_HEARTS;
      const updatedCurrentGems =
        this.readNumber(rightRailData, ['currentGems', 'gems'])
        ?? this.readNumber(userData, ['currentGems'])
        ?? DEFAULT_GEMS;
      const updatedActiveStreakDays =
        this.readNumber(rightRailData, ['activeStreakDays', 'streakDays', 'streak'])
        ?? this.readNumber(userData, ['activeStreakDays'])
        ?? DEFAULT_ACTIVE_STREAK_DAYS;
      const awardedLifetimeXp = updatedLifetimeXp + LESSON_COMPLETION_XP;

      transaction.set(
        progressionDocumentReference,
        {
          completedLessonIds: updatedCompletedLessonIds,
          currentChapterId: catalogContext.chapterId,
          currentLessonId: catalogContext.nextLessonId,
          currentUnitId: request.unitId,
          currentWorldId: catalogContext.worldId,
          masteredUnitIds: updatedMasteredUnitIds,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      transaction.set(
        rightRailDocumentReference,
        {
          activeStreakDays: updatedActiveStreakDays,
          currentGems: updatedCurrentGems,
          currentHearts: updatedCurrentHearts,
          heartsCapacity: updatedHeartsCapacity,
          lifetimeXp: awardedLifetimeXp,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      transaction.set(
        userDocumentReference,
        {
          activeStreakDays: updatedActiveStreakDays,
          currentGems: updatedCurrentGems,
          currentHearts: updatedCurrentHearts,
          lifetimeXp: awardedLifetimeXp,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      transaction.create(completionEventReference, {
        chapterId: catalogContext.chapterId,
        createdAt: FieldValue.serverTimestamp(),
        lessonId: request.lessonId,
        requestId: request.requestId,
        status: 'completed',
        uid,
        unitId: request.unitId,
        worldId: catalogContext.worldId,
        xpAwarded: LESSON_COMPLETION_XP,
      });
      transaction.set(
        challengeAttemptDocumentReference,
        {
          completionRequestId: request.requestId,
          completedAt: FieldValue.serverTimestamp(),
          status: 'completed',
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      return {
        completedLessonCount: updatedCompletedLessonIds.length,
        currentHearts: updatedCurrentHearts,
        currentLessonId: catalogContext.nextLessonId,
        lifetimeXp: awardedLifetimeXp,
        status: 'completed',
        uid,
      };
    });
  }

  private assertCompletionPreconditions(
    progressionData: FirestoreRecord | null,
    lessonId: string,
    unitId: string,
  ): void {
    if (!progressionData) {
      throw new HttpsError('failed-precondition', 'Progression snapshot is not ready for lesson completion.');
    }

    const currentUnitId = this.readString(progressionData, ['currentUnitId']);

    if (!currentUnitId || currentUnitId !== unitId) {
      throw new HttpsError('failed-precondition', 'Lesson completion is only allowed for the active unit.');
    }

    const currentLessonId = this.readString(progressionData, ['currentLessonId']);

    if (currentLessonId && currentLessonId !== lessonId) {
      throw new HttpsError('failed-precondition', 'Lesson completion is only allowed for the active lesson.');
    }
  }

  private async loadCatalogContext(
    unitId: string,
    lessonId: string,
  ): Promise<CompleteLessonCatalogContextModel> {
    const lessonDocument = await this.firestore.collection('catalog_learning_lessons').doc(lessonId).get();

    if (!lessonDocument.exists) {
      throw new HttpsError('not-found', 'Lesson catalog document was not found.');
    }

    const lesson = this.resolveCatalogDocument(lessonDocument.id, lessonDocument.data());

    if (!this.isPublishedCatalogDocument(lesson)) {
      throw new HttpsError('failed-precondition', 'Lesson catalog document is not published.');
    }

    if (lesson.parentId !== unitId) {
      throw new HttpsError('failed-precondition', 'Lesson does not belong to the requested unit.');
    }

    const unitDocument = await this.firestore.collection('catalog_learning_units').doc(unitId).get();

    if (!unitDocument.exists) {
      throw new HttpsError('not-found', 'Unit catalog document was not found.');
    }

    const unit = this.resolveCatalogDocument(unitDocument.id, unitDocument.data());

    if (!this.isPublishedCatalogDocument(unit)) {
      throw new HttpsError('failed-precondition', 'Unit catalog document is not published.');
    }

    const chapterId = unit.parentId;
    const worldId = chapterId ? await this.resolveWorldId(chapterId) : null;
    const unitLessons = await this.loadPublishedLessonsByUnitId(unitId);
    const lessonIndex = unitLessons.findIndex((currentLesson) => currentLesson.id === lessonId);
    const nextLesson =
      lessonIndex >= 0 && lessonIndex < unitLessons.length - 1
        ? unitLessons[lessonIndex + 1] ?? null
        : null;

    return {
      chapterId,
      firstLessonId: unitLessons[0]?.id ?? null,
      lesson,
      nextLessonId: nextLesson?.id ?? null,
      unit,
      worldId,
    };
  }

  private async loadPublishedLessonsByUnitId(
    unitId: string,
  ): Promise<ReadonlyArray<LearningCatalogDocumentModel>> {
    const byUnitIdSnapshot = await this.firestore
      .collection('catalog_learning_lessons')
      .where('unitId', '==', unitId)
      .get();
    const byUnitRefSnapshot = byUnitIdSnapshot.empty
      ? await this.firestore.collection('catalog_learning_lessons').where('unitRef', '==', unitId).get()
      : null;
    const lessonDocuments = byUnitRefSnapshot ?? byUnitIdSnapshot;

    if (lessonDocuments.empty) {
      throw new HttpsError('failed-precondition', 'No published lessons were found for the requested unit.');
    }

    return this.sortCatalogDocuments(
      lessonDocuments.docs
        .map((lessonDocument) => this.resolveCatalogDocument(lessonDocument.id, lessonDocument.data()))
        .filter((lesson) => this.isPublishedCatalogDocument(lesson)),
    );
  }

  private async resolveWorldId(chapterId: string): Promise<string | null> {
    const chapterDocument = await this.firestore.collection('catalog_learning_chapters').doc(chapterId).get();

    if (!chapterDocument.exists) {
      return null;
    }

    const chapter = this.resolveCatalogDocument(chapterDocument.id, chapterDocument.data());

    return chapter.parentId;
  }

  private createResponse(
    uid: string,
    status: CompleteLessonStatus,
    progressionData: FirestoreRecord | null,
    rightRailData: FirestoreRecord | null,
  ): CompleteLessonResponseModel {
    return {
      completedLessonCount: this.readStringArray(progressionData, 'completedLessonIds').length,
      currentHearts: this.readNumber(rightRailData, ['currentHearts', 'hearts']),
      currentLessonId: this.readString(progressionData, ['currentLessonId']),
      lifetimeXp: this.readNumber(rightRailData, ['lifetimeXp', 'xp', 'totalXp']),
      status,
      uid,
    };
  }

  private assertChallengeAttempt(
    challengeAttemptData: FirestoreRecord | null,
    uid: string,
    lessonId: string,
    unitId: string,
  ): void {
    if (!challengeAttemptData) {
      throw new HttpsError('failed-precondition', 'Challenge attempt must be started before completion.');
    }

    if (this.readString(challengeAttemptData, ['uid']) !== uid) {
      throw new HttpsError('failed-precondition', 'Challenge attempt does not belong to the caller.');
    }

    if (this.readString(challengeAttemptData, ['lessonId']) !== lessonId) {
      throw new HttpsError('failed-precondition', 'Challenge attempt does not match the lesson.');
    }

    if (this.readString(challengeAttemptData, ['unitId']) !== unitId) {
      throw new HttpsError('failed-precondition', 'Challenge attempt does not match the unit.');
    }

    if (this.readString(challengeAttemptData, ['status']) !== 'started') {
      throw new HttpsError('failed-precondition', 'Challenge attempt is not in a completable state.');
    }
  }

  private assertExistingCompletionEventMatchesRequest(
    completionEventData: FirestoreRecord | null,
    uid: string,
    lessonId: string,
    unitId: string,
  ): void {
    if (!completionEventData) {
      throw new HttpsError('failed-precondition', 'Completion event payload is invalid.');
    }

    if (this.readString(completionEventData, ['uid']) !== uid) {
      throw new HttpsError('failed-precondition', 'Completion event collision detected for another user.');
    }

    if (this.readString(completionEventData, ['lessonId']) !== lessonId) {
      throw new HttpsError('failed-precondition', 'Completion event collision detected for another lesson.');
    }

    if (this.readString(completionEventData, ['unitId']) !== unitId) {
      throw new HttpsError('failed-precondition', 'Completion event collision detected for another unit.');
    }
  }

  private buildChallengeAttemptDocumentId(uid: string, unitId: string, lessonId: string): string {
    return `${uid}_${unitId}_${lessonId}`;
  }

  private buildCompletionEventDocumentId(uid: string, requestId: string): string {
    return `${uid}_${requestId}`;
  }

  private createStringSet(
    values: ReadonlyArray<string>,
    appendValue?: string | null,
  ): ReadonlyArray<string> {
    return [...new Set(appendValue ? [...values, appendValue] : values)];
  }

  private isPublishedCatalogDocument(document: LearningCatalogDocumentModel): boolean {
    if (!document.publishState) {
      return false;
    }

    const normalizedPublishState = document.publishState.toLowerCase();

    return normalizedPublishState === 'active'
      || normalizedPublishState === 'live'
      || normalizedPublishState === 'published';
  }

  private readNumber(record: FirestoreRecord | null, keys: ReadonlyArray<string>): number | null {
    for (const key of keys) {
      const value = record?.[key];

      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }
    }

    return null;
  }

  private readString(record: FirestoreRecord | null, keys: ReadonlyArray<string>): string | null {
    for (const key of keys) {
      const value = record?.[key];

      if (typeof value === 'string' && value.length > 0) {
        return value;
      }
    }

    return null;
  }

  private readStringArray(record: FirestoreRecord | null, key: string): ReadonlyArray<string> {
    const value = record?.[key];

    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  }

  private resolveCatalogDocument(
    documentId: string,
    data: DocumentData | undefined,
  ): LearningCatalogDocumentModel {
    const record = this.asRecord(data);

    return {
      id: documentId,
      order: this.readNumber(record, ['order', 'sequence', 'sortOrder']),
      parentId: this.readString(record, ['unitId', 'unitRef', 'chapterId', 'chapterRef', 'worldId', 'worldRef']),
      publishState: this.readString(record, ['publishState', 'status', 'state']),
      title: this.readString(record, ['title', 'label', 'name', 'displayName']),
    };
  }

  private resolveUpdatedMasteredUnitIds(
    masteredUnitIds: ReadonlyArray<string>,
    unitId: string,
    nextLessonId: string | null,
  ): ReadonlyArray<string> {
    if (nextLessonId) {
      return masteredUnitIds;
    }

    return this.createStringSet(masteredUnitIds, unitId);
  }

  private sortCatalogDocuments(
    documents: ReadonlyArray<LearningCatalogDocumentModel>,
  ): ReadonlyArray<LearningCatalogDocumentModel> {
    return [...documents].sort((left, right) => {
      const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return (left.title ?? left.id).localeCompare(right.title ?? right.id, 'en');
    });
  }

  private validateRequest(payload: CompleteLessonRequestModel): CompleteLessonRequestModel {
    if (!this.isNonEmptyString(payload.lessonId)) {
      throw new HttpsError('invalid-argument', 'Lesson id is required.');
    }

    if (!this.isNonEmptyString(payload.requestId)) {
      throw new HttpsError('invalid-argument', 'Request id is required.');
    }

    if (!this.isNonEmptyString(payload.unitId)) {
      throw new HttpsError('invalid-argument', 'Unit id is required.');
    }

    return payload;
  }

  private asRecord(value: unknown): FirestoreRecord | null {
    return typeof value === 'object' && value !== null ? (value as FirestoreRecord) : null;
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
  }
}
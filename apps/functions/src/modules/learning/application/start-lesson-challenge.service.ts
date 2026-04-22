import { FieldValue, type DocumentData } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';

import { getFirebaseAdminFirestore } from '../../../core/firestore/firebase-admin.app';
import type { LearningCatalogDocumentModel, StartLessonChallengeContextModel } from '../models/complete-lesson-catalog-context.model';
import type { StartLessonChallengeRequestModel } from '../models/start-lesson-challenge-request.model';
import type { StartLessonChallengeResponseModel } from '../models/start-lesson-challenge-response.model';

type FirestoreRecord = Record<string, unknown>;

const DEFAULT_SNAPSHOT_ID = 'default';

export class StartLessonChallengeService {
  private readonly firestore = getFirebaseAdminFirestore();

  public async start(
    uid: string,
    payload: StartLessonChallengeRequestModel,
  ): Promise<StartLessonChallengeResponseModel> {
    const request = this.validateRequest(payload);
    const challengeContext = await this.loadChallengeContext(request.unitId, request.lessonId);
    const progressionDocumentReference = this.firestore
      .collection('users')
      .doc(uid)
      .collection('progressionSnapshots')
      .doc(DEFAULT_SNAPSHOT_ID);
    const challengeAttemptDocumentReference = this.firestore
      .collection('lesson_challenge_attempts')
      .doc(this.buildChallengeAttemptDocumentId(uid, request.unitId, request.lessonId));

    return this.firestore.runTransaction(async (transaction) => {
      const [progressionDocument, challengeAttemptDocument] = await Promise.all([
        transaction.get(progressionDocumentReference),
        transaction.get(challengeAttemptDocumentReference),
      ]);
      const progressionData = this.asRecord(progressionDocument.data());

      this.assertChallengeStartPreconditions(
        progressionData,
        challengeContext,
        request.lessonId,
        request.unitId,
      );

      if (challengeAttemptDocument.exists) {
        const challengeAttemptData = this.asRecord(challengeAttemptDocument.data());

        if (this.readString(challengeAttemptData, ['status']) === 'started') {
          return {
            challengeId:
              this.readString(challengeAttemptData, ['challengeId']) ?? challengeContext.challengeId,
            lessonId: request.lessonId,
            status: 'already-started',
            unitId: request.unitId,
          };
        }

        throw new HttpsError(
          'failed-precondition',
          'Challenge attempt is no longer reusable for this lesson.',
        );
      }

      transaction.create(challengeAttemptDocumentReference, {
        challengeId: challengeContext.challengeId,
        createdAt: FieldValue.serverTimestamp(),
        lessonId: request.lessonId,
        status: 'started',
        uid,
        unitId: request.unitId,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        challengeId: challengeContext.challengeId,
        lessonId: request.lessonId,
        status: 'started',
        unitId: request.unitId,
      };
    });
  }

  private assertChallengeStartPreconditions(
    progressionData: FirestoreRecord | null,
    challengeContext: StartLessonChallengeContextModel,
    lessonId: string,
    unitId: string,
  ): void {
    if (!progressionData) {
      throw new HttpsError('failed-precondition', 'Progression snapshot is not ready for challenge start.');
    }

    const currentUnitId = this.readString(progressionData, ['currentUnitId']);

    if (!currentUnitId || currentUnitId !== unitId) {
      throw new HttpsError('failed-precondition', 'Challenge start is only allowed for the active unit.');
    }

    const currentLessonId = this.readString(progressionData, ['currentLessonId']);

    if (currentLessonId && currentLessonId !== lessonId) {
      throw new HttpsError('failed-precondition', 'Challenge start is only allowed for the active lesson.');
    }

    if (!currentLessonId && challengeContext.firstLessonId !== lessonId) {
      throw new HttpsError(
        'failed-precondition',
        'Challenge start requires the first published lesson when progression has no active lesson.',
      );
    }
  }

  private async loadChallengeContext(
    unitId: string,
    lessonId: string,
  ): Promise<StartLessonChallengeContextModel> {
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

    const unitLessons = await this.loadPublishedLessonsByUnitId(unitId);

    return {
      challengeId: this.resolveChallengeId(this.asRecord(lessonDocument.data()), lesson.id),
      firstLessonId: unitLessons[0]?.id ?? null,
      lesson,
      unit,
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
        .map((lessonSnapshot) => this.resolveCatalogDocument(lessonSnapshot.id, lessonSnapshot.data()))
        .filter((lesson) => this.isPublishedCatalogDocument(lesson)),
    );
  }

  private buildChallengeAttemptDocumentId(uid: string, unitId: string, lessonId: string): string {
    return `${uid}_${unitId}_${lessonId}`;
  }

  private resolveChallengeId(record: FirestoreRecord | null, lessonId: string): string {
    const challengeCandidates = [
      record?.challengeIds,
      record?.challengeTemplateIds,
      record?.challengeRefs,
      record?.challenges,
    ];

    for (const candidate of challengeCandidates) {
      const directIds = this.readStringArray(candidate);

      if (directIds.length > 0) {
        return directIds[0] ?? `${lessonId}-entry`;
      }

      if (!Array.isArray(candidate)) {
        continue;
      }

      const challengeIds = candidate
        .map((item) => this.asRecord(item))
        .map(
          (challengeRecord) =>
            this.readString(challengeRecord, ['id'])
            ?? this.readString(challengeRecord, ['ref'])
            ?? this.readString(challengeRecord, ['challengeId'])
            ?? this.readString(challengeRecord, ['challengeTemplateId'])
            ?? this.readString(challengeRecord, ['templateId']),
        )
        .filter((value): value is string => value !== null);

      if (challengeIds.length > 0) {
        return challengeIds[0] ?? `${lessonId}-entry`;
      }
    }

    return `${lessonId}-entry`;
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

  private readStringArray(value: unknown): ReadonlyArray<string> {
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string' && item.length > 0)
      : [];
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

  private validateRequest(payload: StartLessonChallengeRequestModel): StartLessonChallengeRequestModel {
    if (!this.isNonEmptyString(payload.lessonId)) {
      throw new HttpsError('invalid-argument', 'Lesson id is required.');
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
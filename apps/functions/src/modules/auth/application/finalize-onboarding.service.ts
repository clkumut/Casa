import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';

import { getFirebaseAdminFirestore } from '../../../core/firestore/firebase-admin.app';
import type { FinalizeOnboardingResponseModel } from '../models/finalize-onboarding-response.model';

type FirestoreRecord = Record<string, unknown>;

export class FinalizeOnboardingService {
  private readonly firestore = getFirebaseAdminFirestore();

  public async finalize(uid: string): Promise<FinalizeOnboardingResponseModel> {
    const userDocumentReference = this.firestore.collection('users').doc(uid);

    return this.firestore.runTransaction(async (transaction) => {
      const userDocument = await transaction.get(userDocumentReference);

      if (!userDocument.exists) {
        throw new HttpsError('failed-precondition', 'User onboarding draft was not found.');
      }

      const userData = userDocument.data();

      if (this.isOnboardingAlreadyComplete(userData)) {
        return {
          status: 'already-complete',
          uid,
        };
      }

      if (!this.hasRequiredOnboardingDraftFields(userData)) {
        throw new HttpsError('failed-precondition', 'Onboarding draft is incomplete.');
      }

      transaction.set(
        userDocumentReference,
        {
          onboardingCompletedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      return {
        status: 'completed',
        uid,
      };
    });
  }

  private hasRequiredOnboardingDraftFields(userData: FirestoreRecord | undefined): boolean {
    return this.isNonEmptyString(userData?.['goalCode'])
      && this.isNonEmptyString(userData?.['levelCode'])
      && this.isNonEmptyString(userData?.['habitCode'])
      && this.isNonEmptyString(userData?.['pathMode']);
  }

  private isOnboardingAlreadyComplete(userData: FirestoreRecord | undefined): boolean {
    return Boolean(userData?.['onboardingCompletedAt']);
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
  }
}
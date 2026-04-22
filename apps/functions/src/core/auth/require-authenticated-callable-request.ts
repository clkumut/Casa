import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';

export interface AuthenticatedCallableContextModel {
  readonly email: string | null;
  readonly uid: string;
}

export const requireAuthenticatedCallableContext = (
  request: CallableRequest<unknown>,
): AuthenticatedCallableContextModel => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Authentication is required.');
  }

  return {
    email: typeof request.auth.token.email === 'string' ? request.auth.token.email : null,
    uid: request.auth.uid,
  };
};
import type { IdTokenResult } from 'firebase/auth';

import type { CasaRole } from './models/auth-role.model';

const CLAIM_ROLES: ReadonlyArray<CasaRole> = [
  'learner',
  'opsPublisher',
  'opsReleaseManager',
  'platformAdmin',
];

/** Map Firebase custom claims into the Casa browser role model. */
export const resolveCasaRoles = (claims: IdTokenResult['claims']): ReadonlyArray<CasaRole> => {
  const resolvedRoles = new Set<CasaRole>(['learner']);

  for (const role of CLAIM_ROLES) {
    if (hasClaimRole(claims, role)) {
      resolvedRoles.add(role);
    }
  }

  return [...resolvedRoles];
};

const hasClaimRole = (claims: IdTokenResult['claims'], role: CasaRole): boolean => {
  if (claims[role] === true) {
    return true;
  }

  if (claims['role'] === role) {
    return true;
  }

  const roleList = claims['roles'];

  return Array.isArray(roleList) && roleList.includes(role);
};
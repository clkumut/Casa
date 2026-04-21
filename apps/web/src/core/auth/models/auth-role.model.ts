export type CasaRole =
  | 'anonymous'
  | 'learner'
  | 'opsPublisher'
  | 'opsReleaseManager'
  | 'platformAdmin';

export const OPS_ROLES: ReadonlyArray<CasaRole> = [
  'opsPublisher',
  'opsReleaseManager',
  'platformAdmin',
];
import type { FirebaseOptions } from 'firebase/app';

import type { RuntimeEnvironment } from './runtime-environment.model';

/** Firebase client options that are safe to expose to the browser runtime. */
export interface CasaFirebaseClientConfig extends FirebaseOptions {
  readonly apiKey: string;
  readonly appId: string;
  readonly authDomain: string;
  readonly messagingSenderId: string;
  readonly projectId: string;
  readonly storageBucket: string;
}

/** Runtime-scoped browser configuration resolved at application bootstrap. */
export interface CasaRuntimeConfigModel {
  readonly environment: RuntimeEnvironment;
  readonly firebase: CasaFirebaseClientConfig;
  readonly useEmulators: boolean;
}
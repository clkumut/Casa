import { computed, Injectable, signal } from '@angular/core';

import {
  EMPTY_RIGHT_RAIL_SNAPSHOT,
  type RightRailSnapshotModel,
} from './models/right-rail-snapshot.model';

export type RightRailStatus = 'idle' | 'loading' | 'ready' | 'error';

interface RightRailStateModel {
  readonly snapshot: RightRailSnapshotModel | null;
  readonly status: RightRailStatus;
}

const INITIAL_RIGHT_RAIL_STATE: RightRailStateModel = {
  snapshot: null,
  status: 'idle',
};

@Injectable({ providedIn: 'root' })
export class RightRailStore {
  private readonly rightRailState = signal<RightRailStateModel>(INITIAL_RIGHT_RAIL_STATE);

  public readonly snapshot = computed(
    () => this.rightRailState().snapshot ?? EMPTY_RIGHT_RAIL_SNAPSHOT,
  );
  public readonly state = this.rightRailState.asReadonly();
  public readonly status = computed(() => this.rightRailState().status);

  public reset(): void {
    this.rightRailState.set(INITIAL_RIGHT_RAIL_STATE);
  }

  public setError(): void {
    this.rightRailState.set({
      snapshot: null,
      status: 'error',
    });
  }

  public setLoading(): void {
    this.rightRailState.set({
      snapshot: this.rightRailState().snapshot,
      status: 'loading',
    });
  }

  public setReady(snapshot: RightRailSnapshotModel | null): void {
    this.rightRailState.set({
      snapshot,
      status: 'ready',
    });
  }
}
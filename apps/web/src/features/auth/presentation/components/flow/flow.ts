import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CASA_RUNTIME_CONFIG } from '../../../../../core/config/casa-runtime-config.token';
import { AuthSessionStore } from '../../../../../core/state/auth-session.store';
import type { AuthPageContentModel } from '../../../models/auth-page-content.model';

@Component({
  selector: 'casa-auth-flow-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './flow.html',
  styleUrl: './flow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFlowPageComponent {
  public readonly content = input.required<AuthPageContentModel>();

  protected readonly runtimeConfig = inject(CASA_RUNTIME_CONFIG);

  private readonly authSessionStore = inject(AuthSessionStore);

  protected readonly runtimeMode = computed(() =>
    this.runtimeConfig.useEmulators ? 'Emulator' : 'Firebase project',
  );

  protected readonly sessionLabel = computed(() => {
    const session = this.authSessionStore.session();

    if (session.status === 'hydrating') {
      return 'Hydrating';
    }

    return session.status === 'authenticated' ? 'Authenticated' : 'Guest';
  });

  protected readonly sessionEmail = computed(() => this.authSessionStore.session().email);
  protected readonly sessionRoles = computed(() =>
    this.authSessionStore
      .session()
      .roles.filter((role) => role !== 'anonymous'),
  );
}
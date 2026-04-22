import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CASA_RUNTIME_CONFIG } from '../../../../core/config/casa-runtime-config.token';
import { AuthSessionStore } from '../../../../core/state/auth-session.store';
import type { AuthPageContentModel } from '../../models/auth-page-content.model';

@Component({
  selector: 'casa-auth-flow-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <section class="auth-page-grid">
      <article class="page-panel auth-page-main">
        <span class="page-eyebrow">{{ content().eyebrow }}</span>
        <h2 class="page-title">{{ content().title }}</h2>
        <p class="page-description">{{ content().description }}</p>

        <section class="auth-checkpoints" aria-label="Auth flow checkpoints">
          <article class="auth-checkpoint" *ngFor="let checkpoint of content().checkpoints">
            <span class="auth-checkpoint-marker"></span>
            <span>{{ checkpoint }}</span>
          </article>
        </section>

        <div class="auth-actions" *ngIf="content().primaryAction || content().secondaryAction">
          <a
            *ngIf="content().primaryAction as primaryAction"
            class="auth-action auth-action-primary"
            [routerLink]="primaryAction.href"
          >
            {{ primaryAction.label }}
          </a>

          <a
            *ngIf="content().secondaryAction as secondaryAction"
            class="auth-action auth-action-secondary"
            [routerLink]="secondaryAction.href"
          >
            {{ secondaryAction.label }}
          </a>
        </div>

        <section class="auth-page-slot">
          <ng-content />
        </section>
      </article>

      <aside class="page-panel auth-page-status" aria-label="Auth session status">
        <span class="page-eyebrow">Runtime</span>
        <h3 class="auth-status-title">Firebase session bridge</h3>

        <dl class="auth-status-grid">
          <div>
            <dt>Environment</dt>
            <dd>{{ runtimeConfig.environment }}</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>{{ runtimeMode() }}</dd>
          </div>
          <div>
            <dt>Session</dt>
            <dd>{{ sessionLabel() }}</dd>
          </div>
          <div>
            <dt>Project</dt>
            <dd>{{ runtimeConfig.firebase.projectId }}</dd>
          </div>
        </dl>

        <div class="auth-session-note" *ngIf="sessionEmail() as email; else anonymousState">
          <span class="auth-status-chip">{{ email }}</span>
          <span class="auth-status-chip" *ngFor="let role of sessionRoles()">{{ role }}</span>
        </div>

        <ng-template #anonymousState>
          <p class="muted-text auth-status-copy">
            Hydration sonrasi kimliksiz durumda iseniz guest-only akislari gorursunuz.
          </p>
        </ng-template>
      </aside>
    </section>
  `,
  styles: `
    .auth-page-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: minmax(0, 1.6fr) minmax(280px, 360px);
    }

    .auth-page-main,
    .auth-page-status {
      display: grid;
      gap: 1.25rem;
    }

    .auth-checkpoints {
      display: grid;
      gap: 0.85rem;
    }

    .auth-checkpoint {
      align-items: center;
      background: var(--casa-surface-muted);
      border: 1px solid var(--casa-border);
      border-radius: 18px;
      display: grid;
      gap: 0.85rem;
      grid-template-columns: auto 1fr;
      padding: 0.95rem 1rem;
    }

    .auth-checkpoint-marker {
      background: linear-gradient(135deg, var(--casa-accent), #7bc8d6);
      border-radius: 999px;
      display: inline-block;
      height: 0.8rem;
      width: 0.8rem;
    }

    .auth-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      margin-top: 0.25rem;
    }

    .auth-page-slot {
      display: grid;
      gap: 1rem;
    }

    .auth-action {
      border-radius: 16px;
      font-weight: 700;
      padding: 0.95rem 1.15rem;
    }

    .auth-action-primary {
      background: var(--casa-ink);
      color: #ffffff;
    }

    .auth-action-secondary {
      background: transparent;
      border: 1px solid var(--casa-border);
      color: var(--casa-ink);
    }

    .auth-status-title {
      margin: 0;
    }

    .auth-status-grid {
      display: grid;
      gap: 0.9rem;
      margin: 0;
    }

    .auth-status-grid div {
      align-items: baseline;
      display: flex;
      gap: 0.65rem;
      justify-content: space-between;
    }

    .auth-status-grid dt {
      color: var(--casa-ink-soft);
      font-weight: 600;
    }

    .auth-status-grid dd {
      font-weight: 700;
      margin: 0;
      text-align: right;
    }

    .auth-session-note {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .auth-status-chip {
      background: rgba(15, 107, 129, 0.08);
      border: 1px solid rgba(15, 107, 129, 0.14);
      border-radius: 999px;
      font-size: 0.9rem;
      font-weight: 700;
      padding: 0.45rem 0.8rem;
    }

    .auth-status-copy {
      margin: 0;
    }

    @media (max-width: 980px) {
      .auth-page-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
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
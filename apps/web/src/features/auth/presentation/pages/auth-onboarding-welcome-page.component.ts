import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FirebaseAuthSessionService } from '../../../../core/auth/firebase-auth-session.service';
import { AuthSessionStore } from '../../../../core/state/auth-session.store';
import { OnboardingReadFacade } from '../../application/onboarding-read.facade';
import type { AuthPageContentModel } from '../../models/auth-page-content.model';
import { resolveOnboardingDraftSelection } from '../../models/onboarding-draft.model';
import { ONBOARDING_STEP_LABELS, ONBOARDING_STEP_SEQUENCE } from '../../models/onboarding-step-id.model';
import { AuthFlowPageComponent } from '../components/auth-flow-page.component';

const ONBOARDING_WELCOME_PAGE_CONTENT: AuthPageContentModel = {
  eyebrow: 'Onboarding',
  title: 'Hos geldin adimi hydrate edilmis session ile aciliyor',
  description:
    'Onboarding route zinciri artik auth guard ve progress guard ardindan feature-local read model ile ilerliyor.',
  checkpoints: [
    'Auth olmayan kullanici login sayfasina geri yonlendirilir.',
    'Onboarding tamamlanmis kullanici AppShell alanina tasinir.',
    'Draft profil ve onboarding catalog okumasi ayni facade uzerinde toplanir.',
  ],
  primaryAction: {
    href: '/auth/onboarding/goal',
    label: 'Goal adimina gec',
  },
  secondaryAction: {
    href: '/auth/login',
    label: 'Login sayfasina don',
  },
};

@Component({
  selector: 'casa-auth-onboarding-welcome-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AuthFlowPageComponent],
  template: `
    <casa-auth-flow-page [content]="content">
      <section class="welcome-summary">
        <article class="welcome-summary-card">
          <span class="welcome-summary-label">Oturum</span>
          <strong>{{ session().email ?? 'Anonim' }}</strong>
          <span class="muted-text">UID: {{ session().uid ?? 'bagli degil' }}</span>
        </article>

        <article class="welcome-summary-card">
          <span class="welcome-summary-label">Read model</span>
          <strong>{{ onboardingReadStatus() }}</strong>
          <span class="muted-text">Draft ve catalog ayni feature facade uzerinden izleniyor.</span>
        </article>
      </section>

      <section class="welcome-draft-grid">
        <a
          *ngFor="let item of draftSummary()"
          class="welcome-draft-card"
          [routerLink]="item.href"
        >
          <span class="welcome-summary-label">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <span class="muted-text">{{ item.caption }}</span>
        </a>
      </section>

      <section class="welcome-checklist">
        <h3>Siradaki onboarding baglari</h3>
        <ul>
          <li *ngFor="let item of checklist">{{ item }}</li>
        </ul>
      </section>

      <p class="welcome-note" *ngIf="onboardingReadStatus() === 'loading'">
        Kullanici draft belgesi ve catalog_onboarding_options verileri okunuyor.
      </p>

      <p class="welcome-note" *ngIf="onboardingReadStatus() === 'error'">
        Onboarding read modeli su an cozulmedi; Firestore baglantisini dogrulayin.
      </p>

      <p class="welcome-note" *ngIf="!canFinalize() && onboardingReadStatus() === 'ready'">
        Finalize adimi, tum onboarding secimleri draft belgede doldugunda acilacak.
      </p>

      <p class="welcome-note welcome-note-error" *ngIf="commandError() as commandError">
        {{ commandError }}
      </p>

      <div class="welcome-actions">
        <button
          type="button"
          [disabled]="!canFinalize() || isFinalizing()"
          (click)="finalizeOnboarding()"
        >
          {{ finalizeButtonLabel() }}
        </button>
        <button type="button" (click)="signOut()">Oturumu kapat</button>
        <a routerLink="/auth/onboarding/goal">Goal adimina gec</a>
      </div>
    </casa-auth-flow-page>
  `,
  styles: [
    `
      .welcome-summary {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .welcome-summary-card {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 18px;
        display: grid;
        gap: 0.35rem;
        padding: 1rem 1.1rem;
      }

      .welcome-summary-label {
        color: var(--casa-ink-soft);
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      .welcome-checklist h3 {
        margin: 0 0 0.75rem;
      }

      .welcome-draft-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .welcome-draft-card {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 18px;
        color: inherit;
        display: grid;
        gap: 0.35rem;
        padding: 1rem 1.1rem;
        text-decoration: none;
      }

      .welcome-checklist ul {
        color: var(--casa-ink-soft);
        display: grid;
        gap: 0.5rem;
        margin: 0;
        padding-left: 1.1rem;
      }

      .welcome-note {
        color: var(--casa-ink-soft);
        margin: 0;
      }

      .welcome-note-error {
        color: #a33d2d;
      }

      .welcome-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
      }

      .welcome-actions button {
        background: transparent;
        border: 1px solid var(--casa-border);
        border-radius: 999px;
        color: var(--casa-ink);
        cursor: pointer;
        font-weight: 700;
        min-height: 3rem;
        padding: 0 1.25rem;
      }

      .welcome-actions button:disabled {
        cursor: wait;
        opacity: 0.6;
      }

      @media (max-width: 720px) {
        .welcome-summary,
        .welcome-draft-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthOnboardingWelcomePageComponent {
  private readonly firebaseAuthSessionService = inject(FirebaseAuthSessionService);
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly onboardingReadFacade = inject(OnboardingReadFacade);
  private readonly router = inject(Router);

  protected readonly canFinalize = this.onboardingReadFacade.canFinalize;
  protected readonly commandError = this.onboardingReadFacade.commandError;
  protected readonly content = ONBOARDING_WELCOME_PAGE_CONTENT;
  protected readonly finalizeButtonLabel = computed(() =>
    this.isFinalizing() ? 'Onboarding tamamlanıyor' : 'Onboardingi tamamla',
  );
  protected readonly isFinalizing = this.onboardingReadFacade.isFinalizing;
  protected readonly session = this.authSessionStore.session;
  protected readonly onboardingReadStatus = this.onboardingReadFacade.status;
  protected readonly checklist = [
    'Finalize callable yanitinin smoke test ile dogrulanmasi',
    'Onboarding sonrasi ilk app bootstrap projection baglantisi',
    'Display name ve visibility gibi kalan self-service alanlarin baglanmasi',
  ];
  protected readonly draftSummary = computed(() => {
    const onboardingDraft = this.onboardingReadFacade.draft();

    return ONBOARDING_STEP_SEQUENCE.map((step) => {
      const code = resolveOnboardingDraftSelection(onboardingDraft, step);

      return {
        href: `/auth/onboarding/${step}`,
        label: ONBOARDING_STEP_LABELS[step],
        value: code ?? 'Henuz secim yok',
        caption: code ? `Kayitli kod: ${code}` : 'Draft kullanici belgesinden henuz deger gelmedi.',
      };
    });
  });

  protected async finalizeOnboarding(): Promise<void> {
    try {
      await this.onboardingReadFacade.finalizeOnboarding();
      await this.router.navigateByUrl('/app/learn');
    } catch {
      // Command error state is already surfaced by the facade.
    }
  }

  protected async signOut(): Promise<void> {
    await this.firebaseAuthSessionService.signOut();
  }
}
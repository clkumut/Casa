import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OnboardingReadFacade } from '../../application/onboarding-read.facade';
import type { AuthPageContentModel } from '../../models/auth-page-content.model';
import { resolveOnboardingDraftSelection } from '../../models/onboarding-draft.model';
import type { OnboardingOptionModel } from '../../models/onboarding-option.model';
import {
  ONBOARDING_STEP_LABELS,
  type OnboardingStepId,
} from '../../models/onboarding-step-id.model';
import { AuthFlowPageComponent } from '../components/auth-flow-page.component';

interface OnboardingStepViewModel {
  readonly title: string;
  readonly description: string;
  readonly checkpoints: ReadonlyArray<string>;
  readonly previousHref: string;
  readonly nextHref: string;
}

const ONBOARDING_STEP_VIEW: Readonly<Record<OnboardingStepId, OnboardingStepViewModel>> = {
  goal: {
    title: 'Ogrenme hedefi secimi',
    description: 'Goal catalog okumasi ile kullanicinin mevcut draft hedefi ayni ekranda gorunur.',
    checkpoints: [
      'Catalog okunur ve hedef secenekleri feature icinde render edilir.',
      'Secilen hedef self-write siniri icinde kullanici belgesine kaydedilir.',
      'Mevcut draft secimi user snapshot alanindan gorulur.',
    ],
    previousHref: '/auth/onboarding/welcome',
    nextHref: '/auth/onboarding/level',
  },
  level: {
    title: 'Baslangic seviye hizalama',
    description: 'Level adimi catalog read modeline baglanir ve mevcut draft secimi gorunur.',
    checkpoints: [
      'Level secenekleri feature repository uzerinden okunur.',
      'Varsa level draft kodu secili durum olarak yansir.',
      'Eksik schema durumunda ekran bos yerine toleransli okunur.',
    ],
    previousHref: '/auth/onboarding/goal',
    nextHref: '/auth/onboarding/habit',
  },
  habit: {
    title: 'Gunluk ritim secimi',
    description: 'Habit catalog ve kullanici draft degeri tek read model uzerinden gorulur.',
    checkpoints: [
      'Habit secenekleri catalog koleksiyonundan okunur.',
      'Mevcut draft ritmi secili kart ile ayristirilir.',
      'Self-write kaydi sonraki adima gecis oncesi uygulanir.',
    ],
    previousHref: '/auth/onboarding/level',
    nextHref: '/auth/onboarding/path',
  },
  path: {
    title: 'Ogrenme yolu atamasi',
    description: 'Path mode bilgisi ve katalog secenekleri finalize oncesi okunur.',
    checkpoints: [
      'Path secenekleri catalog uzerinden gelir.',
      'User snapshot icindeki path draft degeri secili olarak gorulur.',
      'Tum secimler tamamlandiginda summary ekraninda finalize acilir.',
    ],
    previousHref: '/auth/onboarding/habit',
    nextHref: '/auth/onboarding/welcome',
  },
};

@Component({
  selector: 'casa-auth-onboarding-step-page',
  standalone: true,
  imports: [NgFor, NgIf, AuthFlowPageComponent],
  template: `
    <casa-auth-flow-page [content]="content">
      <section class="step-summary-grid">
        <article class="step-summary-card">
          <span class="step-summary-label">Read status</span>
          <strong>{{ readStatus() }}</strong>
          <span class="muted-text">Draft ve catalog ayni facade uzerinden tasiniyor.</span>
        </article>

        <article class="step-summary-card">
          <span class="step-summary-label">Mevcut secim</span>
          <strong>{{ selectedTitle() }}</strong>
          <span class="muted-text">Kod: {{ selectedCode() ?? 'atanmadi' }}</span>
        </article>
      </section>

      <p class="step-note" *ngIf="readStatus() === 'loading'">
        Onboarding catalog ve kullanici draft snapshot'i yukleniyor.
      </p>

      <p class="step-note" *ngIf="activeSaveStep() === step">
        Secim kaydediliyor ve sonraki onboarding adimina gecis hazirlaniyor.
      </p>

      <p class="step-note step-note-error" *ngIf="readStatus() === 'error'">
        Read model su an cozulmedi. Firestore baglantisi ve emulator durumunu dogrulayin.
      </p>

      <p class="step-note step-note-error" *ngIf="commandError() as commandError">
        {{ commandError }}
      </p>

      <section class="step-option-grid" *ngIf="options().length > 0; else emptyOptionsState">
        <article
          *ngFor="let option of options()"
          class="step-option-card"
          [class.is-selected]="option.code === selectedCode()"
        >
          <span class="step-option-code">{{ option.code }}</span>
          <h3>{{ option.title }}</h3>
          <p class="muted-text" *ngIf="option.description">{{ option.description }}</p>
          <span class="step-option-state">
            {{ option.code === selectedCode() ? 'Mevcut draft secimi' : 'Catalog secenegi' }}
          </span>
          <button
            type="button"
            class="step-option-action"
            [disabled]="readStatus() !== 'ready' || activeSaveStep() === step"
            (click)="selectOption(option)"
          >
            {{ option.code === selectedCode() ? 'Secimi tekrar kaydet' : 'Bu secenegi kaydet' }}
          </button>
        </article>
      </section>

      <ng-template #emptyOptionsState>
        <section class="step-empty-state">
          <h3>{{ stepLabel }} catalog verisi bekliyor</h3>
          <p class="muted-text">
            catalog_onboarding_options read modeli baglandi; bu step icin veri geldikce kartlar otomatik acilacak.
          </p>
        </section>
      </ng-template>
    </casa-auth-flow-page>
  `,
  styles: [
    `
      .step-summary-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .step-summary-card,
      .step-option-card,
      .step-empty-state {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 18px;
        display: grid;
        gap: 0.5rem;
        padding: 1rem 1.1rem;
      }

      .step-summary-label,
      .step-option-code,
      .step-option-state {
        color: var(--casa-ink-soft);
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      .step-note {
        color: var(--casa-ink-soft);
        margin: 0;
      }

      .step-note-error {
        color: #a33d2d;
      }

      .step-option-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .step-option-card.is-selected {
        border-color: rgba(15, 107, 129, 0.36);
        box-shadow: 0 0 0 1px rgba(15, 107, 129, 0.12);
      }

      .step-option-action {
        background: transparent;
        border: 1px solid var(--casa-border);
        border-radius: 999px;
        color: var(--casa-ink);
        cursor: pointer;
        font-weight: 700;
        min-height: 2.85rem;
        padding: 0 1rem;
      }

      .step-option-action:disabled {
        cursor: wait;
        opacity: 0.6;
      }

      .step-option-card h3,
      .step-empty-state h3 {
        margin: 0;
      }

      @media (max-width: 720px) {
        .step-summary-grid,
        .step-option-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthOnboardingStepPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly onboardingReadFacade = inject(OnboardingReadFacade);

  protected readonly activeSaveStep = this.onboardingReadFacade.activeSaveStep;
  protected readonly commandError = this.onboardingReadFacade.commandError;
  protected readonly step = this.activatedRoute.snapshot.data['step'] as OnboardingStepId;
  protected readonly stepLabel = ONBOARDING_STEP_LABELS[this.step];
  protected readonly readStatus = this.onboardingReadFacade.status;
  protected readonly selectedCode = computed(() =>
    resolveOnboardingDraftSelection(this.onboardingReadFacade.draft(), this.step),
  );
  protected readonly options = computed(() => this.onboardingReadFacade.catalog()[this.step]);
  protected readonly selectedTitle = computed(() => {
    const option = this.options().find((candidate) => candidate.code === this.selectedCode());

    return option?.title ?? 'Henuz secim yok';
  });
  protected readonly content: AuthPageContentModel = this.createPageContent();

  protected async selectOption(option: OnboardingOptionModel): Promise<void> {
    try {
      await this.onboardingReadFacade.saveSelection(this.step, option.code);
      await this.router.navigateByUrl(ONBOARDING_STEP_VIEW[this.step].nextHref);
    } catch {
      // Command error state is already surfaced by the facade.
    }
  }

  private createPageContent(): AuthPageContentModel {
    const view = ONBOARDING_STEP_VIEW[this.step];

    return {
      eyebrow: `Onboarding / ${this.stepLabel}`,
      title: view.title,
      description: view.description,
      checkpoints: view.checkpoints,
      primaryAction: {
        href: view.nextHref,
        label: view.nextHref === '/auth/onboarding/welcome' ? 'Ozete don' : 'Sonraki adim',
      },
      secondaryAction: {
        href: view.previousHref,
        label: 'Geri don',
      },
    };
  }
}
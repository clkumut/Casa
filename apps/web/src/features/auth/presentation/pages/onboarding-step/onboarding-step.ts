import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OnboardingReadFacade } from '../../../application/onboarding-read.facade';
import type { AuthPageContentModel } from '../../../models/auth-page-content.model';
import { resolveOnboardingDraftSelection } from '../../../models/onboarding-draft.model';
import type { OnboardingOptionModel } from '../../../models/onboarding-option.model';
import {
  ONBOARDING_STEP_LABELS,
  type OnboardingStepId,
} from '../../../models/onboarding-step-id.model';
import { AuthFlowPageComponent } from '../../components/flow/flow';

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
  templateUrl: './onboarding-step.html',
  styleUrl: './onboarding-step.scss',
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
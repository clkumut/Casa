import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FirebaseAuthSessionService } from '../../../../../core/auth/firebase-auth-session.service';
import { AuthSessionStore } from '../../../../../core/state/auth-session.store';
import { OnboardingReadFacade } from '../../../application/onboarding-read.facade';
import type { AuthPageContentModel } from '../../../models/auth-page-content.model';
import { resolveOnboardingDraftSelection } from '../../../models/onboarding-draft.model';
import { ONBOARDING_STEP_LABELS, ONBOARDING_STEP_SEQUENCE } from '../../../models/onboarding-step-id.model';
import { AuthFlowPageComponent } from '../../components/flow/flow';

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
  templateUrl: './onboarding-welcome.html',
  styleUrl: './onboarding-welcome.scss',
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
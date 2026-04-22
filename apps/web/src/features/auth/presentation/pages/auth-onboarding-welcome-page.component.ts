import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FirebaseAuthSessionService } from '../../../../core/auth/firebase-auth-session.service';
import { AuthSessionStore } from '../../../../core/state/auth-session.store';
import type { AuthPageContentModel } from '../../models/auth-page-content.model';
import { AuthFlowPageComponent } from '../components/auth-flow-page.component';

const ONBOARDING_WELCOME_PAGE_CONTENT: AuthPageContentModel = {
  eyebrow: 'Onboarding',
  title: 'Hos geldin adimi hydrate edilmis session ile aciliyor',
  description:
    'Onboarding route zinciri artik auth guard ve progress guard ardindan gercek feature komponentini render ediyor.',
  checkpoints: [
    'Auth olmayan kullanici login sayfasina geri yonlendirilir.',
    'Onboarding tamamlanmis kullanici AppShell alanina tasinir.',
    "Eksik profil snapshot baglantisi sonraki application slice'ta eklenecek.",
  ],
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
          <span class="welcome-summary-label">Onboarding</span>
          <strong>{{ session().onboardingStatus }}</strong>
          <span class="muted-text">Tamamlama baglantisi sonraki projection slice'inda acilacak.</span>
        </article>
      </section>

      <section class="welcome-checklist">
        <h3>Siradaki onboarding baglari</h3>
        <ul>
          <li *ngFor="let item of checklist">{{ item }}</li>
        </ul>
      </section>

      <p class="welcome-note" *ngIf="session().onboardingStatus === 'required'">
        AppShell girisi henuz bilincli olarak kapali tutuluyor; once snapshot tamamlanma durumu baglanacak.
      </p>

      <div class="welcome-actions">
        <button type="button" (click)="signOut()">Oturumu kapat</button>
        <a routerLink="/auth/login">Login sayfasina don</a>
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

      @media (max-width: 720px) {
        .welcome-summary {
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

  protected readonly content = ONBOARDING_WELCOME_PAGE_CONTENT;
  protected readonly session = this.authSessionStore.session;
  protected readonly checklist = [
    'Kullanici onboarding snapshot kontrati ve projection read modeli',
    'Onboarding ilerleme yazimlari icin trusted write siniri',
    'Onboarding complete durumunun guard ile senkron kapanisi',
  ];

  protected async signOut(): Promise<void> {
    await this.firebaseAuthSessionService.signOut();
  }
}
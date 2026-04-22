import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FirebaseAuthSessionService } from '../../../../core/auth/firebase-auth-session.service';
import type { AuthPageContentModel } from '../../models/auth-page-content.model';
import { AuthFlowPageComponent } from '../components/auth-flow-page.component';

const LOGIN_PAGE_CONTENT: AuthPageContentModel = {
  eyebrow: 'Login',
  title: 'Giris akis omurgasi hazir',
  description:
    'Firebase Auth session hidrasyonu ve guest-only guard artik login yuzeyini gercek feature sahipligine tasiyor.',
  checkpoints: [
    'Guest-only route kontrolu cekirdek guard ailesiyle calisiyor.',
    'Firebase browser runtime config local ortamda emulator fallback ile aciliyor.',
    'Kimlik durumu feature yuzeyinde gozlenebilir hale geldi.',
  ],
  primaryAction: {
    href: '/auth/register',
    label: 'Kayit akisina git',
  },
  secondaryAction: {
    href: '/',
    label: 'Public alana don',
  },
};

@Component({
  selector: 'casa-auth-login-page',
  standalone: true,
  imports: [NgIf, RouterLink, AuthFlowPageComponent],
  template: `
    <casa-auth-flow-page [content]="content">
      <form class="auth-form" (submit)="signIn($event)">
        <label class="auth-field">
          <span>E-posta</span>
          <input type="email" [value]="email()" (input)="updateEmail($event)" autocomplete="email" />
        </label>

        <label class="auth-field">
          <span>Sifre</span>
          <input
            type="password"
            [value]="password()"
            (input)="updatePassword($event)"
            autocomplete="current-password"
          />
        </label>

        <p *ngIf="errorMessage()" class="auth-error">{{ errorMessage() }}</p>

        <div class="auth-form-actions">
          <button type="submit" [disabled]="isBusy()">{{ isBusy() ? 'Giris aciliyor...' : 'Giris yap' }}</button>
          <a routerLink="/auth/register">Yeni hesap olustur</a>
        </div>
      </form>
    </casa-auth-flow-page>
  `,
  styles: [
    `
      .auth-form {
        display: grid;
        gap: 1rem;
      }

      .auth-field {
        color: var(--casa-ink-soft);
        display: grid;
        gap: 0.45rem;
        font-weight: 600;
      }

      .auth-field input {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 14px;
        color: var(--casa-ink);
        min-height: 3rem;
        padding: 0.85rem 1rem;
      }

      .auth-error {
        background: rgba(169, 52, 52, 0.08);
        border: 1px solid rgba(169, 52, 52, 0.18);
        border-radius: 14px;
        color: #8a2434;
        margin: 0;
        padding: 0.9rem 1rem;
      }

      .auth-form-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
      }

      .auth-form-actions button {
        background: var(--casa-ink);
        border: 0;
        border-radius: 999px;
        color: #ffffff;
        cursor: pointer;
        font-weight: 700;
        min-height: 3rem;
        padding: 0 1.25rem;
      }

      .auth-form-actions button[disabled] {
        cursor: progress;
        opacity: 0.7;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginPageComponent {
  private readonly firebaseAuthSessionService = inject(FirebaseAuthSessionService);

  protected readonly content = LOGIN_PAGE_CONTENT;

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isBusy = signal(false);
  protected readonly errorMessage = signal('');

  protected updateEmail(event: Event): void {
    this.email.set(readInputValue(event));
  }

  protected updatePassword(event: Event): void {
    this.password.set(readInputValue(event));
  }

  protected async signIn(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.email().trim() || !this.password().trim()) {
      this.errorMessage.set('E-posta ve sifre zorunludur.');
      return;
    }

    this.isBusy.set(true);

    try {
      await this.firebaseAuthSessionService.signInWithEmailPassword(this.email().trim(), this.password());
    } catch {
      this.errorMessage.set('Giris tamamlanamadi. Bilgileri veya Firebase Auth baglantisini kontrol edin.');
    } finally {
      this.isBusy.set(false);
    }
  }
}

const readInputValue = (event: Event): string => {
  const inputElement = event.target;

  return inputElement instanceof HTMLInputElement ? inputElement.value : '';
};
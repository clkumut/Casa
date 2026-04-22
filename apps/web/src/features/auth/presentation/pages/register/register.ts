import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FirebaseAuthSessionService } from '../../../../../core/auth/firebase-auth-session.service';
import type { AuthPageContentModel } from '../../../models/auth-page-content.model';
import { AuthFlowPageComponent } from '../../components/flow/flow';

const REGISTER_PAGE_CONTENT: AuthPageContentModel = {
  eyebrow: 'Register',
  title: 'Kayit akisi feature alanina tasindi',
  description:
    "Register route artik app placeholder yerine auth feature ailesi tarafindan sunuluyor ve bir sonraki form slice'i icin hazir.",
  checkpoints: [
    'Feature sahipligi `features/auth/presentation/pages` altina alindi.',
    'Route composition guest-only guard ile korunuyor.',
    'Browser runtime config ve auth session bridge ayni yuzeyde izleniyor.',
  ],
  primaryAction: {
    href: '/auth/login',
    label: 'Giris akisina gec',
  },
  secondaryAction: {
    href: '/',
    label: 'Landing sayfasina don',
  },
};

@Component({
  selector: 'casa-auth-register-page',
  standalone: true,
  imports: [NgIf, RouterLink, AuthFlowPageComponent],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthRegisterPageComponent {
  private readonly firebaseAuthSessionService = inject(FirebaseAuthSessionService);

  protected readonly content = REGISTER_PAGE_CONTENT;

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly isBusy = signal(false);
  protected readonly errorMessage = signal('');

  protected updateEmail(event: Event): void {
    this.email.set(readInputValue(event));
  }

  protected updatePassword(event: Event): void {
    this.password.set(readInputValue(event));
  }

  protected updateConfirmPassword(event: Event): void {
    this.confirmPassword.set(readInputValue(event));
  }

  protected async register(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.email().trim() || !this.password().trim()) {
      this.errorMessage.set('E-posta ve sifre zorunludur.');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Sifre tekrar alani eslesmelidir.');
      return;
    }

    this.isBusy.set(true);

    try {
      await this.firebaseAuthSessionService.registerWithEmailPassword(
        this.email().trim(),
        this.password(),
      );
    } catch {
      this.errorMessage.set('Kayit olusturulamadi. Firebase Auth baglantisini kontrol edin.');
    } finally {
      this.isBusy.set(false);
    }
  }
}

const readInputValue = (event: Event): string => {
  const inputElement = event.target;

  return inputElement instanceof HTMLInputElement ? inputElement.value : '';
};
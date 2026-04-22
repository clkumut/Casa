import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FirebaseAuthSessionService } from '../../../../../core/auth/firebase-auth-session.service';
import type { AuthPageContentModel } from '../../../models/auth-page-content.model';
import { AuthFlowPageComponent } from '../../components/flow/flow';

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
  templateUrl: './login.html',
  styleUrl: './login.scss',
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
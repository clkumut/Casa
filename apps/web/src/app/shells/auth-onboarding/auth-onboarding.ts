import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { OnboardingReadFacade } from '../../../features/auth/application/onboarding-read.facade';

@Component({
  selector: 'casa-auth-onboarding-shell',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
  providers: [OnboardingReadFacade],
  templateUrl: './auth-onboarding.html',
  styleUrl: './auth-onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthOnboardingShellComponent {
  public readonly navigationItems: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: '/auth/login', label: 'Giris' },
    { href: '/auth/register', label: 'Kayit' },
    { href: '/auth/onboarding/welcome', label: 'Welcome' },
    { href: '/auth/onboarding/goal', label: 'Goal' },
    { href: '/auth/onboarding/level', label: 'Level' },
    { href: '/auth/onboarding/habit', label: 'Habit' },
    { href: '/auth/onboarding/path', label: 'Path' },
  ];
}
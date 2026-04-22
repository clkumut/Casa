import type { Route, Routes } from '@angular/router';

import { authGuard } from '../core/guards/auth.guard';
import { appReadinessResolver } from '../core/guards/app-readiness.resolver';
import { guestOnlyGuard } from '../core/guards/guest-only.guard';
import { onboardingCompleteGuard } from '../core/guards/onboarding-complete.guard';
import { onboardingProgressGuard } from '../core/guards/onboarding-progress.guard';
import { opsRoleGuard } from '../core/guards/ops-role.guard';
import { AuthLoginPageComponent } from '../features/auth/presentation/pages/auth-login-page.component';
import { AuthOnboardingStepPageComponent } from '../features/auth/presentation/pages/auth-onboarding-step-page.component';
import { AuthOnboardingWelcomePageComponent } from '../features/auth/presentation/pages/auth-onboarding-welcome-page.component';
import { AuthRegisterPageComponent } from '../features/auth/presentation/pages/auth-register-page.component';
import type { OnboardingStepId } from '../features/auth/models/onboarding-step-id.model';
import { AppShellComponent } from './shells/app-shell.component';
import { AuthOnboardingShellComponent } from './shells/auth-onboarding-shell.component';
import { OpsShellComponent } from './shells/ops-shell.component';
import { PublicShellComponent } from './shells/public-shell.component';
import { PlaceholderPageComponent } from './routes/placeholder-page.component';

const createPlaceholderRoute = (
  path: string,
  title: string,
  description: string,
  overrides: Partial<Route> = {},
): Route => ({
  path,
  component: PlaceholderPageComponent,
  data: {
    title,
    description,
  },
  ...overrides,
});

const createOnboardingStepRoute = (step: OnboardingStepId): Route => ({
  path: step,
  component: AuthOnboardingStepPageComponent,
  data: {
    step,
  },
});

export const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      createPlaceholderRoute(
        '',
        'Casa V1 Public Landing',
        'Public shell icinde calisacak acilis, bilgilendirme ve yonlendirme yuzeyi icin placeholder sayfa.',
      ),
    ],
  },
  {
    path: 'auth',
    component: AuthOnboardingShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        component: AuthLoginPageComponent,
        canActivate: [guestOnlyGuard],
      },
      {
        path: 'register',
        component: AuthRegisterPageComponent,
        canActivate: [guestOnlyGuard],
      },
      {
        path: 'onboarding',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'welcome',
          },
          {
            path: 'welcome',
            component: AuthOnboardingWelcomePageComponent,
          },
          createOnboardingStepRoute('goal'),
          createOnboardingStepRoute('level'),
          createOnboardingStepRoute('habit'),
          createOnboardingStepRoute('path'),
        ],
        canActivate: [authGuard, onboardingProgressGuard],
      },
    ],
  },
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard, onboardingCompleteGuard],
    resolve: {
      appReady: appReadinessResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'learn',
      },
      createPlaceholderRoute(
        'learn',
        'Ogrenme Haritasi',
        'Dunya, unit ve ilerleme projection alanlarini barindiracak app route placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'elifba',
        'Elifba',
        'Harf kartlari ve RTL ogrenme akisi icin ayrilan placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'practice',
        'Pratik',
        'Tekrar ve recovery loop arayuzu icin ayrilan placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'leaderboard',
        'Liderlik Tablosu',
        'League ve leaderboard projection verilerinin gosterilecegi placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'quests',
        'Gorevler',
        'Quest listeleme ve claim akislari icin ayrilan placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'shop',
        'Magaza',
        'Gems ekonomisi ve item unlock akislarinin gelecegi placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'profile',
        'Profil',
        'Kullanici snapshot, sosyal durum ve rozet sunumu icin placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'more/settings',
        'Ayarlar',
        'Kullanici tercihleri ve kontrol merkezinin gelecegi placeholder sayfa.',
      ),
    ],
  },
  {
    path: 'ops',
    component: OpsShellComponent,
    canActivate: [authGuard, opsRoleGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'content',
      },
      createPlaceholderRoute(
        'content',
        'Icerik Operasyonlari',
        'Publish, kontrol ve icerik akislarinin gelecegi ops placeholder sayfa.',
      ),
      createPlaceholderRoute(
        'release',
        'Release Operasyonlari',
        'Release evidence ve gate takip akislarinin gelecegi ops placeholder sayfa.',
      ),
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
import type { Route, Routes } from '@angular/router';

import { authGuard } from '../core/guards/auth.guard';
import { guestOnlyGuard } from '../core/guards/guest-only.guard';
import { onboardingCompleteGuard } from '../core/guards/onboarding-complete.guard';
import { onboardingProgressGuard } from '../core/guards/onboarding-progress.guard';
import { opsRoleGuard } from '../core/guards/ops-role.guard';
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
      createPlaceholderRoute(
        'login',
        'Giris',
        'Guest-only akisi icin kullanilacak giris sayfasinin shell placeholder surumu.',
        {
          canActivate: [guestOnlyGuard],
        },
      ),
      createPlaceholderRoute(
        'register',
        'Kayit',
        'Yeni kullanici kaydi ve ilk adim yonlendirmeleri icin placeholder sayfa.',
        {
          canActivate: [guestOnlyGuard],
        },
      ),
      {
        path: 'onboarding',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'welcome',
          },
          createPlaceholderRoute(
            'welcome',
            'Onboarding Hos Geldin',
            'Onboarding ilerleme akisinin welcome adimi icin shell placeholder sayfa.',
          ),
        ],
        canActivate: [authGuard, onboardingProgressGuard],
      },
    ],
  },
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard, onboardingCompleteGuard],
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
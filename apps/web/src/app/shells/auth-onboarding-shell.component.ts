import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'casa-auth-onboarding-shell',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="auth-shell">
      <aside class="auth-sidebar page-panel">
        <p class="page-eyebrow">Auth Shell</p>
        <h1>Kimlik ve onboarding akisi</h1>
        <p class="muted-text">
          Guest-only ve onboarding route gruplari bu alanda izole edilir.
        </p>

        <nav aria-label="Auth navigation">
          <a
            *ngFor="let item of navigationItems"
            class="shell-link"
            [routerLink]="item.href"
            routerLinkActive="is-active"
          >
            {{ item.label }}
          </a>
        </nav>
      </aside>

      <main class="auth-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .auth-shell {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
        margin: 0 auto;
        max-width: 1180px;
        min-height: 100vh;
        padding: 2rem;
      }

      .auth-sidebar {
        align-self: start;
        display: grid;
        gap: 1rem;
      }

      .auth-sidebar h1 {
        margin: 0;
      }

      nav {
        display: grid;
        gap: 0.75rem;
      }

      .auth-content {
        align-self: center;
      }

      @media (max-width: 900px) {
        .auth-shell {
          grid-template-columns: 1fr;
          min-height: auto;
          padding: 1rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthOnboardingShellComponent {
  public readonly navigationItems: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: '/auth/login', label: 'Giris' },
    { href: '/auth/register', label: 'Kayit' },
    { href: '/auth/onboarding/welcome', label: 'Welcome' },
  ];
}
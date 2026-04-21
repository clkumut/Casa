import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'casa-public-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="public-shell">
      <header class="public-header">
        <div>
          <p class="shell-kicker">Casa V1</p>
          <h1>Workspace shell scaffold</h1>
        </div>
        <nav class="public-nav" aria-label="Public navigation">
          <a class="shell-link" routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }">Ana Sayfa</a>
          <a class="shell-link" routerLink="/auth/login" routerLinkActive="is-active">Giris</a>
          <a class="shell-link" routerLink="/auth/register" routerLinkActive="is-active">Kayit</a>
        </nav>
      </header>

      <main class="public-body">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .public-shell {
        display: grid;
        gap: 2rem;
        margin: 0 auto;
        max-width: 1180px;
        min-height: 100vh;
        padding: 2rem;
      }

      .public-header {
        align-items: center;
        display: flex;
        gap: 1.5rem;
        justify-content: space-between;
      }

      .shell-kicker {
        color: var(--casa-accent);
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        margin: 0 0 0.4rem;
        text-transform: uppercase;
      }

      h1 {
        font-size: clamp(1.8rem, 3vw, 2.8rem);
        margin: 0;
      }

      .public-nav {
        display: flex;
        gap: 0.75rem;
      }

      .public-body {
        display: block;
      }

      @media (max-width: 900px) {
        .public-shell {
          padding: 1rem;
        }

        .public-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .public-nav {
          flex-wrap: wrap;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicShellComponent {}
import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'casa-app-shell',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-shell">
      <aside class="left-rail page-panel">
        <div>
          <p class="page-eyebrow">App Shell</p>
          <h1>Casa authenticated workspace</h1>
          <p class="muted-text">
            Sidebar, merkez icerik ve sag sabit bilgi alani contract'i burada tutulur.
          </p>
        </div>

        <nav aria-label="Application navigation">
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

      <main class="center-stage">
        <router-outlet></router-outlet>
      </main>

      <aside class="right-rail page-panel">
        <div>
          <p class="page-eyebrow">Right Rail</p>
          <h2>Ozet metrikleri</h2>
          <p class="muted-text">
            XP, Streak, Gems ve Hearts basliklari shell contract'i olarak sabit kalir.
          </p>
        </div>

        <section class="metrics-grid" aria-label="Placeholder metrics">
          <article *ngFor="let metric of metrics" class="metric-card">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
          </article>
        </section>
      </aside>
    </div>
  `,
  styles: [
    `
      .app-shell {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: minmax(240px, 280px) minmax(0, 1fr) minmax(220px, 260px);
        margin: 0 auto;
        max-width: 1480px;
        min-height: 100vh;
        padding: 1.5rem;
      }

      .left-rail,
      .right-rail {
        align-self: start;
        display: grid;
        gap: 1rem;
        position: sticky;
        top: 1.5rem;
      }

      .left-rail nav {
        display: grid;
        gap: 0.7rem;
      }

      .center-stage {
        display: block;
      }

      .right-rail h2,
      .left-rail h1 {
        margin: 0;
      }

      .metrics-grid {
        display: grid;
        gap: 0.85rem;
      }

      @media (max-width: 1180px) {
        .app-shell {
          grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
        }

        .right-rail {
          grid-column: 1 / -1;
          position: static;
        }
      }

      @media (max-width: 900px) {
        .app-shell {
          grid-template-columns: 1fr;
          min-height: auto;
          padding: 1rem;
        }

        .left-rail,
        .right-rail {
          position: static;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  public readonly navigationItems: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: '/app/learn', label: 'Ogren' },
    { href: '/app/elifba', label: 'Elifba' },
    { href: '/app/practice', label: 'Pratik' },
    { href: '/app/leaderboard', label: 'Liderlik' },
    { href: '/app/quests', label: 'Gorevler' },
    { href: '/app/shop', label: 'Magaza' },
    { href: '/app/profile', label: 'Profil' },
    { href: '/app/more/settings', label: 'Ayarlar' },
  ];

  public readonly metrics: ReadonlyArray<Readonly<{ label: string; value: string }>> = [
    { label: 'XP', value: '1,280' },
    { label: 'Streak', value: '14 gun' },
    { label: 'Gems', value: '245' },
    { label: 'Hearts', value: '5 / 5' },
  ];
}
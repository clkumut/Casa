import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'casa-ops-shell',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="ops-shell">
      <header class="ops-header page-panel">
        <div>
          <p class="page-eyebrow">Ops Shell</p>
          <h1>Yayin ve release operasyonlari</h1>
          <p class="muted-text">
            Ops role guard ile korunacak operasyon route aileleri icin placeholder shell.
          </p>
        </div>

        <nav class="ops-nav" aria-label="Ops navigation">
          <a
            *ngFor="let item of navigationItems"
            class="shell-link"
            [routerLink]="item.href"
            routerLinkActive="is-active"
          >
            {{ item.label }}
          </a>
        </nav>
      </header>

      <main class="ops-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .ops-shell {
        display: grid;
        gap: 1.5rem;
        margin: 0 auto;
        max-width: 1180px;
        min-height: 100vh;
        padding: 2rem;
      }

      .ops-header {
        align-items: center;
        display: grid;
        gap: 1rem;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .ops-header h1 {
        margin: 0;
      }

      .ops-nav {
        display: flex;
        gap: 0.75rem;
      }

      @media (max-width: 900px) {
        .ops-shell {
          min-height: auto;
          padding: 1rem;
        }

        .ops-header {
          grid-template-columns: 1fr;
        }

        .ops-nav {
          flex-wrap: wrap;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsShellComponent {
  public readonly navigationItems: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: '/ops/content', label: 'Icerik' },
    { href: '/ops/release', label: 'Release' },
  ];
}
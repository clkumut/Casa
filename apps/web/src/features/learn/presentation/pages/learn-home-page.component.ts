import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LearnBootstrapFacade } from '../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-home-page',
  standalone: true,
  imports: [NgFor, NgIf],
  providers: [LearnBootstrapFacade],
  template: `
    <section class="learn-page-grid">
      <article class="page-panel learn-main-panel">
        <span class="page-eyebrow">Learn</span>
        <h2 class="page-title">Ogrenme haritasi bootstrap gorunumu</h2>
        <p class="page-description">
          Onboarding sonrasi ilk merkez-stage baglanti progression snapshot uzerinden acildi.
        </p>

        <section class="learn-status-row">
          <article class="learn-status-card">
            <span class="learn-status-label">Read status</span>
            <strong>{{ status() }}</strong>
            <span class="muted-text">Progression snapshot feature-local facade uzerinden tasiniyor.</span>
          </article>

          <article class="learn-status-card">
            <span class="learn-status-label">Unlock state</span>
            <strong>{{ progression()?.unlockState ?? 'bekleniyor' }}</strong>
            <span class="muted-text">Mock veri yok; projection ne getirirse yalniz onu gosteriyoruz.</span>
          </article>
        </section>

        <p class="muted-text" *ngIf="status() === 'loading'">
          Learning progression snapshot yukleniyor.
        </p>

        <p class="muted-text" *ngIf="status() === 'ready'">
          Current world, chapter ve unit katalog metadata'si progression snapshot ile ayni read modelde cozuluyor.
        </p>

        <p class="learn-error" *ngIf="status() === 'error'">
          Learning progression snapshot su an okunamiyor.
        </p>

        <section class="learn-empty-state page-panel" *ngIf="status() === 'ready' && !progression()">
          <h3>Progression snapshot bekleniyor</h3>
          <p class="muted-text">
            AppShell ve learn route artik projection okumaya hazir. Katalog ve ilk learning map genislemesi bir sonraki delivery slice'ta acilacak.
          </p>
        </section>

        <section class="learn-cards-grid" *ngIf="progression() as progressionSnapshot">
          <article *ngFor="let card of progressionCards()" class="learn-card">
            <span class="learn-card-label">{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
            <span class="muted-text" *ngIf="card.hint">{{ card.hint }}</span>
          </article>

          <article class="learn-card learn-card-wide">
            <span class="learn-card-label">Bootstrap notu</span>
            <p class="muted-text">
              Mevcut snapshot World {{ progressionSnapshot.currentWorldId ?? 'yok' }}, Chapter {{ progressionSnapshot.currentChapterId ?? 'yok' }}, Unit {{ progressionSnapshot.currentUnitId ?? 'yok' }} ve Lesson {{ progressionSnapshot.currentLessonId ?? 'yok' }} alanlarini aciyor. Katalog metadata'si current node seviyesinde baglandi; liste ve prerequisite genislemesi sonraki dilimde acilacak.
            </p>
          </article>
        </section>
      </article>
    </section>
  `,
  styles: [
    `
      .learn-page-grid {
        display: grid;
      }

      .learn-main-panel,
      .learn-empty-state {
        display: grid;
        gap: 1rem;
      }

      .learn-status-row,
      .learn-cards-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .learn-status-card,
      .learn-card {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 18px;
        display: grid;
        gap: 0.45rem;
        padding: 1rem 1.1rem;
      }

      .learn-card-wide {
        grid-column: 1 / -1;
      }

      .learn-status-label,
      .learn-card-label {
        color: var(--casa-ink-soft);
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      .learn-error {
        color: #a33d2d;
        margin: 0;
      }

      .learn-card p {
        margin: 0;
      }

      @media (max-width: 820px) {
        .learn-status-row,
        .learn-cards-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnHomePageComponent {
  private readonly learnBootstrapFacade = inject(LearnBootstrapFacade);

  protected readonly catalog = this.learnBootstrapFacade.catalog;
  protected readonly progression = this.learnBootstrapFacade.progression;
  protected readonly progressionCards = computed(() => {
    const catalog = this.catalog();
    const progression = this.progression();

    return [
      {
        label: 'World',
        value: this.resolveCatalogValue(catalog.world, progression?.currentWorldId),
        hint: this.resolveCatalogHint(catalog.world, progression?.currentWorldId),
      },
      {
        label: 'Chapter',
        value: this.resolveCatalogValue(catalog.chapter, progression?.currentChapterId),
        hint: this.resolveCatalogHint(catalog.chapter, progression?.currentChapterId),
      },
      {
        label: 'Unit',
        value: this.resolveCatalogValue(catalog.unit, progression?.currentUnitId),
        hint: this.resolveCatalogHint(catalog.unit, progression?.currentUnitId),
      },
      {
        label: 'Lesson',
        value: progression?.currentLessonId ?? 'atanmadi',
        hint: null,
      },
      {
        label: 'Completed lessons',
        value:
          progression?.completedLessonCount !== null && progression?.completedLessonCount !== undefined
            ? `${progression.completedLessonCount}`
            : '0',
        hint: null,
      },
      {
        label: 'Mastered units',
        value:
          progression?.masteredUnitCount !== null && progression?.masteredUnitCount !== undefined
            ? `${progression.masteredUnitCount}`
            : '0',
        hint: null,
      },
    ] as const;
  });
  protected readonly status = this.learnBootstrapFacade.status;

  private resolveCatalogHint(
    node: LearningCatalogNodeModel | null,
    fallbackId: string | null | undefined,
  ): string | null {
    const details = [
      node?.id ?? fallbackId ?? null,
      node?.order !== null && node?.order !== undefined ? `order ${node.order}` : null,
      node?.publishState ?? null,
    ].filter((value): value is string => value !== null && value.length > 0);

    return details.length > 0 ? details.join(' · ') : null;
  }

  private resolveCatalogValue(
    node: LearningCatalogNodeModel | null,
    fallbackId: string | null | undefined,
  ): string {
    return node?.title ?? fallbackId ?? 'atanmadi';
  }
}
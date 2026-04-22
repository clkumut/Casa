import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LearnBootstrapFacade } from '../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-world-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  providers: [LearnBootstrapFacade],
  template: `
    <section class="learn-detail-grid">
      <article class="page-panel learn-detail-panel">
        <a class="learn-back-link" [routerLink]="['/app/learn']">Learn listesine don</a>
        <span class="page-eyebrow">Learn / World</span>
        <h2 class="page-title">{{ selectedWorld()?.title ?? (worldId() ?? 'World') }}</h2>
        <p class="page-description">
          {{ selectedWorld()?.description ?? 'Bu world icin published chapter ve unit kesitleri gosteriliyor.' }}
        </p>

        <p class="muted-text" *ngIf="status() === 'loading'">World detail yukleniyor.</p>
        <p class="learn-error" *ngIf="status() === 'error'">World detail okunamiyor.</p>

        <section class="learn-detail-summary" *ngIf="selectedWorld() as world">
          <article class="learn-summary-card">
            <span class="learn-summary-label">World</span>
            <strong>{{ world.title ?? world.id }}</strong>
            <span class="muted-text">{{ resolveNodeSummary(world) }}</span>
          </article>

          <article class="learn-summary-card">
            <span class="learn-summary-label">Current status</span>
            <strong>{{ isCurrentWorld() ? 'active world' : 'published world' }}</strong>
            <span class="muted-text">{{ resolveWorldHint(world) }}</span>
          </article>
        </section>

        <section class="learn-not-found" *ngIf="status() === 'ready' && !selectedWorld()">
          <h3>World bulunamadi</h3>
          <p class="muted-text">Route param ile gelen world id icin published catalog kaydi cozulmedi.</p>
        </section>
      </article>

      <section class="page-panel learn-detail-panel" *ngIf="selectedWorld()">
        <span class="page-eyebrow">Published Chapters</span>
        <h3 class="learn-section-title">World icindeki chapter ve unit listesi</h3>

        <p class="muted-text" *ngIf="chapters().length === 0">Bu world icin published chapter bulunamadi.</p>

        <article class="learn-chapter-card" *ngFor="let chapter of chapters()">
          <div class="learn-node-headline">
            <strong>{{ chapter.title ?? chapter.id }}</strong>
            <span class="learn-current-badge" *ngIf="isCurrentChapter(chapter.id)">current</span>
          </div>
          <span class="muted-text">{{ resolveNodeSummary(chapter) }}</span>

          <div class="learn-unit-list">
            <a
              *ngFor="let unit of unitsByChapter(chapter.id)"
              class="learn-unit-link"
              [routerLink]="['/app/learn/unit', unit.id]">
              <span>{{ unit.title ?? unit.id }}</span>
              <span class="muted-text">{{ resolveUnitMeta(unit) }}</span>
            </a>
          </div>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      .learn-detail-grid {
        display: grid;
        gap: 1rem;
      }

      .learn-detail-panel,
      .learn-detail-summary,
      .learn-not-found {
        display: grid;
        gap: 1rem;
      }

      .learn-back-link,
      .learn-unit-link {
        color: var(--casa-ink);
        text-decoration: none;
      }

      .learn-back-link {
        font-weight: 700;
        width: fit-content;
      }

      .learn-detail-summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .learn-summary-card,
      .learn-chapter-card {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 18px;
        display: grid;
        gap: 0.65rem;
        padding: 1rem 1.1rem;
      }

      .learn-summary-label,
      .learn-section-title {
        margin: 0;
      }

      .learn-summary-label {
        color: var(--casa-ink-soft);
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      .learn-node-headline {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
      }

      .learn-current-badge {
        background: var(--casa-ink);
        border-radius: 999px;
        color: var(--casa-surface, #fff8ee);
        font-size: 0.72rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        text-transform: uppercase;
      }

      .learn-unit-list {
        display: grid;
        gap: 0.75rem;
      }

      .learn-unit-link {
        background: color-mix(in srgb, var(--casa-surface-muted) 72%, white 28%);
        border-radius: 14px;
        display: grid;
        gap: 0.3rem;
        padding: 0.8rem 0.9rem;
      }

      .learn-error {
        color: #a33d2d;
        margin: 0;
      }

      @media (max-width: 820px) {
        .learn-detail-summary {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnWorldPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly learnBootstrapFacade = inject(LearnBootstrapFacade);
  private readonly routeParamMap = toSignal(this.activatedRoute.paramMap, {
    initialValue: this.activatedRoute.snapshot.paramMap,
  });

  protected readonly status = this.learnBootstrapFacade.status;
  protected readonly worldId = computed(() => this.routeParamMap().get('worldId'));
  protected readonly selectedWorld = computed(() => {
    const worldId = this.worldId();

    return this.learnBootstrapFacade.catalogMap().worlds.find((world) => world.id === worldId) ?? null;
  });
  protected readonly chapters = computed(() => {
    const worldId = this.worldId();

    return this.learnBootstrapFacade.catalogMap().chapters.filter((chapter) => chapter.parentId === worldId);
  });

  protected isCurrentChapter(chapterId: string): boolean {
    return this.learnBootstrapFacade.progression()?.currentChapterId === chapterId;
  }

  protected isCurrentWorld(): boolean {
    return this.learnBootstrapFacade.progression()?.currentWorldId === this.worldId();
  }

  protected resolveNodeSummary(node: LearningCatalogNodeModel): string {
    return node.description ?? this.resolveWorldHint(node) ?? node.id;
  }

  protected resolveUnitMeta(unit: LearningCatalogNodeModel): string {
    const details = [
      unit.order !== null ? `order ${unit.order}` : null,
      unit.prerequisiteIds.length > 0 ? `${unit.prerequisiteIds.length} onkosul` : 'Onkosul yok',
    ].filter((value): value is string => value !== null);

    return details.join(' · ');
  }

  protected unitsByChapter(chapterId: string): ReadonlyArray<LearningCatalogNodeModel> {
    return this.learnBootstrapFacade.catalogMap().units.filter((unit) => unit.parentId === chapterId);
  }

  protected resolveWorldHint(node: LearningCatalogNodeModel): string | null {
    const details = [
      node.order !== null ? `order ${node.order}` : null,
      node.publishState,
    ].filter((value): value is string => value !== null);

    return details.length > 0 ? details.join(' · ') : null;
  }
}
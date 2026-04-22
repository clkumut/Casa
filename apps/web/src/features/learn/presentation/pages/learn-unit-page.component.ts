import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LearnBootstrapFacade } from '../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-unit-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  providers: [LearnBootstrapFacade],
  template: `
    <section class="learn-unit-layout">
      <article class="page-panel learn-unit-panel">
        <a class="learn-back-link" [routerLink]="backLink()">{{ backLinkLabel() }}</a>
        <span class="page-eyebrow">Learn / Unit</span>
        <h2 class="page-title">{{ selectedUnit()?.title ?? (unitId() ?? 'Unit') }}</h2>
        <p class="page-description">
          {{ selectedUnit()?.description ?? 'Bu unit icin prerequisite ve progression baglami gosteriliyor.' }}
        </p>

        <p class="muted-text" *ngIf="status() === 'loading'">Unit detail yukleniyor.</p>
        <p class="learn-error" *ngIf="status() === 'error'">Unit detail okunamiyor.</p>

        <section class="learn-not-found" *ngIf="status() === 'ready' && !selectedUnit()">
          <h3>Unit bulunamadi</h3>
          <p class="muted-text">Route param ile gelen unit id icin published catalog kaydi cozulmedi.</p>
        </section>

        <section class="learn-unit-summary" *ngIf="selectedUnit() as unit">
          <article class="learn-unit-card">
            <span class="learn-card-label">Parent world</span>
            <strong>{{ parentWorld()?.title ?? 'atanmadi' }}</strong>
            <span class="muted-text">{{ parentWorld()?.id ?? 'World baglanti bilgisi yok' }}</span>
          </article>

          <article class="learn-unit-card">
            <span class="learn-card-label">Parent chapter</span>
            <strong>{{ parentChapter()?.title ?? 'atanmadi' }}</strong>
            <span class="muted-text">{{ parentChapter()?.id ?? 'Chapter baglanti bilgisi yok' }}</span>
          </article>

          <article class="learn-unit-card">
            <span class="learn-card-label">Progress state</span>
            <strong>{{ isCurrentUnit() ? 'current unit' : 'published unit' }}</strong>
            <span class="muted-text">{{ resolveUnitMeta(unit) }}</span>
          </article>

          <article class="learn-unit-card">
            <span class="learn-card-label">Current lesson</span>
            <strong>{{ progression()?.currentLessonId ?? 'atanmadi' }}</strong>
            <span class="muted-text">Tamamlama komutu sonraki delivery slice'ta acilacak.</span>
          </article>
        </section>
      </article>

      <article class="page-panel learn-unit-panel" *ngIf="selectedUnit()">
        <span class="page-eyebrow">Prerequisites</span>
        <h3 class="learn-section-title">Onkosul baglari</h3>

        <p class="muted-text" *ngIf="prerequisiteNodes().length === 0">Bu unit icin onkosul tanimli degil.</p>

        <article class="learn-prerequisite-card" *ngFor="let prerequisite of prerequisiteNodes()">
          <div class="learn-node-headline">
            <strong>{{ prerequisite.title ?? prerequisite.id }}</strong>
            <span class="muted-text">{{ prerequisite.kind }}</span>
          </div>
          <span class="muted-text">{{ resolveNodeSummary(prerequisite) }}</span>
        </article>

        <section class="learn-unit-note">
          <span class="learn-card-label">Unit note</span>
          <p class="muted-text">
            Bu route, published catalog ile progression snapshot arasindaki detail bagini dogrular. Lesson start ve completion command yuzeyi sonraki slice'ta acilacak.
          </p>
        </section>
      </article>
    </section>
  `,
  styles: [
    `
      .learn-unit-layout,
      .learn-unit-panel,
      .learn-unit-summary,
      .learn-not-found,
      .learn-unit-note {
        display: grid;
        gap: 1rem;
      }

      .learn-back-link {
        color: var(--casa-ink);
        font-weight: 700;
        text-decoration: none;
        width: fit-content;
      }

      .learn-unit-summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .learn-unit-card,
      .learn-prerequisite-card,
      .learn-unit-note {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 18px;
        display: grid;
        gap: 0.55rem;
        padding: 1rem 1.1rem;
      }

      .learn-card-label,
      .learn-section-title {
        margin: 0;
      }

      .learn-card-label {
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

      .learn-error {
        color: #a33d2d;
        margin: 0;
      }

      .learn-unit-note p {
        margin: 0;
      }

      @media (max-width: 820px) {
        .learn-unit-summary {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnUnitPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly learnBootstrapFacade = inject(LearnBootstrapFacade);
  private readonly routeParamMap = toSignal(this.activatedRoute.paramMap, {
    initialValue: this.activatedRoute.snapshot.paramMap,
  });

  protected readonly progression = this.learnBootstrapFacade.progression;
  protected readonly status = this.learnBootstrapFacade.status;
  protected readonly unitId = computed(() => this.routeParamMap().get('unitId'));
  protected readonly selectedUnit = computed(() => {
    const unitId = this.unitId();

    return this.learnBootstrapFacade.catalogMap().units.find((unit) => unit.id === unitId) ?? null;
  });
  protected readonly parentChapter = computed(() => {
    const chapterId = this.selectedUnit()?.parentId;

    return this.learnBootstrapFacade.catalogMap().chapters.find((chapter) => chapter.id === chapterId) ?? null;
  });
  protected readonly parentWorld = computed(() => {
    const worldId = this.parentChapter()?.parentId;

    return this.learnBootstrapFacade.catalogMap().worlds.find((world) => world.id === worldId) ?? null;
  });
  protected readonly prerequisiteNodes = computed(() => {
    const lookup = new Map<string, LearningCatalogNodeModel>();

    for (const chapter of this.learnBootstrapFacade.catalogMap().chapters) {
      lookup.set(chapter.id, chapter);
    }

    for (const unit of this.learnBootstrapFacade.catalogMap().units) {
      lookup.set(unit.id, unit);
    }

    return (this.selectedUnit()?.prerequisiteIds ?? [])
      .map((prerequisiteId) => lookup.get(prerequisiteId) ?? null)
      .filter((prerequisite): prerequisite is LearningCatalogNodeModel => prerequisite !== null);
  });

  protected backLink = computed(() => {
    const worldId = this.parentWorld()?.id;

    return worldId ? ['/app/learn/world', worldId] : ['/app/learn'];
  });

  protected backLinkLabel = computed(() => {
    return this.parentWorld() ? 'World detayina don' : 'Learn listesine don';
  });

  protected isCurrentUnit(): boolean {
    return this.learnBootstrapFacade.progression()?.currentUnitId === this.unitId();
  }

  protected resolveNodeSummary(node: LearningCatalogNodeModel): string {
    return node.description ?? this.resolveUnitMeta(node);
  }

  protected resolveUnitMeta(unit: LearningCatalogNodeModel): string {
    const details = [
      unit.order !== null ? `order ${unit.order}` : null,
      unit.publishState,
      unit.prerequisiteIds.length > 0 ? `${unit.prerequisiteIds.length} onkosul` : 'Onkosul yok',
    ].filter((value): value is string => value !== null);

    return details.join(' · ');
  }
}
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LearnBootstrapFacade } from '../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-home-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
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
          Current node metadata, published curriculum listesi ve detail route baglari ayni read modelde cozuluyor.
        </p>

        <p class="learn-error" *ngIf="status() === 'error'">
          Learning progression snapshot su an okunamiyor.
        </p>

        <section class="learn-empty-state page-panel" *ngIf="status() === 'ready' && !progression()">
          <h3>Progression snapshot bekleniyor</h3>
          <p class="muted-text">
            Learn route published world listesini gostermeye hazir. Kullanici progression snapshot gelince current chapter ve unit listeleri ayni yuzeye oturacak.
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
              Mevcut snapshot World {{ progressionSnapshot.currentWorldId ?? 'yok' }}, Chapter {{ progressionSnapshot.currentChapterId ?? 'yok' }}, Unit {{ progressionSnapshot.currentUnitId ?? 'yok' }} ve Lesson {{ progressionSnapshot.currentLessonId ?? 'yok' }} alanlarini aciyor. Published world/chapter/unit liste gorunumu, detail route baglari ve unit prerequisite baglari ayni route'a eklendi.
            </p>
          </article>
        </section>

        <section class="page-panel learn-map-panel" *ngIf="status() === 'ready'">
          <header class="learn-map-header">
            <div>
              <span class="page-eyebrow">Learning Map</span>
              <h3 class="learn-map-title">Published curriculum listesi</h3>
            </div>
            <p class="muted-text">
              Liste yalniz published catalog belgelerini gosterir, current progression node'larini isaretler ve detail route'lara baglanir.
            </p>
          </header>

          <div class="learn-map-columns">
            <section class="learn-map-column">
              <h4>Worlds</h4>
              <p class="muted-text" *ngIf="publishedWorlds().length === 0">Published world bulunamadi.</p>
              <article
                *ngFor="let world of publishedWorlds()"
                class="learn-map-node"
                [class.learn-map-node-current]="isCurrentNode('world', world.id)">
                <div class="learn-map-node-topline">
                  <strong>{{ world.title ?? world.id }}</strong>
                  <span class="learn-current-badge" *ngIf="isCurrentNode('world', world.id)">current</span>
                </div>
                <span class="muted-text">{{ resolveNodeSummary(world) }}</span>
                <a class="learn-node-link" [routerLink]="['/app/learn/world', world.id]">World detail</a>
              </article>
            </section>

            <section class="learn-map-column">
              <h4>Chapters</h4>
              <p class="muted-text" *ngIf="publishedChapters().length === 0">
                Current world icin published chapter bulunamadi.
              </p>
              <article
                *ngFor="let chapter of publishedChapters()"
                class="learn-map-node"
                [class.learn-map-node-current]="isCurrentNode('chapter', chapter.id)">
                <div class="learn-map-node-topline">
                  <strong>{{ chapter.title ?? chapter.id }}</strong>
                  <span class="learn-current-badge" *ngIf="isCurrentNode('chapter', chapter.id)">current</span>
                </div>
                <span class="muted-text">{{ resolveNodeSummary(chapter) }}</span>
              </article>
            </section>

            <section class="learn-map-column">
              <h4>Units</h4>
              <p class="muted-text" *ngIf="publishedUnits().length === 0">
                Current chapter icin published unit bulunamadi.
              </p>
              <article
                *ngFor="let unit of publishedUnits()"
                class="learn-map-node"
                [class.learn-map-node-current]="isCurrentNode('unit', unit.id)">
                <div class="learn-map-node-topline">
                  <strong>{{ unit.title ?? unit.id }}</strong>
                  <span class="learn-current-badge" *ngIf="isCurrentNode('unit', unit.id)">current</span>
                </div>
                <span class="muted-text">{{ resolveNodeSummary(unit) }}</span>
                <span class="muted-text">{{ resolvePrerequisiteHint(unit) }}</span>
                <a class="learn-node-link" [routerLink]="['/app/learn/unit', unit.id]">Unit detail</a>
              </article>
            </section>
          </div>
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
      .learn-empty-state,
      .learn-map-panel {
        display: grid;
        gap: 1rem;
      }

      .learn-status-row,
      .learn-cards-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .learn-map-columns {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .learn-map-column {
        display: grid;
        gap: 0.85rem;
      }

      .learn-map-column h4,
      .learn-map-title {
        margin: 0;
      }

      .learn-map-header {
        align-items: start;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
      }

      .learn-map-header p {
        margin: 0;
        max-width: 28rem;
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

      .learn-map-node {
        background: var(--casa-surface-muted);
        border: 1px solid var(--casa-border);
        border-radius: 16px;
        display: grid;
        gap: 0.5rem;
        padding: 0.9rem 1rem;
      }

      .learn-map-node-current {
        border-color: var(--casa-ink);
        box-shadow: inset 0 0 0 1px var(--casa-ink);
      }

      .learn-map-node-topline {
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

      .learn-node-link {
        color: var(--casa-ink);
        font-weight: 700;
        text-decoration: none;
        width: fit-content;
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
        .learn-cards-grid,
        .learn-map-columns {
          grid-template-columns: 1fr;
        }

        .learn-map-header {
          flex-direction: column;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnHomePageComponent {
  private readonly learnBootstrapFacade = inject(LearnBootstrapFacade);

  protected readonly catalog = this.learnBootstrapFacade.catalog;
  protected readonly catalogMap = this.learnBootstrapFacade.catalogMap;
  protected readonly progression = this.learnBootstrapFacade.progression;
  protected readonly publishedChapters = computed(() => {
    const currentWorldId = this.progression()?.currentWorldId;

    return this.catalogMap().chapters.filter((chapter) => chapter.parentId === currentWorldId);
  });
  protected readonly publishedUnits = computed(() => {
    const currentChapterId = this.progression()?.currentChapterId;

    return this.catalogMap().units.filter((unit) => unit.parentId === currentChapterId);
  });
  protected readonly publishedWorlds = computed(() => this.catalogMap().worlds);
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
  protected readonly unitPrerequisiteLookup = computed(() => {
    return new Map(
      this.catalogMap().units.map((unit) => [unit.id, unit.title ?? unit.id] as const),
    );
  });

  protected isCurrentNode(
    kind: 'world' | 'chapter' | 'unit',
    nodeId: string,
  ): boolean {
    const progression = this.progression();

    if (kind === 'world') {
      return progression?.currentWorldId === nodeId;
    }

    if (kind === 'chapter') {
      return progression?.currentChapterId === nodeId;
    }

    return progression?.currentUnitId === nodeId;
  }

  protected resolveNodeSummary(node: LearningCatalogNodeModel): string {
    return node.description ?? this.resolveCatalogHint(node, node.id) ?? node.id;
  }

  protected resolvePrerequisiteHint(unit: LearningCatalogNodeModel): string | null {
    if (unit.prerequisiteIds.length === 0) {
      return 'Onkosul yok';
    }

    const prerequisiteLookup = this.unitPrerequisiteLookup();
    const prerequisiteLabels = unit.prerequisiteIds.map(
      (prerequisiteId) => prerequisiteLookup.get(prerequisiteId) ?? prerequisiteId,
    );

    return `Onkosul: ${prerequisiteLabels.join(', ')}`;
  }

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
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LearnBootstrapFacade } from '../../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-home-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  providers: [LearnBootstrapFacade],
  templateUrl: './home.html',
  styleUrl: './home.scss',
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
        value: this.resolveCatalogValue(catalog.lesson, progression?.currentLessonId),
        hint: this.resolveCatalogHint(catalog.lesson, progression?.currentLessonId),
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
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LearnBootstrapFacade } from '../../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-unit-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  providers: [LearnBootstrapFacade],
  templateUrl: './unit.html',
  styleUrl: './unit.scss',
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
  protected readonly lessons = computed(() => {
    const unitId = this.unitId();

    return this.learnBootstrapFacade.catalogMap().lessons.filter((lesson) => lesson.parentId === unitId);
  });
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
  protected readonly startLesson = computed(() => {
    const currentLessonId = this.progression()?.currentLessonId;
    const lessons = this.lessons();

    return lessons.find((lesson) => lesson.id === currentLessonId) ?? lessons[0] ?? null;
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

  protected isCurrentLesson(lessonId: string): boolean {
    return this.progression()?.currentLessonId === lessonId;
  }

  protected isStartLesson(lessonId: string): boolean {
    return this.startLesson()?.id === lessonId;
  }

  protected resolveNodeSummary(node: LearningCatalogNodeModel): string {
    return node.description ?? this.resolveUnitMeta(node);
  }

  protected resolveLessonBoundaryHint(lesson: LearningCatalogNodeModel): string {
    if (this.isCurrentLesson(lesson.id)) {
      return 'Progression snapshot bu dersi aktif baslangic noktasi olarak isaretliyor.';
    }

    return 'Progression aktif lesson tanimlamadiginda ilk published lesson canonical baslangic noktasi olur.';
  }

  protected resolveUnitMeta(unit: LearningCatalogNodeModel): string {
    const details = [
      unit.order !== null ? `order ${unit.order}` : null,
      unit.publishState,
      unit.prerequisiteIds.length > 0 ? `${unit.prerequisiteIds.length} onkosul` : 'Onkosul yok',
    ].filter((value): value is string => value !== null);

    return details.join(' · ');
  }

  protected resolveLessonMeta(lesson: LearningCatalogNodeModel): string {
    const details = [
      lesson.order !== null ? `order ${lesson.order}` : null,
      lesson.publishState,
    ].filter((value): value is string => value !== null);

    return details.join(' · ');
  }
}
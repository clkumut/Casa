import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LearnBootstrapFacade } from '../../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-lesson-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  providers: [LearnBootstrapFacade],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnLessonPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly learnBootstrapFacade = inject(LearnBootstrapFacade);
  private readonly routeParamMap = toSignal(this.activatedRoute.paramMap, {
    initialValue: this.activatedRoute.snapshot.paramMap,
  });

  protected readonly progression = this.learnBootstrapFacade.progression;
  protected readonly status = this.learnBootstrapFacade.status;
  protected readonly lessonId = computed(() => this.routeParamMap().get('lessonId'));
  protected readonly unitId = computed(() => this.routeParamMap().get('unitId'));
  protected readonly selectedUnit = computed(() => {
    const unitId = this.unitId();

    return this.learnBootstrapFacade.catalogMap().units.find((unit) => unit.id === unitId) ?? null;
  });
  protected readonly selectedLesson = computed(() => {
    const lessonId = this.lessonId();
    const unitId = this.unitId();

    if (!lessonId || !unitId) {
      return null;
    }

    return this.learnBootstrapFacade.catalogMap().lessons.find(
      (lesson) => lesson.id === lessonId && lesson.parentId === unitId,
    ) ?? null;
  });
  protected readonly parentChapter = computed(() => {
    const chapterId = this.selectedUnit()?.parentId;

    return this.learnBootstrapFacade.catalogMap().chapters.find((chapter) => chapter.id === chapterId) ?? null;
  });
  protected readonly parentWorld = computed(() => {
    const worldId = this.parentChapter()?.parentId;

    return this.learnBootstrapFacade.catalogMap().worlds.find((world) => world.id === worldId) ?? null;
  });
  protected readonly unitLessons = computed(() => {
    const unitId = this.unitId();

    return this.learnBootstrapFacade.catalogMap().lessons.filter((lesson) => lesson.parentId === unitId);
  });
  protected readonly previousLesson = computed(() => {
    const selectedLesson = this.selectedLesson();

    if (!selectedLesson) {
      return null;
    }

    const selectedLessonIndex = this.unitLessons().findIndex((lesson) => lesson.id === selectedLesson.id);

    return selectedLessonIndex > 0 ? this.unitLessons()[selectedLessonIndex - 1] : null;
  });
  protected readonly nextLesson = computed(() => {
    const selectedLesson = this.selectedLesson();

    if (!selectedLesson) {
      return null;
    }

    const lessons = this.unitLessons();
    const selectedLessonIndex = lessons.findIndex((lesson) => lesson.id === selectedLesson.id);

    return selectedLessonIndex >= 0 && selectedLessonIndex < lessons.length - 1
      ? lessons[selectedLessonIndex + 1]
      : null;
  });
  protected readonly backLink = computed(() => {
    const unitId = this.unitId();

    return unitId ? ['/app/learn/unit', unitId] : ['/app/learn'];
  });
  protected readonly executionStateLabel = computed(() => {
    const selectedLesson = this.selectedLesson();

    if (!selectedLesson) {
      return 'Lesson cozulmedi';
    }

    return this.isCurrentLesson(selectedLesson.id) ? 'current lesson entry' : 'lesson entry';
  });

  protected isCurrentLesson(lessonId: string): boolean {
    return this.progression()?.currentLessonId === lessonId;
  }

  protected isSelectedLesson(lessonId: string): boolean {
    return this.lessonId() === lessonId;
  }

  protected resolveLessonLink(lessonId: string): Array<string> {
    const unitId = this.selectedUnit()?.id ?? this.unitId();

    return unitId ? ['/app/learn/unit', unitId, 'lesson', lessonId] : ['/app/learn'];
  }

  protected resolveNodeSummary(node: LearningCatalogNodeModel): string {
    return node.description ?? this.resolveLessonMeta(node);
  }

  protected resolveLessonMeta(lesson: LearningCatalogNodeModel): string {
    const details = [
      lesson.order !== null ? `order ${lesson.order}` : null,
      lesson.publishState,
      this.isCurrentLesson(lesson.id) ? 'progression current' : null,
    ].filter((value): value is string => value !== null);

    return details.length > 0 ? details.join(' · ') : 'Lesson metadata yok';
  }
}
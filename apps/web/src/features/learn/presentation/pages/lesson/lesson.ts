import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LearnLessonCommandFacade } from '../../../application/learn-lesson-command.facade';
import { LearnBootstrapFacade } from '../../../application/learn-bootstrap.facade';
import { resolveLessonChallenge } from '../../../models/learning-lesson-challenge.model';
import type { LearningCatalogNodeModel } from '../../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-lesson-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  providers: [LearnBootstrapFacade, LearnLessonCommandFacade],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnLessonPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly learnBootstrapFacade = inject(LearnBootstrapFacade);
  private readonly learnLessonCommandFacade = inject(LearnLessonCommandFacade);
  private readonly routeParamMap = toSignal(this.activatedRoute.paramMap, {
    initialValue: this.activatedRoute.snapshot.paramMap,
  });

  public constructor() {
    effect(
      () => {
        this.lessonId();
        this.learnLessonCommandFacade.resetExecutionState();
      },
      { allowSignalWrites: true },
    );
  }

  protected readonly activeChallengeAttempt = this.learnLessonCommandFacade.activeChallengeAttempt;
  protected readonly commandError = this.learnLessonCommandFacade.commandError;
  protected readonly completionResult = this.learnLessonCommandFacade.completionResult;
  protected readonly completeButtonLabel = computed(() =>
    this.isCompleting() ? 'Lesson tamamlanıyor' : 'Lesson tamamla',
  );
  protected readonly firstChallenge = computed(() => resolveLessonChallenge(this.selectedLesson()));
  protected readonly isCompleting = this.learnLessonCommandFacade.isCompleting;
  protected readonly isStartingChallenge = this.learnLessonCommandFacade.isStartingChallenge;
  protected readonly progression = this.learnBootstrapFacade.progression;
  protected readonly startChallengeButtonLabel = computed(() => {
    if (this.isStartingChallenge()) {
      return 'Challenge baslatılıyor';
    }

    return this.activeChallengeAttempt() ? 'Challenge girisi hazir' : 'Ilk challengei baslat';
  });
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
  protected readonly canCompleteLesson = computed(() => {
    const selectedLesson = this.selectedLesson();
    const selectedUnit = this.selectedUnit();
    const currentLessonId = this.progression()?.currentLessonId;
    const firstUnitLessonId = this.unitLessons()[0]?.id ?? null;
    const activeChallengeAttempt = this.activeChallengeAttempt();

    return Boolean(
      selectedLesson
      && selectedUnit
      && this.firstChallenge()
      && activeChallengeAttempt
      && activeChallengeAttempt.lessonId === selectedLesson.id
      && activeChallengeAttempt.unitId === selectedUnit.id
      && !this.isCompleting()
      && this.progression()?.currentUnitId === selectedUnit.id
      && ((currentLessonId && currentLessonId === selectedLesson.id)
        || (!currentLessonId && firstUnitLessonId === selectedLesson.id)),
    );
  });
  protected readonly canStartChallenge = computed(() => {
    const selectedLesson = this.selectedLesson();
    const selectedUnit = this.selectedUnit();
    const currentLessonId = this.progression()?.currentLessonId;
    const firstUnitLessonId = this.unitLessons()[0]?.id ?? null;

    return Boolean(
      selectedLesson
      && selectedUnit
      && this.firstChallenge()
      && !this.isStartingChallenge()
      && this.progression()?.currentUnitId === selectedUnit.id
      && ((currentLessonId && currentLessonId === selectedLesson.id)
        || (!currentLessonId && firstUnitLessonId === selectedLesson.id)),
    );
  });
  protected readonly completionHint = computed(() => {
    const selectedLesson = this.selectedLesson();
    const selectedUnit = this.selectedUnit();

    if (!selectedLesson || !selectedUnit) {
      return 'Completion surface yalniz cozulmus lesson icin acilir.';
    }

    if (this.progression()?.currentUnitId !== selectedUnit.id) {
      return 'Completion command yalniz progression current unit icin acik.';
    }

    const currentLessonId = this.progression()?.currentLessonId;

    if (currentLessonId && currentLessonId !== selectedLesson.id) {
      return 'Completion command yalniz progression current lesson icin acik.';
    }

    if (!currentLessonId && this.unitLessons()[0]?.id !== selectedLesson.id) {
      return 'Active lesson yoksa yalniz first published lesson completion acilir.';
    }

    if (!this.activeChallengeAttempt()) {
      return 'Trusted completion command, server-backed challenge attempt baslatildiginda acilir.';
    }

    return 'Server-backed challenge attempt hazir. Trusted completion command cagrilabilir.';
  });

  protected isCurrentLesson(lessonId: string): boolean {
    return this.progression()?.currentLessonId === lessonId;
  }

  protected isSelectedLesson(lessonId: string): boolean {
    return this.lessonId() === lessonId;
  }

  protected async completeLesson(): Promise<void> {
    const selectedLesson = this.selectedLesson();
    const selectedUnit = this.selectedUnit();

    if (!selectedLesson || !selectedUnit || !this.canCompleteLesson()) {
      return;
    }

    try {
      await this.learnLessonCommandFacade.completeLesson(selectedUnit.id, selectedLesson.id);
    } catch {
      // Command error state is already surfaced by the facade.
    }
  }

  protected async startLessonChallenge(): Promise<void> {
    const selectedLesson = this.selectedLesson();
    const selectedUnit = this.selectedUnit();

    if (!selectedLesson || !selectedUnit || !this.canStartChallenge()) {
      return;
    }

    try {
      await this.learnLessonCommandFacade.startLessonChallenge(selectedUnit.id, selectedLesson.id);
    } catch {
      // Command error state is already surfaced by the facade.
    }
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
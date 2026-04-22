import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LearnBootstrapFacade } from '../../../application/learn-bootstrap.facade';
import type { LearningCatalogNodeModel } from '../../../models/learning-catalog.model';

@Component({
  selector: 'casa-learn-world-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  providers: [LearnBootstrapFacade],
  templateUrl: './world.html',
  styleUrl: './world.scss',
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
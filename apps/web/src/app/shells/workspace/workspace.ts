import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { RightRailStore } from '../../../core/state/right-rail.store';

@Component({
  selector: 'casa-app-shell',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './workspace.html',
  styleUrl: './workspace.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly rightRailStore = inject(RightRailStore);

  public readonly navigationItems: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: '/app/learn', label: 'Ogren' },
    { href: '/app/elifba', label: 'Elifba' },
    { href: '/app/practice', label: 'Pratik' },
    { href: '/app/leaderboard', label: 'Liderlik' },
    { href: '/app/quests', label: 'Gorevler' },
    { href: '/app/shop', label: 'Magaza' },
    { href: '/app/profile', label: 'Profil' },
    { href: '/app/more/settings', label: 'Ayarlar' },
  ];

  public readonly rightRailStatus = this.rightRailStore.status;
  public readonly metrics = computed(() => {
    const snapshot = this.rightRailStore.snapshot();
    const isReady = this.rightRailStatus() === 'ready';

    return [
      {
        label: 'XP',
        value: isReady && snapshot.lifetimeXp !== null ? `${snapshot.lifetimeXp}` : '...',
      },
      {
        label: 'Streak',
        value:
          isReady && snapshot.activeStreakDays !== null
            ? `${snapshot.activeStreakDays} gun`
            : '...',
      },
      {
        label: 'Gems',
        value: isReady && snapshot.currentGems !== null ? `${snapshot.currentGems}` : '...',
      },
      {
        label: 'Hearts',
        value:
          isReady && snapshot.currentHearts !== null
            ? snapshot.heartsCapacity !== null
              ? `${snapshot.currentHearts} / ${snapshot.heartsCapacity}`
              : `${snapshot.currentHearts}`
            : '...',
      },
    ] as const;
  });
}
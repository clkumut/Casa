import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'casa-ops-shell',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './ops.html',
  styleUrl: './ops.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsShellComponent {
  public readonly navigationItems: ReadonlyArray<Readonly<{ href: string; label: string }>> = [
    { href: '/ops/content', label: 'Icerik' },
    { href: '/ops/release', label: 'Release' },
  ];
}
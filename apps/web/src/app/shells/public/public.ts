import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'casa-public-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public.html',
  styleUrl: './public.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicShellComponent {}
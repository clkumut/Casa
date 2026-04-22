import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'casa-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './root.html',
  styleUrl: './root.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
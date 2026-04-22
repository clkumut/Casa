import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'casa-placeholder-page',
  standalone: true,
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  public get title(): string {
    return this.getRouteText('title', 'Casa Placeholder');
  }

  public get description(): string {
    return this.getRouteText(
      'description',
      'Bu route icin feature implementasyonu sonraki work package asamalarinda eklenecek.',
    );
  }

  private getRouteText(key: 'title' | 'description', fallback: string): string {
    const routeValue = this.route.snapshot.data[key];

    return typeof routeValue === 'string' ? routeValue : fallback;
  }
}
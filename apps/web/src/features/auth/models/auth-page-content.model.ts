export interface AuthPageActionModel {
  readonly href: string;
  readonly label: string;
}

export interface AuthPageContentModel {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly checkpoints: ReadonlyArray<string>;
  readonly primaryAction?: AuthPageActionModel;
  readonly secondaryAction?: AuthPageActionModel;
}
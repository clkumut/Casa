export interface BuildReadyResponseModel {
  readonly status: 'ok';
  readonly workspace: 'casa';
  readonly service: 'functions';
  readonly scope: 'structural-scaffold';
  readonly timestamp: string;
  readonly checks: {
    readonly environmentBinding: 'env-var-based';
    readonly workspaceManifest: true;
    readonly webToolchain: true;
    readonly functionsToolchain: true;
  };
}
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/root/root';
import { appConfig } from './app/root/config';

void bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => {
  console.error(error);
});
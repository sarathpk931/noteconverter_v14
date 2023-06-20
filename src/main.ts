import './polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { polyfill } from 'smoothscroll-polyfill';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment.prod';


polyfill();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

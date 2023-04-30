import { APP_INITIALIZER } from '@angular/core';
import * as _ from 'lodash';

export function appInit() {
  return () => {
    console.log('App init!');
    (window as any)._ = _;
  }
}

export const AppInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: appInit,
  multi: true
};

import { APP_INITIALIZER } from '@angular/core';
import * as _ from 'lodash';

export function appInit() {
  return () => {
    console.log('App init!');
    (window as any)._ = _;
    generateNewJobID();
    validateEmail('test@example.com');

  }
}

export const AppInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: appInit,generateNewJobID,validateEmail,
  multi: true
};

 export function generateNewJobID() {
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
  });

  localStorage.setItem('jobId',guid);
  console.log(guid);
  return guid;
}

export function validateEmail(emailArg: string) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  const result = regex.test(emailArg);
  localStorage.setItem('IsEmailValid',result.toString());
  console.log(result);
  return result;
}


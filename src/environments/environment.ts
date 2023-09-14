// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl:'http://127.0.0.1',
  wncAddress : 'https://wncservice-test.services.xerox.com',
  repoAddress : 'wncservice-test.services.xerox.com',
  wncAppAddress: 'http://localhost:5179',//'https://wnc-web-test.services.xerox.com',
  privacyPolicyUrl : 'https://appgallery.services.xerox.com/api/apps/template-privacy-policy',
  deviceUrl : 'http://localhost',
  instrumentationKey: 'b6a8b481-1fb8-4509-86f7-d618fc0287e9',
  appId: '3c51882b-c8da-44d2-b41b-b98828e6485d',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

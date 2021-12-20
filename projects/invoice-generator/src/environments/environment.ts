// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  googleCode: 'MY_TRACKING_ID',
  apiUrl: 'http://127.0.0.1:80',
  apiUrlM: 'http://127.0.0.1:8000',
  websiteURL: 'http://localhost:4200',
  auth: {
    audience: 'https://api2-staging.billie.digital',
    domain: '',
    clientId: '',
    redirectUri: 'http://localhost:4200',
  },
  stripeSecretKey:
    '',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Capacitor } from "@capacitor/core";
import config from "capacitor.config";

const native = Capacitor.isNativePlatform()

export const environment = {
  production: false,
  auth: {
    domain: 'dev-kae17svc.us.auth0.com',
    clientId: 'cjOt4vkow5z4bPEMJ307Zthg2I33pLNE',
    redirectUri: (path: string) => {
      return native ? `${config.appId}://dev-kae17svc.us.auth0.com/capacitor/${config.appId}/${path}` : `http://localhost:8100`
    },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

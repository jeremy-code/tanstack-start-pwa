// https://github.com/f1shy-dev/tanstack-start-pwa-experiment/blob/main/src/sw.module.ts

import { clientsClaim, skipWaiting } from "workbox-core";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

const __imports = {
  "workbox-core": {
    clientsClaim,
    skipWaiting,
  },
  "workbox-precaching": {
    cleanupOutdatedCaches,
    createHandlerBoundToURL,
    precacheAndRoute,
  },
  "workbox-routing": {
    NavigationRoute,
    registerRoute,
  },
};

declare global {
  interface GlobalThis {
    __imports?: typeof __imports;
  }
}

(globalThis as GlobalThis).__imports = __imports;

export { __imports };

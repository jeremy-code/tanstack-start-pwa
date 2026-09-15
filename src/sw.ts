/// <reference lib="webworker" />

import { defaultCache } from "@serwist/vite/worker";
import { Serwist, type PrecacheEntry, type SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // https://serwist.pages.dev/docs/build/configuring/injection-point
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  // oxlint-disable-next-line no-underscore-dangle -- This is the convention
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
  },
  skipWaiting: true,
  navigationPreload: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
  offlineAnalyticsConfig: false,
});

serwist.addEventListeners();

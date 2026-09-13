/// <reference lib="webworker" />

// https://github.com/f1shy-dev/tanstack-start-pwa-experiment/blob/main/src/sw.ts

import type { __imports } from "./sw.module";

importScripts("/sw.module.js");

declare let self: ServiceWorkerGlobalScope & {
  __imports: typeof __imports;
  __WB_BUILD_ID: string;
};

const { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } =
  self.__imports["workbox-precaching"];

const { clientsClaim, skipWaiting } = self.__imports["workbox-core"];
const { NavigationRoute, registerRoute } = self.__imports["workbox-routing"];

console.debug(`[sw] 👋 buildId=${self.__WB_BUILD_ID}`);
// self.__WB_MANIFEST is the default injection point
precacheAndRoute([
  ...self.__WB_MANIFEST,
  {
    revision: self.__WB_BUILD_ID,
    url: "/todos",
  },
]);

// clean old assets
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;
const denylist = [/\.js$/, /\.css$/, /\/.vite\//];

// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("/todos"), {
    allowlist,
    denylist,
  }),
);

clientsClaim();
skipWaiting();

self.addEventListener("message", (event) => {
  if (event.data.type === "check_build_id") {
    event.ports[0].postMessage({
      buildId: self.__WB_BUILD_ID,
    });
  }
});

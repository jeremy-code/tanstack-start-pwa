// https://github.com/f1shy-dev/tanstack-start-pwa-experiment/blob/main/src/components/PWAHook.tsx

import { Workbox } from "workbox-window";

const register = async () => {
  const wb = new Workbox("/sw.js", {});

  const registration = await wb.register();
  console.log("[pwa] registered", registration);

  const { buildId } = await wb.messageSW({
    type: "check_build_id",
  });
  console.log("[pwa←sw] buildId", buildId);

  registration?.addEventListener("updatefound", (...evt) => {
    console.log("[pwa] updatefound", evt);
  });
};

if (
  "serviceWorker" in navigator &&
  typeof window !== "undefined" &&
  typeof Workbox !== "undefined"
) {
  register();
}

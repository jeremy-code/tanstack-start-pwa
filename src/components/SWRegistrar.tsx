import { useEffect } from "react";

import type { Serwist } from "@serwist/window";
import { getSerwist } from "virtual:serwist";

const SWRegistrar = () => {
  useEffect(() => {
    const abortController = new AbortController();

    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        const serwist: Serwist | undefined = await getSerwist();

        if (serwist !== undefined && !abortController.signal.aborted) {
          serwist.addEventListener("installed", () => {
            console.info(
              "[serwist] assets have been cached and service worker is now installed",
            );
          });

          await serwist.register();
        }
      }
    };

    void loadSerwist();

    return () => {
      abortController.abort();
    };
  }, []);

  return null;
};

export { SWRegistrar };

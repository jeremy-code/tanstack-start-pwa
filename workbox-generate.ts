// https://github.com/f1shy-dev/tanstack-start-pwa-experiment/blob/main/workbox-generate.ts

import { injectManifest } from "workbox-build";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "rolldown";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function workboxGenerate(buildId: string) {
  const clientDist = resolve(__dirname, "dist/client/");
  const swDest = resolve(clientDist, "sw.js");
  const swImplDest = resolve(clientDist, "sw.module.js");

  await build({
    input: [resolve(__dirname, "src/sw.module.ts")],
    output: {
      file: swImplDest,
      format: "iife",
      minify: true,
      generatedCode: {
        preset: "es2015",
      },
    },
    transform: {
      define: {
        "import.meta.env.DEV": "false",
      },
    },
  });

  await build({
    input: [resolve(__dirname, "src/sw.ts")],
    output: {
      file: swDest,
      format: "esm",
      minify: true,
      generatedCode: {
        preset: "es2015",
      },
    },
    transform: {
      define: {
        "import.meta.env.DEV": "false",
        "self.__WB_BUILD_ID": `"${buildId}"`,
      },
    },
  });

  const { count, warnings, size } = await injectManifest({
    swSrc: swDest,
    swDest: swDest,
    globDirectory: clientDist,
    globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest,json}"],
  });

  if (warnings.length) {
    console.warn("[workbox] warnings:", warnings);
  }
  console.log(
    `[workbox] generated sw.js with ${count} precached files (${(size / 1024).toFixed(1)} KiB)`,
  );
}

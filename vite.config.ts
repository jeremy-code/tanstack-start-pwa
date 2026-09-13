import { cloudflare } from "@cloudflare/vite-plugin";
import {
  createApi,
  createContext,
  dev as serwistDev,
  main as serwistMain,
} from "@serwist/vite";
import type {
  PluginOptions,
  SerwistViteApi,
  SerwistViteContext,
} from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { analyzer } from "vite-bundle-analyzer";

const serwistBuild = (ctx: SerwistViteContext, api: SerwistViteApi): Plugin => {
  return {
    name: "@serwist/vite:build",
    enforce: "post",
    apply: "build",
    // Only run in client environment
    applyToEnvironment(environment) {
      return environment.name === "client";
    },
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.options.disable) {
          await api.generateSW();
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};

const serwist = (userOptions: PluginOptions): Plugin[] => {
  const ctx = createContext(userOptions, undefined);
  const api = createApi(ctx);
  return [serwistMain(ctx, api), serwistBuild(ctx, api), serwistDev(ctx, api)];
};

const isDev = process.env.NODE_ENV !== "production";

const viteConfig = defineConfig({
  plugins: [
    ...(isDev ? [devtools()] : []),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react({ compiler: true }),
    tailwindcss({ optimize: { minify: true } }),
    serwist({
      additionalPrecacheEntries: [{ url: "/", revision: crypto.randomUUID() }],
      swSrc: "src/sw.ts",
      // Otherwise, it attempts to to output it in dist/server/sw.js
      swDest: new URL("dist/client/sw.js", import.meta.url).pathname,
      swUrl: "/sw.js",
      base: "https://tanstack-start-pwa.jeremynguyen.workers.dev/",
      globDirectory: "dist/client",
      globPatterns: [
        "**/*.{js,css,html,png,svg,mp3,webmanifest,json,ico,woff2}",
      ],
      rollupFormat: "iife",
    }),
    ...(process.env.ANALYZE ? [analyzer()] : []),
  ],
});

export default viteConfig;

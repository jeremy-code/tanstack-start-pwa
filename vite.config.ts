import { cloudflare } from "@cloudflare/vite-plugin";
import {
  createApi,
  createContext,
  dev as serwistDev,
  main as serwistMain,
  type PluginOptions,
  type SerwistViteApi,
  type SerwistViteContext,
} from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { analyzer } from "vite-bundle-analyzer";

// https://github.com/serwist/serwist/blob/adf0d79ae8ba7d87cce2251ffc29526955511a2b/packages/vite/src/plugins/build.ts
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
        // ctx.viteConfig.build.ssr is always true
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

// https://github.com/serwist/serwist/blob/adf0d79ae8ba7d87cce2251ffc29526955511a2b/packages/vite/src/index.ts
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
      swSrc: "src/sw.ts",
      // Otherwise, it attempts to to output it in dist/server/sw.js
      swDest: new URL("dist/client/sw.js", import.meta.url).pathname,
      swUrl: "/sw.js",
      globDirectory: "dist/client",
      globPatterns: ["**/*.{js,css,html,png,mp3,webmanifest,json,ico,woff2}"],
      rollupFormat: "iife",
    }),
    ...(process.env.ANALYZE ? [analyzer()] : []),
  ],
  optimizeDeps: {
    include: [
      // virtual:serwist imports "@serwist/window"
      "@serwist/window",
    ],
  },
});

export default viteConfig;

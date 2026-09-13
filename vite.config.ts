import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";

const isDev = process.env.NODE_ENV !== "production";

const viteConfig = defineConfig({
  plugins: [
    ...(isDev ? [devtools()] : []),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react({ compiler: true }),
    tailwindcss({ optimize: { minify: true } }),
    ...(process.env.ANALYZE ? [analyzer()] : []),
  ],
});

export default viteConfig;

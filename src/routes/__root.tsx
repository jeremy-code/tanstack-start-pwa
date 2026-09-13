import "../components/PwaHook";
import type { ReactNode } from "react";

import {
  HeadContent,
  Link,
  ScriptOnce,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import appCss from "../globals.css?url";

const Devtools =
  import.meta.env.DEV ?
    await import("../components/Devtools").then((mod) => mod.Devtools)
  : () => null;

const RootDocument = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <ScriptOnce>
          {`
            if('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
              })
            }
          `}
        </ScriptOnce>
      </head>
      <body className="p-8">
        <div className="container mx-auto pb-4">
          <nav>
            <ol className="list-inside list-disc">
              {(
                [
                  { href: "/", name: "Root" },
                  { href: "/todos", name: "Todos" },
                ] as const
              ).map(({ href, name }) => (
                <li key={href}>
                  <Link
                    className="text-blue-600 underline hover:text-blue-800"
                    to={href}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        {children}
        <Devtools />
        <Scripts />
      </body>
    </html>
  );
};

const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start Starter" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootDocument,
});

export { Route };

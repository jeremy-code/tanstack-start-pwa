import type { ReactNode } from "react";

import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import { Nav } from "../components/Nav";
import appCss from "../globals.css?url";

const Devtools = import.meta.env.DEV
  ? await import("../components/Devtools").then((mod) => mod.Devtools)
  : () => null;

const RootDocument = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="p-8">
        <div className="container mx-auto pb-4">
          <Nav />
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

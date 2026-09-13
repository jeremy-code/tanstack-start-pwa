import type { ReactNode } from "react";

import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

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
      <body>
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
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

export { Route };

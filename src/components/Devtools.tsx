import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

const Devtools = () => {
  return (
    <TanStackDevtools
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
      config={{ position: "bottom-right" }}
    />
  );
};

export { Devtools };

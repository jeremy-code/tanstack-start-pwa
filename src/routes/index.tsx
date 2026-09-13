import { createFileRoute } from "@tanstack/react-router";

const HomeComponent = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  );
};

const Route = createFileRoute("/")({ component: HomeComponent });

export { Route };

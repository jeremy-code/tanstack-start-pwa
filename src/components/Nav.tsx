import { Link } from "@tanstack/react-router";

const NAV_LINKS = [
  { href: "/", name: "Root" },
  { href: "/todos", name: "Todos" },
] as const;

const Nav = () => {
  return (
    <nav>
      <ol className="list-inside list-disc">
        {NAV_LINKS.map(({ href, name }) => (
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
  );
};

export { Nav };

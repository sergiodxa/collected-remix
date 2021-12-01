import { Form, Link, LoaderFunction, NavLink, useLoaderData } from "remix";
import { json, Outlet } from "remix-utils";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  isSignedIn: boolean;
};

let links: { to: string; label: string }[] = [
  { to: "/features", label: "Features" },
  { to: "/blog", label: "Blog" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export let loader: LoaderFunction = async ({ request }) => {
  let auth = await authenticator.isAuthenticated(request);
  return json<LoaderData>({ isSignedIn: Boolean(auth) });
};

export default function Screen() {
  let { isSignedIn } = useLoaderData<LoaderData>();
  return (
    <>
      <header className="mx-auto max-w-screen-lg flex justify-between items-center p-4">
        <Link to="/">
          <span className="sr-only">Collected Notes</span>
          <img
            src="https://beta.collectednotes.com/_next/image?url=%2Ficon.svg&w=256&q=75"
            height={75}
            width={75}
          />
        </Link>

        <nav className="hidden md:flex md:space-x-10">
          {links.map(({ to, label }) => {
            return (
              <NavLink
                key={to}
                to={to}
                className="font-medium text-gray-500 hover:text-gray-900"
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        {isSignedIn ? (
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Logout
            </button>
          </Form>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign In
          </Link>
        )}
      </header>

      <Outlet />
    </>
  );
}

import { Form, Link, LoaderFunction, useLoaderData } from "remix";
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
      <header className="bg-indigo-600">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
            <div className="flex items-center">
              <Link to="/">
                <span className="sr-only">Collected Notes</span>
                <img
                  className="h-10 w-10"
                  src="https://beta.collectednotes.com/_next/image?url=%2Ficon.svg&w=256&q=75"
                  alt=""
                />
              </Link>
              <div className="hidden ml-10 space-x-8 lg:block">
                {links.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    className="text-base font-medium text-white hover:text-indigo-50"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="ml-10 space-x-4">
              {isSignedIn ? (
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
                  >
                    Sign Out
                  </button>
                </Form>
              ) : (
                <Link
                  to="/login"
                  className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
            {links.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="text-base font-medium text-white hover:text-indigo-50"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <Outlet />
    </>
  );
}

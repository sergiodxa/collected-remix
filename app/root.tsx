import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import { useEffect } from "react";
import {
  Link,
  LinksFunction,
  MetaFunction,
  Outlet,
  useCatch,
  useTransition,
} from "remix";
import { Document } from "~/components/document";
import tailwindUrl from "~/styles/tailwind.css";

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindUrl },
    { rel: "stylesheet", href: nProgressStyles },
  ];
};

export let meta: MetaFunction = () => {
  return {
    title: "Collected Notes",
    description: "Your Markdown notes on the internet",
  };
};

export default function App() {
  let transition = useTransition();
  useEffect(() => {
    if (transition.state === "idle") NProgress.done();
    else NProgress.start();
  }, [transition.state]);

  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Something went wrong!">
      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
              500
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  Something went wrong!
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  Please check the URL in the address bar and try again.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  return (
    <Document title={caught.statusText}>
      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
              {caught.status}
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  {caught.statusText}
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  Please check the URL in the address bar and try again.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Document>
  );
}

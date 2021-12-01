import i18next from "i18next";
import { useTranslation } from "react-i18next";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "remix";
import { json } from "remix-utils";
import { authenticator } from "~/services/auth.server";
import { collectedNotes } from "~/services/cn.server";
import { i18n } from "~/services/i18n.server";
import { init } from "~/services/i18next";
import { commitSession, getSession } from "~/services/session.server";

type LoaderData = {
  title: string;
  description: string;
};

export let meta: MetaFunction = (data) => {
  let { title, description } = data as LoaderData;
  return { title, description };
};

export let action: ActionFunction = async ({ request }) => {
  let auth = await authenticator.authenticate("local", request, {
    failureRedirect: "/login",
  });

  let session = await getSession(request);
  session.set(authenticator.sessionKey, auth);

  let headers = new Headers();
  headers.set("Set-Cookie", await commitSession(session));

  let cn = collectedNotes(auth.email, auth.token);
  let [site] = await cn.sites();

  return redirect(`/${site.site_path}`, { headers });
};

export let loader: LoaderFunction = async ({ request }) => {
  let translations = await i18n.getTranslations(request, "common");
  let t = await init();
  i18next.addResourceBundle("en", "common", translations.common);

  let title = t("Sign in to Collected Notes");
  let description = t("Your Markdown notes on the internet");

  return json<LoaderData>({ title, description });
};

export default function Screen() {
  let { t } = useTranslation();
  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://beta.collectednotes.com/_next/image?url=%2Ficon.svg&w=48&q=75"
            alt={t("Collected notes")}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("Sign in to your account")}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form className="space-y-6" method="post">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("Email address")}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("Token")}
                </label>
                <div className="mt-1">
                  <input
                    id="token"
                    name="token"
                    type="password"
                    autoComplete="off"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="https://collectednotes.com/accounts/me/token"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {t("Get your Collected Notes token")}
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t("Sign In")}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

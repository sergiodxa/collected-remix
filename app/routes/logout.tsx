import { ActionFunction, LoaderFunction, redirect } from "remix";
import { destroySession, getSession } from "~/services/session.server";

export let loader: LoaderFunction = async () => {
  return redirect("/");
};

export let action: ActionFunction = async ({ request }) => {
  let session = await getSession(request);
  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

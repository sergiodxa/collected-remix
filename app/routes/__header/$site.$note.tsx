import { differenceInCalendarDays } from "date-fns";
import { LoaderFunction, useLoaderData } from "remix";
import { json } from "remix-utils";
import invariant from "tiny-invariant";
import { HTML, html, read } from "~/services/cn.server";

type LoaderData = HTML;

export let loader: LoaderFunction = async ({ params }) => {
  let { site, note } = params;
  invariant(typeof site === "string", "site must be a string");
  invariant(typeof note === "string", "note must be a string");
  let data = await read(site, note);
  let { body } = await html(data.site_id, data.id);

  let updatedAt = new Date(data.updated_at);
  let delta = differenceInCalendarDays(new Date(), updatedAt);

  let headers = new Headers();

  // if the last update was in the last 7 days, cache for a minute
  if (delta < 7) headers.set("Cache-Control", "public, max-age=60");
  // else cache for an hour
  else headers.set("Cache-Control", "public, max-age=3600");

  return json<LoaderData>(body, { headers });
};

export default function Screen() {
  let __html = useLoaderData<LoaderData>();
  return (
    <article
      className="prose mx-auto prose-xl py-10"
      dangerouslySetInnerHTML={{ __html }}
    />
  );
}

import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { json, notFound } from "remix-utils";
import invariant from "tiny-invariant";
import { Note, Site, site } from "~/services/cn.server";

type LoaderData = {
  site: Site;
  notes: Note[];
};

export let loader: LoaderFunction = async ({ request, params }) => {
  let url = new URL(request.url);
  let page = Number(url.searchParams.get("page") ?? 1);

  invariant(typeof params.site === "string", "A site slug was not provided");

  try {
    let data = await site(params.site, page);
    if (!data.site) throw new Error();

    let headers = new Headers();

    if (data.notes.length > 0) {
      let latestNote = data.notes[0];
      let updatedAt = new Date(latestNote.updated_at);
      let delta = differenceInCalendarDays(new Date(), updatedAt);
      // if the last update was in the last 7 days, cache for a minute
      if (delta < 7) headers.set("Cache-Control", "public, max-age=60");
      // else cache for an hour
      else headers.set("Cache-Control", "public, max-age=3600");
    }

    return json<LoaderData>(data);
  } catch {
    throw notFound({});
  }
};

export default function Screen() {
  let { site, notes } = useLoaderData<LoaderData>();
  return (
    <main className="space-y-10 py-20 mx-auto max-w-screen-md">
      <header>
        <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
          {site.name}
        </h1>
        <p className="text-base pt-2 mb-10">{site.headline}</p>
      </header>

      <ul className="space-y-4">
        {notes.map((note) => {
          return (
            <li key={note.id}>
              <h2 className="text-xl font-bold text-gray-900">
                <Link prefetch="intent" to={note.path}>
                  {note.title}
                </Link>
              </h2>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time
                  dateTime="2020-11-01T04:42:03.163Z"
                  title="2020-11-01T04:42:03.163Z"
                >
                  {formatDistanceToNow(new Date(note.created_at), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

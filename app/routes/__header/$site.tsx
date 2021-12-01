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
    <main className="bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="relative max-w-lg mx-auto divide-y-2 divide-gray-200 lg:max-w-7xl">
        <div>
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
            {site.name}
          </h2>
          <div className="mt-3 sm:mt-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-center">
            <p className="text-xl text-gray-500">{site.headline}</p>
          </div>
        </div>
        <div className="mt-6 pt-10 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
          {notes.map((note) => (
            <div key={note.title}>
              <p className="text-sm text-gray-500">
                <time dateTime={note.created_at}>
                  {formatDistanceToNow(new Date(note.created_at), {
                    addSuffix: true,
                  })}
                </time>
              </p>
              <Link to={note.path} prefetch="intent" className="mt-2 block">
                <p className="text-xl font-semibold text-gray-900">
                  {note.title}
                </p>
                <p className="mt-3 text-base text-gray-500">{note.headline}</p>
              </Link>
              <div className="mt-3">
                <Link
                  to={note.path}
                  prefetch="intent"
                  className="text-base font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Read full story
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

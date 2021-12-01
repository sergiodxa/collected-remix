import { differenceInCalendarDays } from "date-fns";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { json } from "remix-utils";
import invariant from "tiny-invariant";
import { HTML, html, read } from "~/services/cn.server";

type LoaderData = { html: HTML; title: string; description: string };

export let meta: MetaFunction = ({ data }) => {
  let { title, description } = data as LoaderData;
  return { title, description };
};

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

  return json<LoaderData>(
    {
      html: body,
      title: data.title,
      description: data.headline,
    },
    { headers }
  );
};

export default function Screen() {
  let { html } = useLoaderData<LoaderData>();

  return (
    <div className="relative py-16 bg-white overflow-hidden">
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
        <div
          className="relative h-full text-lg max-w-prose mx-auto"
          aria-hidden="true"
        >
          <svg
            className="absolute top-12 left-full transform translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
            />
          </svg>
          <svg
            className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
            />
          </svg>
          <svg
            className="absolute bottom-12 left-full transform translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="d3eb07ae-5182-43e6-857d-35c643af9034"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
            />
          </svg>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div
          className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

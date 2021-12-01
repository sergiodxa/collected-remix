import etag from "etag";
import i18next from "i18next";
import { renderToString } from "react-dom/server";
import type { EntryContext, HandleDataRequestFunction } from "remix";
import { RemixServer } from "remix";
import { RemixI18NextProvider } from "remix-i18next";
import { notModified } from "remix-utils";
import { init } from "./services/i18next";

export default async function handleRequest(
  request: Request,
  status: number,
  headers: Headers,
  remixContext: EntryContext
) {
  await init();

  let markup = renderToString(
    <RemixI18NextProvider i18n={i18next}>
      <RemixServer context={remixContext} url={request.url} />
    </RemixI18NextProvider>
  );

  headers.set("Content-Type", "text/html");
  headers.set("ETag", etag(markup));

  if (request.headers.get("If-None-Match") === headers.get("ETag")) {
    return notModified({ headers });
  }

  return new Response("<!DOCTYPE html>" + markup, { status, headers });
}

export let handleDataRequest: HandleDataRequestFunction = async (
  response: Response,
  { request }
) => {
  let body = await response.text();

  if (request.method.toLowerCase() === "get") {
    response.headers.set("etag", etag(body));
    if (request.headers.get("If-None-Match") === response.headers.get("ETag")) {
      return notModified({ headers: response.headers });
    }
  }

  return response;
};

import type { HTML, Note } from "collected-notes";

export * from "collected-notes";

type Result = {
  body: HTML;
  note: Note;
};

export async function html(site: number, note: number): Promise<Result> {
  let response = await fetch(
    `https://collectednotes.com/sites/${site}/notes/${note}/body`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return await response.json();
}

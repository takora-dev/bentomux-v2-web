/* Builds `src/content/docs-search.json` from the HTML `next build` prerenders
   for /docs. The docs are hand-written TSX pages, so the built article is the
   only place the prose exists as text — reading it here is what keeps the index
   from becoming a second copy of the copy to maintain.
   Run by `postbuild`; `npm run search:index` re-runs it alone. */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const APP_DIR = ".next/server/app";
const OUT_FILE = "src/content/docs-search.json";

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/* Must agree with DocsToc's slugify, or a search result deep-links to an
   anchor the page does not have. Both walk the headings in document order and
   count repeats, which is why this runs while splitting rather than on the
   finished record. */
function anchor(text, seen) {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count ? `${base}-${count}` : base;
}

function textOf(html) {
  return html
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, body) => {
      if (body[0] === "#") {
        const code = body[1] === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
      }
      return ENTITIES[body.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const dir = join(APP_DIR, "docs");
  const sources = [{ file: join(APP_DIR, "docs.html"), url: "/docs" }];
  for (const name of await readdir(dir)) {
    if (name.endsWith(".html")) {
      sources.push({ file: join(dir, name), url: `/docs/${name.slice(0, -".html".length)}` });
    }
  }

  const records = [];
  for (const { file, url } of sources) {
    const html = await readFile(file, "utf8");
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
    if (!article) continue;
    const title = textOf(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");

    /* One record per heading: the anchor is what a result should deep-link to,
       and the body is only the prose under it. */
    const tokens = article.split(/(<h[123]\b[^>]*>)/);
    const seen = new Map();
    let heading = "";
    let level = 1;
    let body = [];
    const flush = () => {
      const text = textOf(body.join(" "));
      body = [];
      /* No anchor for the h1: DocsToc lists h2/h3 only, and the top of the page
         is where a reader lands from the page link anyway. */
      if (text) records.push({ u: url, t: title, h: heading, a: level === 1 ? "" : anchor(heading, seen), x: text });
    };
    for (let i = 0; i < tokens.length; i += 1) {
      if (!tokens[i].startsWith("<h")) {
        body.push(tokens[i]);
        continue;
      }
      flush();
      level = Number(tokens[i][2]);
      const rest = tokens[i + 1] ?? "";
      const match = rest.match(/^([\s\S]*?)<\/h[123]>([\s\S]*)$/);
      heading = match ? textOf(match[1]) : textOf(rest);
      body.push(match ? match[2] : "");
    }
    flush();
  }

  /* The one check worth leaving behind: DocsToc rebuilds these anchors in the
     browser from the same rule, and a search result pointing at an anchor the
     page does not have is a dead link nothing else would catch. */
  const seen = new Set();
  for (const record of records) {
    if (!record.x) throw new Error(`empty section: ${record.u} ${record.h}`);
    if (record.a && seen.has(`${record.u}#${record.a}`)) {
      throw new Error(`duplicate anchor: ${record.u}#${record.a}`);
    }
    seen.add(`${record.u}#${record.a}`);
  }

  await writeFile(OUT_FILE, JSON.stringify(records));
  const pages = new Set(records.map((record) => record.u)).size;
  console.log(`[docs-search] ${records.length} sections from ${pages} pages → ${OUT_FILE}`);
}

await main();

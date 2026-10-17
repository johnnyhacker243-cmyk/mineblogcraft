import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { fetchPublic } from "./rss-network.mjs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
export function parsePapers(xml, cutoff, now = new Date()) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true)
    throw Error("Invalid Atom document");
  const feed = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    parseTagValue: false,
  }).parse(xml).feed;
  if (!feed) throw Error("Expected Atom feed");
  const entries = feed.entry
    ? Array.isArray(feed.entry)
      ? feed.entry
      : [feed.entry]
    : [];
  const rows = [];
  const text = (x) =>
    String(x || "")
      .replace(/\s+/g, " ")
      .trim();
  for (const e of entries) {
    const raw = String(e.id || "").match(
      /^https?:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})(v\d+)?$/,
    );
    const authors = (Array.isArray(e.author) ? e.author : [e.author])
      .filter(Boolean)
      .map((a) => text(a.name))
      .filter(Boolean);
    const published = new Date(e.published),
      updated = new Date(e.updated || e.published);
    if (
      !raw ||
      !text(e.title) ||
      !text(e.summary) ||
      !authors.length ||
      !Number.isFinite(+published) ||
      !Number.isFinite(+updated)
    )
      throw Error("Invalid paper metadata");
    if (published < cutoff || published > now) continue;
    rows.push({
      id: raw[1],
      version: raw[2] || null,
      title: text(e.title),
      authors,
      published: published.toISOString(),
      updated: updated.toISOString(),
      summary: text(e.summary),
      url: "https://arxiv.org/abs/" + raw[1] + (raw[2] || ""),
      source: "arXiv",
      publicationStatus: "preprint",
    });
  }
  return [...new Map(rows.map((p) => [p.id, p])).values()];
}
async function main() {
  const args = process.argv.slice(2),
    get = (key, fallback) => {
      const i = args.indexOf(key);
      return i < 0 ? fallback : args[i + 1];
    };
  const query = get("--query", 'all:"AI agent"'),
    limit = Number(get("--limit", "10")),
    days = Number(get("--days", "30"));
  if (
    !query ||
    query.length > 500 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(days) ||
    days < 1 ||
    days > 3650
  )
    throw Error("Invalid query, limit or days");
  const now = new Date(),
    cutoff = new Date(+now - days * 86400000);
  const url = new URL("https://export.arxiv.org/api/query");
  url.search = new URLSearchParams({
    search_query: query,
    start: "0",
    max_results: String(limit),
    sortBy: "submittedDate",
    sortOrder: "descending",
  });
  const xml = await fetchPublic(url.href, AbortSignal.timeout(30000), [
    "export.arxiv.org",
    "arxiv.org",
  ]);
  const fetched = parsePapers(xml, cutoff, now),
    output = "public/data/research-candidates.json";
  let old = [];
  try {
    old = JSON.parse(await readFile(output, "utf8"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  if (!Array.isArray(old)) throw Error("Invalid previous candidate file");
  const ids = new Set(old.map((p) => p.id)),
    merged = new Map(old.map((p) => [p.id, p]));
  for (const p of fetched) merged.set(p.id, p);
  const result = [...merged.values()].sort((a, b) =>
    b.published.localeCompare(a.published),
  );
  if (fetched.length && JSON.stringify(result) !== JSON.stringify(old)) {
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output + ".tmp", JSON.stringify(result, null, 2) + "\n");
    await rename(output + ".tmp", output);
  }
  console.log(
    JSON.stringify({
      time: now.toISOString(),
      task: "collect-papers",
      query,
      fetched: fetched.length,
      new: fetched.filter((p) => !ids.has(p.id)).length,
      saved: result.length,
      result: "passed",
      error: null,
      run_id: "papers-" + now.toISOString(),
    }),
  );
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((e) => {
    console.error(
      JSON.stringify({
        time: new Date().toISOString(),
        task: "collect-papers",
        result: "failed",
        error: e.message,
      }),
    );
    process.exitCode = 1;
  });

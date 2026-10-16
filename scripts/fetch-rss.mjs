import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { fetchPublic } from "./rss-network.mjs";
import { fileURLToPath } from "node:url";
import {
  parseFeed,
  validateSources,
  xmlEscape,
  preserveFailedSnapshot,
} from "./rss-core.mjs";
const root = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));
const sources = await read("config/rssSources.json");
validateSources(sources);
const allowlist = await read("config/rssAllowlist.json");
const output = new URL("public/data/rss/", root);
await mkdir(output, { recursive: true });
let old = [];
try {
  old = await read("public/data/rss/items.json");
} catch {}
let oldSources = [];
try {
  oldSources = await read("public/data/rss/sources.json");
} catch {}
const runId = new Date().toISOString();
const results = [];
let index = 0;
async function worker() {
  while (index < sources.length) {
    const s = sources[index++];
    const previous = oldSources.find(
      (x) => x.id === s.id && x.feedUrl === s.feedUrl,
    );
    const start = Date.now();
    let items = previous ? old.filter((i) => i.sourceId === s.id) : [],
      state = {
        ...s,
        lastCheckedAt: runId,
        lastSuccessAt: previous?.lastSuccessAt ?? null,
        status: "unverified",
        verificationStatus: "unverified",
        error: null,
      };
    if (s.enabled && !process.argv.includes("--offline")) {
      try {
        const parsed = parseFeed(
          await fetchPublic(s.feedUrl, AbortSignal.timeout(20000), allowlist),
          s,
          runId,
        );
        // A syntactically valid but empty response must not erase a previous useful snapshot.
        if (!parsed.items.length) throw Error("EMPTY_FEED");
        const filtered = parsed.items.filter(
          (item) =>
            !(s.excludeTitleKeywords ?? []).some((keyword) =>
              item.title.includes(keyword),
            ),
        );
        if (!filtered.length) throw Error("EMPTY_AFTER_EDITORIAL_FILTER");
        items = filtered.slice(0, 30);
        state = {
          ...state,
          status: "online",
          verificationStatus: "verified",
          feedTitle: parsed.title,
          format: parsed.format,
          lastSuccessAt: runId,
          editorialFilteredCount: parsed.items.length - filtered.length,
        };
      } catch (e) {
        const error = String(
          e.name === "TimeoutError" ? "TIMEOUT" : e.message,
        ).slice(0, 180);
        ({ state, items } = preserveFailedSnapshot(
          s,
          previous,
          items,
          error,
          runId,
        ));
      }
    } else {
      state = {
        ...state,
        status: items.length ? "cached" : "unverified",
        verificationStatus: previous?.verificationStatus ?? "unverified",
        lastCheckedAt: previous?.lastCheckedAt ?? null,
        lastSuccessAt: previous?.lastSuccessAt ?? null,
        error: previous?.error ?? null,
      };
    }
    results.push({ state, items, elapsedMs: Date.now() - start });
    console.log(
      `${s.id}: ${state.status} (${items.length} entries)${state.error ? " " + state.error : ""}`,
    );
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
results.sort(
  (a, b) =>
    sources.findIndex((s) => s.id === a.state.id) -
    sources.findIndex((s) => s.id === b.state.id),
);
const items = results
  .flatMap((r) => r.items)
  .sort(
    (a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
      a.id.localeCompare(b.id),
  );
async function atomic(name, data) {
  const path = new URL(name, output),
    temp = new URL(name + ".tmp", output);
  await writeFile(temp, JSON.stringify(data, null, 2) + "\n");
  await rename(temp, path);
}
await atomic(
  "sources.json",
  results.map((r) => r.state),
);
await atomic("items.json", items);
await atomic("fetch-report.json", {
  runId,
  mode: process.argv.includes("--offline") ? "offline" : "network",
  sources: results.map(({ state, elapsedMs, items }) => ({
    id: state.id,
    status: state.status,
    error: state.error,
    elapsedMs,
    itemCount: items.length,
  })),
});
const outlines = sources
  .filter((s) => s.enabled && s.publicInOpml)
  .map(
    (s) =>
      `<outline text="${xmlEscape(s.name)}" title="${xmlEscape(s.name)}" type="rss" xmlUrl="${xmlEscape(s.feedUrl)}" htmlUrl="${xmlEscape(s.siteUrl)}"/>`,
  );
await writeFile(
  new URL("subscriptions.opml", output),
  `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0"><head><title>Mineblogcraft subscriptions</title></head><body>${outlines.join("\n")}</body></opml>\n`,
);
console.log(`Snapshot: ${items.length} entries → ${fileURLToPath(output)}`);
if (!process.argv.includes("--offline")) await import("./check-rss-access.mjs");

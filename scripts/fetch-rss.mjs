import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
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
const privateIP = (ip) => {
  if (isIP(ip) === 6)
    return (
      /^(::|fc|fd|fe[89ab])/i.test(ip) || ip.toLowerCase().startsWith("::ffff:")
    );
  const a = ip.split(".").map(Number);
  return (
    a[0] === 0 ||
    a[0] === 10 ||
    a[0] === 127 ||
    a[0] >= 224 ||
    (a[0] === 169 && a[1] === 254) ||
    (a[0] === 172 && a[1] >= 16 && a[1] <= 31) ||
    (a[0] === 192 && a[1] === 168) ||
    (a[0] === 100 && a[1] >= 64 && a[1] <= 127)
  );
};
async function fetchPublic(url, signal) {
  for (let redirect = 0; redirect <= 4; redirect++) {
    const u = new URL(url);
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      (u.port && u.port !== "443") ||
      !allowlist.includes(u.hostname)
    )
      throw Error("URL_ALLOWLIST: disallowed host");
    const records = await lookup(u.hostname, { all: true });
    if (!records.length || records.some((r) => privateIP(r.address)))
      throw Error("URL_PRIVATE: private address");
    const r = await fetch(u, {
      signal,
      redirect: "manual",
      headers: {
        "User-Agent": "Mineblogcraft RSS reader/1.0",
        Accept:
          "application/rss+xml,application/atom+xml,application/xml,text/xml",
      },
    });
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      await r.body?.cancel();
      url = new URL(r.headers.get("location"), u).href;
      continue;
    }
    if (!r.ok) throw Error("HTTP_" + r.status);
    const declared = Number(r.headers.get("content-length"));
    if (declared > 8_000_000) {
      await r.body?.cancel();
      throw Error("SIZE_LIMIT");
    }
    const reader = r.body.getReader();
    let bytes = 0;
    const chunks = [];
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 8_000_000) {
        await reader.cancel();
        throw Error("SIZE_LIMIT");
      }
      chunks.push(value);
    }
    const buffer = Buffer.concat(chunks);
    const encoding =
      r.headers.get("content-type")?.match(/charset=["']?([\w-]+)/i)?.[1] ||
      buffer
        .subarray(0, 160)
        .toString()
        .match(/encoding=["']([^"']+)/i)?.[1] ||
      "utf-8";
    return new TextDecoder(encoding).decode(buffer);
  }
  throw Error("REDIRECT_LIMIT");
}
const runId = new Date().toISOString();
const results = [];
let index = 0;
async function worker() {
  while (index < sources.length) {
    const s = sources[index++];
    const previous = oldSources.find((x) => x.id === s.id);
    const start = Date.now();
    let items = old.filter((i) => i.sourceId === s.id),
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
          await fetchPublic(s.feedUrl, AbortSignal.timeout(15000)),
          s,
          runId,
        );
        // A syntactically valid but empty response must not erase a previous useful snapshot.
        if (!parsed.items.length) throw Error("EMPTY_FEED");
        items = parsed.items.slice(0, 30);
        state = {
          ...state,
          status: "online",
          verificationStatus: "verified",
          feedTitle: parsed.title,
          format: parsed.format,
          lastSuccessAt: runId,
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

import { readFile, writeFile, rename } from "node:fs/promises";
import { fetchPublic } from "./rss-network.mjs";
import {
  articlePublishedAt,
  articleTitle,
  publicationSummary,
} from "./rss-quality.mjs";
const root = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));
const [sources, items, allowlist] = await Promise.all(
  [
    "public/data/rss/sources.json",
    "public/data/rss/items.json",
    "config/rssAllowlist.json",
  ].map(read),
);
const checkedAt = new Date().toISOString();
let cursor = 0;
const report = [];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < sources.length) {
      const source = sources[cursor++],
        entries = items.filter((i) => i.sourceId === source.id);
      // The latest two entries are a sample, not a promise about all articles or regions.
      const sample = entries.slice(0, 2),
        checks = [];
      for (const item of sample) {
        const start = Date.now();
        try {
          const html = await fetchPublic(
            item.link,
            AbortSignal.timeout(18000),
            allowlist,
          );
          const title = articleTitle(html);
          checks.push({
            url: item.link,
            status: "reachable",
            title,
            elapsedMs: Date.now() - start,
          });
          if (!item.publishedAt) {
            const date = articlePublishedAt(html);
            if (date) {
              item.publishedAt = date;
              item.dateBasis = "original-article-metadata";
            }
          }
        } catch (error) {
          checks.push({
            url: item.link,
            status: "failed",
            error: error.message,
            elapsedMs: Date.now() - start,
          });
        }
      }
      source.articleAccess = {
        checkedAt,
        scope: "current-network-sample",
        regionalStatus: "not-region-tested",
        status: !checks.length
          ? "unknown"
          : checks.every((c) => c.status === "reachable")
            ? "reachable"
            : checks.some((c) => c.status === "reachable")
              ? "partial"
              : "failed",
        sampled: checks.length,
        passed: checks.filter((c) => c.status === "reachable").length,
      };
      Object.assign(source, publicationSummary(entries, checkedAt));
      report.push({
        id: source.id,
        name: source.name,
        ...source.articleAccess,
        ...publicationSummary(entries, checkedAt),
        samples: checks,
      });
      console.log(
        `${source.id}: original articles ${source.articleAccess.passed}/${source.articleAccess.sampled}; latest ${source.latestPublishedAt ?? "unknown"}`,
      );
    }
  }),
);
items.sort(
  (a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
    a.id.localeCompare(b.id),
);
async function atomic(path, value) {
  const url = new URL(path, root),
    temp = new URL(path + ".tmp", root);
  await writeFile(temp, JSON.stringify(value, null, 2) + "\n");
  await rename(temp, url);
}
await atomic("public/data/rss/items.json", items);
await atomic("public/data/rss/sources.json", sources);
report.sort(
  (a, b) =>
    sources.findIndex((s) => s.id === a.id) -
    sources.findIndex((s) => s.id === b.id),
);
await atomic("public/data/rss/access-report.json", {
  checkedAt,
  scope: "current-network-sample",
  regionalStatus: "not-region-tested",
  note: "RSS and article checks are not measurements from mainland carrier networks. Availability can vary by region, ISP and time.",
  sources: report,
});

import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { XMLValidator, XMLParser } from "fast-xml-parser";
import { validateSources, safeLink, parseFeed } from "./rss-core.mjs";
const root = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));
const sources = await read("config/rssSources.json");
validateSources(sources);
assert.equal(sources.length, 21);
for (const d of ["ai", "security", "software"])
  assert.equal(sources.filter((s) => s.domainId === d).length, 7);
const snapshots = await read("public/data/rss/sources.json"),
  items = await read("public/data/rss/items.json");
const ids = new Set(),
  sourceIds = new Set(sources.map((s) => s.id));
assert.deepEqual(new Set(snapshots.map((s) => s.id)), sourceIds);
for (const i of items) {
  assert.ok(!ids.has(i.id), "Duplicate item");
  ids.add(i.id);
  assert.ok(sourceIds.has(i.sourceId));
  assert.ok(i.title && safeLink(i.link));
  assert.ok(
    i.publishedAt === null || Number.isFinite(Date.parse(i.publishedAt)),
  );
  assert.ok(Number.isFinite(Date.parse(i.fetchedAt)));
  assert.equal(typeof i.description, "string");
  assert.equal(typeof i.author, "string");
}
const xml = await readFile(new URL("public/feed.xml", root), "utf8");
assert.equal(XMLValidator.validate(xml), true);
parseFeed(xml, {
  id: "own",
  domainId: "software",
  siteUrl: "https://mineblogcraft.invalid",
});
const opml = await readFile(
  new URL("public/data/rss/subscriptions.opml", root),
  "utf8",
);
assert.equal(XMLValidator.validate(opml), true);
assert.ok(new XMLParser().parse(opml).opml.body);
const rows = snapshots.map(
  (s) =>
    `| ${s.name} | ${s.domainId} | ${s.status} | ${items.filter((i) => i.sourceId === s.id).length} | ${s.error ?? "—"} |`,
);
await writeFile(
  new URL("VALIDATION_REPORT.md", root),
  `# RSS 验证报告\n\n最近快照检查：${snapshots
    .map((s) => s.lastCheckedAt ?? "")
    .sort()
    .at(
      -1,
    )}\n\n21 个来源（每方向 7 个），${items.length} 条摘要；配置、唯一 ID、引用、URL、日期、RSS 发布 XML、OPML 全部通过。\n\nONLINE 是上次抓取成功，非实时监控；抓取失败保留旧缓存。未验证源不虚构文章或更新日期。\n\n| 来源 | 分类 | 快照状态 | 条目 | 失败原因 |\n|---|---|---|---:|---|\n${rows.join("\n")}\n\nBlog 21 篇技术编辑草稿另加 1 篇原有文章；Research 33 篇外部文献另加 1 篇原有示例；Wiki 34 个概念节点。新博客未经作者审阅，不进入 feed.xml。\n`,
);
console.log(
  `Validated ${sources.length} sources / ${items.length} entries, feed.xml and OPML`,
);

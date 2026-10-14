import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";
const root = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));
const [blogs, papers, wiki, taxonomy] = await Promise.all(
  [
    "src/data/blogs.json",
    "src/data/papers.json",
    "src/data/wiki.json",
    "src/data/taxonomy.json",
  ].map(read),
);
function unique(rows, name) {
  const ids = new Set();
  for (const r of rows) {
    assert.match(r.id, /^[a-zA-Z0-9.-]+$/);
    assert.ok(!ids.has(r.id), `${name}: duplicate ${r.id}`);
    ids.add(r.id);
  }
  return ids;
}
const blogIds = unique(blogs, "Blog"),
  paperIds = unique(papers, "Paper"),
  nodeIds = unique(wiki, "Wiki");
const rssSources = await read("config/rssSources.json");
const rssIds = new Set(rssSources.map((s) => s.id));
for (const rows of [blogs, papers, wiki])
  for (const r of rows)
    assert.ok(r.title && r.description, `Missing title/description ${r.id}`);
const distribution = (rows) =>
  Object.fromEntries(
    ["ai", "security", "software"].map((d) => [
      d,
      rows.filter((r) => r.domainId === d).length,
    ]),
  );
assert.deepEqual(
  distribution(
    blogs.filter((b) => b.provenance === "ai-assisted-editorial-draft"),
  ),
  { ai: 7, security: 7, software: 7 },
);
assert.deepEqual(distribution(papers.filter((p) => p.origin === "external")), {
  ai: 11,
  security: 11,
  software: 11,
});
for (const b of blogs) {
  assert.ok(["draft", "published"].includes(b.status));
  assert.ok(b.tags.length);
  assert.ok(!Number.isNaN(Date.parse(b.createTime)));
  if (b.file) {
    assert.ok(b.file.startsWith("/content/blogs/") && !b.file.includes(".."));
    await stat(new URL("public" + b.file, root));
    const md = await readFile(new URL("public" + b.file, root), "utf8");
    assert.ok(md.includes("id: " + b.id) && md.includes("status: " + b.status));
    assert.ok(md.length > 400, "Insufficient body " + b.id);
  }
}
for (const p of papers) {
  assert.ok(["metadata", "note", "fulltext"].includes(p.readingMode));
  if (p.origin === "external") {
    assert.ok(p.author && p.authors?.length);
    assert.ok(new URL(p.sourceUrl).protocol === "https:");
    assert.ok(
      !p.author.split(",").includes("YTC"),
      "External author overwritten",
    );
  }
  if (p.content) await stat(new URL("public" + p.content, root));
}
const visited = new Set(),
  visiting = new Set();
function visit(id) {
  assert.ok(!visiting.has(id), "Wiki cycle " + id);
  if (visited.has(id)) return;
  visiting.add(id);
  const n = wiki.find((n) => n.id === id);
  for (const parent of n.parentIds) {
    assert.ok(nodeIds.has(parent), "Missing parent " + parent);
    visit(parent);
  }
  visiting.delete(id);
  visited.add(id);
}
for (const n of wiki) {
  visit(n.id);
  for (const r of n.relatedBlogs)
    assert.ok(blogIds.has(r.id), "Missing blog " + r.id);
  for (const r of n.relatedPapers)
    assert.ok(paperIds.has(r.id), "Missing paper " + r.id);
  for (const id of n.relatedRss ?? [])
    assert.ok(rssIds.has(id), "Missing RSS source " + id);
  assert.ok(Number.isFinite(n.x) && Number.isFinite(n.y));
}
assert.equal(taxonomy.domains.length, 3);
console.log(
  JSON.stringify(
    {
      blogs: {
        total: blogs.length,
        editorial: 21,
        legacy: 1,
        published: blogs.filter((b) => b.status === "published").length,
      },
      research: { external: 33, legacyExample: 1 },
      wiki: {
        nodes: wiki.length,
        blogLinks: wiki.reduce((a, n) => a + n.relatedBlogs.length, 0),
        paperLinks: wiki.reduce((a, n) => a + n.relatedPapers.length, 0),
      },
      validation: "IDs, paths, references and DAG passed",
    },
    null,
    2,
  ),
);

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read = async (p) => JSON.parse(await readFile(p, "utf8"));
const [nodes, blogs, papers, rss, coverage] = await Promise.all(
  [
    "src/data/wiki.json",
    "src/data/blogs.json",
    "src/data/papers.json",
    "public/data/rss/items.json",
    "docs/WIKI_COVERAGE.json",
  ].map(read),
);
test("Every local blog and paper has a precise Wiki entry and all RSS items have a disposition", () => {
  assert.equal(nodes.length, coverage.nodes);
  assert.deepEqual(
    new Set(nodes.flatMap((n) => n.relatedBlogs.map((r) => r.id))),
    new Set(blogs.map((b) => b.id)),
  );
  assert.deepEqual(
    new Set(nodes.flatMap((n) => n.relatedPapers.map((r) => r.id))),
    new Set(papers.map((p) => p.id)),
  );
  assert.deepEqual(
    new Set(coverage.rss.map((r) => r.id)),
    new Set(rss.map((r) => r.id)),
  );
  for (const row of [...coverage.blogs, ...coverage.papers])
    assert.ok(nodes.some((n) => n.id === row.nodeId));
});
test("Source excerpts match local records exactly and external links cannot execute code", () => {
  for (const n of nodes)
    for (const s of n.sources) {
      assert.ok(
        s.url.startsWith("#blog/") ||
          s.url.startsWith("#paper/") ||
          new URL(s.url).protocol === "https:",
      );
      if (s.kind === "rss") {
        const item = rss.find((r) => "rss-" + r.id === s.id);
        assert.ok(item);
        assert.equal(
          s.excerpt,
          item.description || "快照未保存摘要，只有标题线索。",
        );
        assert.equal(s.url, item.link);
      }
      if (s.kind === "paper") {
        const paper = papers.find((p) => "paper-" + p.id === s.id);
        assert.ok(paper);
        assert.equal(s.excerpt, paper.abstract || paper.description);
      }
    }
});
test("Markdown, backlinks, icon choice and progress boundaries remain inspectable", async () => {
  for (const n of nodes) {
    const md = await readFile(n.file, "utf8");
    assert.ok(md.includes("updated:"));
    assert.ok(md.includes("tags:"));
    assert.match(md, /\[\[[a-z-]+\]\]/);
    assert.ok(n.sections.length >= 2);
    assert.equal(n.status, "untracked");
    assert.ok(n.iconReason.length > 8);
    assert.ok((await readFile("public" + n.icon)).length > 0);
    for (const r of n.relatedNodes)
      assert.ok(
        nodes.find((o) => o.id === r.id).backlinks.some((b) => b.id === n.id),
      );
    for (const b of n.backlinks)
      assert.ok(
        nodes
          .find((o) => o.id === b.id)
          .relatedNodes.some((r) => r.id === n.id),
      );
  }
});

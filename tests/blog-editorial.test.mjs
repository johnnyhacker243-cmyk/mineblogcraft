import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const blogs = JSON.parse(await read("src/data/blogs.json"));
const icons = JSON.parse(await read("config/blogIcons.json"));
const series = blogs
  .filter((b) => b.dateMeaning === "editorial-series")
  .sort((a, b) => a.seriesIndex - b.seriesIndex);
const js = ts.transpileModule(await read("src/services/BlogMarkdown.ts"), {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { parseBlogMarkdown } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);

test("Editorial series has one entry per day, rotates domains, and preserves actual revision dates", () => {
  assert.equal(series.length, 21);
  assert.equal(new Set(series.map((b) => b.id)).size, 21);
  assert.equal(blogs.filter((b) => b.id === "mineblogcraft-birth").length, 1);
  series.forEach((blog, index) => {
    assert.equal(
      blog.createTime,
      new Date(Date.UTC(2026, 8, 20 + index)).toISOString().slice(0, 10),
    );
    assert.equal(blog.seriesIndex, index + 1);
    assert.equal(blog.domainId, ["ai", "security", "software"][index % 3]);
    assert.equal(blog.updatedAt, "2026-10-15");
    assert.equal(
      blog.status,
      "published",
      "User-approved articles are published without changing editorial dates",
    );
    assert.equal(blog.provenance, "ai-assisted-editorial-reviewed");
    assert.equal(blog.reviewStatus, "reviewed");
    assert.equal(blog.reviewedAt, "2026-10-17");
    assert.equal(blog.publishedAt, "2026-10-17");
  });
});

test("Each article carries a topic-specific original item shared by list and reader", () => {
  assert.equal(new Set(series.map((b) => b.image)).size, 21);
  for (const blog of series) {
    const icon = icons[blog.iconKey];
    assert.ok(icon, blog.id);
    assert.equal(blog.iconLabel, icon.label);
    assert.equal(blog.iconReason, icon.reason);
    assert.equal(
      icon.source,
      `assets/minecraft/textures/item/${blog.iconKey}.png`,
    );
    assert.equal(
      blog.image,
      `/assets/inventory/blog-icons/${blog.iconKey}.png`,
    );
  }
});

test("Bodies retain structure and individual paragraphs; dated sources precede the editorial slot", async () => {
  const paragraphs = new Map();
  for (const blog of series) {
    const body = await read("public" + blog.file);
    assert.ok(body.includes(`date: ${blog.createTime}`));
    assert.ok(body.includes(`updatedAt: ${blog.updatedAt}`));
    const blocks = parseBlogMarkdown(body);
    assert.equal(blocks[0].text, blog.title);
    assert.ok(blocks.filter((b) => b.kind === "heading").length >= 6, blog.id);
    assert.ok((body.match(/[\u4e00-\u9fff]/g) ?? []).length >= 700, blog.id);
    for (const block of blocks)
      if (block.kind === "paragraph" && block.text.length > 60) {
        assert.ok(
          !paragraphs.has(block.text),
          `Repeated editorial paragraph: ${blog.id} / ${paragraphs.get(block.text)}`,
        );
        paragraphs.set(block.text, blog.id);
      }
    assert.ok(blog.sources.length >= 1);
    for (const source of blog.sources) {
      assert.equal(new URL(source.url).protocol, "https:");
      assert.ok(source.title.length > 12);
      assert.equal(source.checkedAt, "2026-10-15");
      if (source.publishedAt)
        assert.ok(source.publishedAt <= blog.createTime, blog.id);
    }
  }
});

test("Wiki links use the revised titles and every daily article remains discoverable", async () => {
  const wiki = JSON.parse(await read("src/data/wiki.json"));
  const links = wiki.flatMap((n) => n.relatedBlogs);
  for (const link of links)
    assert.equal(link.title, blogs.find((b) => b.id === link.id)?.title);
  for (const blog of series)
    assert.ok(
      links.some((l) => l.id === blog.id),
      blog.id,
    );
});

test("Text-only Markdown preserves code indentation, paragraphs, headings and untrusted text", () => {
  const sample =
    "---\nid: sample\n---\n# 标题\n\n第一行\n第二行\n\n```html\n  <script>alert(1)</script>\n\n```\n\n- 项目\n> 引用\n";
  assert.deepEqual(parseBlogMarkdown(sample), [
    { kind: "heading", level: 1, text: "标题" },
    { kind: "paragraph", text: "第一行 第二行" },
    {
      kind: "code",
      language: "html",
      lines: ["  <script>alert(1)</script>", ""],
    },
    { kind: "item", text: "项目" },
    { kind: "quote", text: "引用" },
  ]);
  assert.deepEqual(parseBlogMarkdown("```text\n  unfinished"), [
    { kind: "code", language: "text", lines: ["  unfinished"] },
  ]);
});

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { XMLValidator } from "fast-xml-parser";
import { xmlEscape as escape } from "./rss-core.mjs";
const root = new URL("../", import.meta.url);
const blogs = JSON.parse(
  await readFile(new URL("src/data/blogs.json", root), "utf8"),
);
const base = new URL(
  process.env.BLOG_BASE_URL ||
    "https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/",
);
if (
  !["https:", "http:"].includes(base.protocol) ||
  base.username ||
  base.password
)
  throw Error("Invalid BLOG_BASE_URL");
const published = [];
for (const blog of blogs) {
  if (blog.status !== "published") continue;
  if (blog.file) {
    const markdown = await readFile(
      new URL("public" + blog.file, root),
      "utf8",
    );
    const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    if (!frontmatter) throw Error("Missing Markdown metadata: " + blog.id);
    const metadata = Object.fromEntries(
      frontmatter.split(/\r?\n/).map((line) => {
        const colon = line.indexOf(":");
        return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
      }),
    );
    if (
      metadata.id !== blog.id ||
      metadata.status !== "published" ||
      metadata.date !== blog.createTime
    )
      throw Error("Markdown metadata mismatch: " + blog.id);
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(blog.createTime) ||
    !Number.isFinite(Date.parse(blog.createTime))
  )
    throw Error("Invalid publish date: " + blog.id);
  published.push(blog);
}
published.sort(
  (a, b) =>
    b.createTime.localeCompare(a.createTime) || a.id.localeCompare(b.id),
);
const items = published.map((blog) => {
  const url = new URL(base);
  url.hash = `blog/${encodeURIComponent(blog.id)}`;
  return `<item><title>${escape(blog.title)}</title><link>${escape(url.href)}</link><guid isPermaLink="true">${escape(url.href)}</guid><pubDate>${new Date(`${blog.createTime}T00:00:00+08:00`).toUTCString()}</pubDate><description>${escape(blog.description)}</description><category>${escape(blog.category)}</category></item>`;
});
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Mineblogcraft</title><link>${escape(base.href)}</link><atom:link href="${escape(new URL("feed.xml", base).href)}" rel="self" type="application/rss+xml"/><description>Minecraft 风格个人技术博客</description><language>zh-CN</language>${items.join("\n")}</channel></rss>\n`;
if (XMLValidator.validate(xml) !== true)
  throw Error("Generated feed is invalid XML");
await writeFile(new URL("public/feed.xml", root), xml);
console.log(
  `Generated ${items.length} RSS items: ${fileURLToPath(new URL("public/feed.xml", root))}`,
);

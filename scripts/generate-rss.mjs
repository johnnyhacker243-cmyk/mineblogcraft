import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const blogs = JSON.parse(
  await readFile(new URL("src/data/blogs.json", root), "utf8"),
);
const base = new URL(process.env.BLOG_BASE_URL || "http://127.0.0.1:5173/");
const escape = (text) =>
  String(text).replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const items = blogs.map((blog) => {
  const url = new URL(base);
  url.hash = `blog/${encodeURIComponent(blog.id)}`;
  return `<item><title>${escape(blog.title)}</title><link>${escape(url.href)}</link><guid isPermaLink="true">${escape(url.href)}</guid><pubDate>${new Date(`${blog.createTime}T00:00:00+08:00`).toUTCString()}</pubDate><description>${escape(blog.description)}</description><category>${escape(blog.category)}</category></item>`;
});
await writeFile(
  new URL("public/feed.xml", root),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Mineblogcraft</title><link>${escape(base.href)}</link><description>Minecraft 风格个人技术博客</description><language>zh-CN</language>${items.join("\n")}</channel></rss>\n`,
);
console.log(
  `Generated ${items.length} RSS items: ${fileURLToPath(new URL("public/feed.xml", root))}`,
);

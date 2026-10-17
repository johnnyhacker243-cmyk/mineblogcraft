import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const read = async (p) => JSON.parse(await readFile(p, "utf8"));
const [blogs, papers, wiki, items] = await Promise.all(
  [
    "src/data/blogs.json",
    "src/data/papers.json",
    "src/data/wiki.json",
    "public/data/rss/items.json",
  ].map(read),
);
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
function date(value, label) {
  assert.ok(
    typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(value) &&
      Number.isFinite(Date.parse(value)),
    label,
  );
  assert.ok(value.slice(0, 10) <= today, `Future date: ${label}`);
  return value.slice(0, 10);
}
function link(value, label) {
  const u = new URL(value, "https://mineblogcraft.invalid");
  assert.ok(
    ["https:", "http:"].includes(u.protocol) && !u.username && !u.password,
    `Unsafe link: ${label}`,
  );
}
for (const b of blogs) {
  date(b.createTime, b.id);
  assert.equal(b.status, "published", b.id);
  assert.equal(b.reviewStatus, "reviewed", b.id);
  if (b.publishedAt) assert.ok(date(b.publishedAt, b.id) >= b.createTime, b.id);
  if (b.updatedAt) assert.ok(date(b.updatedAt, b.id) >= b.createTime, b.id);
  if (b.reviewedAt)
    assert.ok(date(b.reviewedAt, b.id) >= (b.updatedAt || b.createTime), b.id);
  for (const s of b.sources || []) {
    link(s.url, b.id);
    if (s.publishedAt)
      assert.ok(
        date(s.publishedAt, b.id) <= (b.updatedAt || b.createTime),
        b.id,
      );
  }
}
for (const p of papers) {
  date(p.publishedAt, p.id);
  link(p.sourceUrl, p.id);
  if (p.licenseUrl) link(p.licenseUrl, p.id);
}
for (const n of wiki) {
  date(n.updated, n.id);
  for (const s of n.sources) link(s.url, n.id);
}
for (const i of items) if (i.url) link(i.url, i.id);
let tracked;
try {
  tracked = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  )
    .split("\0")
    .filter(Boolean);
} catch {
  // A source ZIP has no Git index. Check its actual files without entering
  // dependencies, build output or local media/research caches.
  const ignored = new Set([
    ".git",
    "node_modules",
    "dist",
    ".local-reference",
    "deliverables",
    "gptphotos",
    "test-results",
    "screenshots",
  ]);
  const walk = async (folder = ".") => {
    const paths = [];
    for (const item of await readdir(folder, { withFileTypes: true })) {
      const name = folder === "." ? item.name : `${folder}/${item.name}`;
      if (item.isDirectory() && !ignored.has(item.name))
        paths.push(...(await walk(name)));
      else if (item.isFile()) paths.push(name);
    }
    return paths;
  };
  tracked = await walk();
}
const hits = [];
for (const file of tracked) {
  assert.ok(
    !/(^|\/)\.env($|\.(?!example))|\.(pem|p12|pfx|key)$/.test(file),
    `Sensitive tracked file: ${file}`,
  );
  if (
    !/\.(tsx?|m?js|json|md|ya?ml|html|py|ps1)$/.test(file) ||
    file.startsWith("public/vendor/")
  )
    continue;
  let text;
  try {
    text = await readFile(file, "utf8");
  } catch {
    continue;
  }
  if (
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[A-Z0-9]{16}\b|\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bAKID[A-Za-z0-9]{28,}\b/.test(
      text,
    )
  )
    hits.push(file);
  if (
    file.startsWith("src/") &&
    /dangerouslySetInnerHTML|\b(?:eval|Function)\s*\(/.test(text)
  )
    hits.push(file);
}
assert.deepEqual(
  hits,
  [],
  "Potential exposed secret or executable rendering; filenames only",
);
console.log(
  JSON.stringify({
    time: new Date().toISOString(),
    task: "release-audit",
    blogs: blogs.length,
    papers: papers.length,
    wiki: wiki.length,
    rss: items.length,
    trackedFiles: tracked.length,
    result: "passed",
    scope:
      "chronology, safe links, tracked credential patterns, executable rendering",
  }),
);

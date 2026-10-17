import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const read = async (p) => JSON.parse(await readFile(p, "utf8"));
const checks = [];
for (const [name, file] of [
  ["Content references", "validate-content.mjs"],
  ["Chronology and release checks", "release-audit.mjs"],
  ["RSS XML and feed schema", "validate-rss.mjs"],
]) {
  execFileSync(process.execPath, ["scripts/" + file], { stdio: "pipe" });
  checks.push({ name, result: "passed" });
}
const [blogs, papers, wiki, feeds, entries] = await Promise.all(
  [
    "src/data/blogs.json",
    "src/data/papers.json",
    "src/data/wiki.json",
    "public/data/rss/sources.json",
    "public/data/rss/items.json",
  ].map(read),
);
const config = await readFile("src/config/ui-config.ts", "utf8");
const commit =
  process.env.GITHUB_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const builtAt = new Date().toISOString();
const sections = [
  "Home",
  "Profile",
  "MineBlog",
  "MineRSS",
  "MineResearch",
  "MineWiki",
  "MineStatus",
  "MineWorld",
];
const data = {
  mode: "build-report",
  builtAt,
  commit,
  runId: process.env.GITHUB_RUN_ID || `local-${builtAt}`,
  version: config.match(/version: "([^"]+)"/)[1],
  sections,
  counts: {
    pages: sections.length,
    blogs: blogs.filter((b) => b.status === "published").length,
    papers: papers.length,
    wiki: wiki.length,
    feeds: feeds.length,
    entries: entries.length,
  },
  modules: [
    {
      name: "MineBlog",
      count: blogs.filter((b) => b.status === "published").length,
    },
    { name: "MineRSS", count: entries.length },
    { name: "MineWiki", count: wiki.length },
    { name: "MineResearch", count: papers.length },
  ],
  checks,
};
const folder = resolve(process.argv[2] || "public", "data");
await mkdir(folder, { recursive: true });
await writeFile(
  folder + "/site-status.json.tmp",
  JSON.stringify(data, null, 2) + "\n",
);
await rename(folder + "/site-status.json.tmp", folder + "/site-status.json");
console.log(
  JSON.stringify({
    time: builtAt,
    task: "build-report",
    input: data.counts,
    action: "validate and publish counts",
    result: "passed",
    error: null,
    run_id: data.runId,
  }),
);

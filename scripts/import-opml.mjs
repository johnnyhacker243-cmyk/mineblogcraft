import { readFile, writeFile } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { safeLink } from "./rss-core.mjs";
const path = process.argv[2];
if (!path)
  throw Error("Usage: npm run rss:import -- path/to/subscriptions.opml");
const xml = await readFile(path, "utf8");
if (
  xml.length > 1_000_000 ||
  /<!DOCTYPE|<!ENTITY/i.test(xml) ||
  XMLValidator.validate(xml) !== true
)
  throw Error("Invalid or unsafe OPML");
const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
if (!parsed.opml?.body) throw Error("Not OPML");
const existing = JSON.parse(
  await readFile(new URL("../config/rssSources.json", import.meta.url), "utf8"),
);
const urls = new Set(existing.map((s) => s.feedUrl)),
  proposed = [];
function walk(nodes) {
  for (const n of [nodes ?? []].flat()) {
    const url = n["@_xmlUrl"];
    if (url && safeLink(url) && url.startsWith("https://") && !urls.has(url)) {
      urls.add(url);
      proposed.push({
        name: n["@_title"] || n["@_text"] || new URL(url).hostname,
        feedUrl: url,
        siteUrl: safeLink(n["@_htmlUrl"]) || new URL(url).origin,
        verificationStatus: "unverified",
        enabled: false,
      });
    }
    if (n.outline) walk(n.outline);
  }
}
walk(parsed.opml.body.outline);
// Import creates a reviewable proposal, never silently expands the network
// allowlist or publishes someone else's private subscription list.
await writeFile(
  new URL("../config/rss-import-proposal.json", import.meta.url),
  JSON.stringify(proposed, null, 2) + "\n",
);
console.log(
  `${proposed.length} non-duplicate HTTPS feeds → config/rss-import-proposal.json. Assign domain/id/icon and add verified public hostnames before enabling.`,
);

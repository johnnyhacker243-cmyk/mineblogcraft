import { XMLParser, XMLValidator } from "fast-xml-parser";
import { createHash } from "node:crypto";

export const xmlEscape = (s) =>
  String(s).replace(
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
const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  parseTagValue: false,
  trimValues: true,
});
const array = (value) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];
const value = (x) => (typeof x === "string" ? x : (x?.["#text"] ?? ""));
export function safeLink(link, base) {
  if (typeof link !== "string" || !link.trim() || link.length > 8192) return "";
  try {
    const u = new URL(link, base);
    return ["https:", "http:"].includes(u.protocol) &&
      !u.username &&
      !u.password
      ? u.href
      : "";
  } catch {
    return "";
  }
}
export function plainText(input, limit = 600) {
  return value(input)
    .replace(/<(script|style|iframe|object)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => {
      const code =
        n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    })
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}
export function parseFeed(xml, source, fetchedAt = new Date().toISOString()) {
  // Text inside CDATA can contain code examples such as <!DOCTYPE html>.
  // Only actual XML declarations outside those inert text sections are rejected.
  if (/<!DOCTYPE|<!ENTITY/i.test(xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "")))
    throw Error("XML_DTD: declarations are not allowed");
  const valid = XMLValidator.validate(xml);
  if (valid !== true) throw Error("XML_INVALID: " + valid.err.msg);
  const parsed = parser.parse(xml);
  const channel = parsed.rss?.channel ?? parsed.feed;
  if (!channel || (!parsed.feed && String(parsed.rss["@_version"]) !== "2.0"))
    throw Error("FORMAT: expected RSS 2.0 or Atom");
  const atom = !!parsed.feed;
  const items = array(atom ? channel.entry : channel.item)
    .slice(0, 100)
    .flatMap((entry) => {
      const link = atom
        ? array(entry.link).find(
            (l) => !l["@_rel"] || l["@_rel"] === "alternate",
          )?.["@_href"]
        : value(entry.link) ||
          (String(entry.guid?.["@_isPermaLink"] ?? "true").toLowerCase() !==
            "false" && /^https?:\/\//i.test(value(entry.guid))
            ? value(entry.guid)
            : "");
      const url = safeLink(link, source.siteUrl);
      const title = plainText(entry.title, 240);
      if (!title || !url) return [];
      const rawDate = value(
        entry.published || entry.pubDate || entry.updated || entry.date,
      );
      const parsedDate = Date.parse(rawDate);
      const publishedAt = Number.isFinite(parsedDate)
        ? new Date(parsedDate).toISOString()
        : null;
      const rawId = value(entry.id || entry.guid) || url;
      return [
        {
          id: createHash("sha256")
            .update(source.id + "\0" + rawId)
            .digest("hex")
            .slice(0, 24),
          sourceId: source.id,
          title,
          link: url,
          description: plainText(
            entry.description ||
              entry.summary ||
              entry.content ||
              entry.encoded,
          ),
          author: plainText(
            atom
              ? array(entry.author)
                  .map((a) => value(a.name))
                  .join(", ")
              : entry.creator || entry.author,
            200,
          ),
          publishedAt,
          fetchedAt,
          domainId: source.domainId,
        },
      ];
    });
  const seen = new Set(),
    ids = new Set();
  return {
    title: plainText(channel.title, 240),
    format: atom ? "Atom" : "RSS 2.0",
    items: items.filter((i) => {
      const key = i.link;
      if (seen.has(key) || ids.has(i.id)) return false;
      seen.add(key);
      ids.add(i.id);
      return true;
    }),
  };
}
export function validateSources(sources) {
  const ids = new Set(),
    urls = new Set();
  for (const s of sources) {
    for (const field of [
      "id",
      "name",
      "domainId",
      "description",
      "feedUrl",
      "siteUrl",
      "language",
      "iconKey",
    ])
      if (!s[field]) throw Error(`Missing ${field}: ${s.id}`);
    if (ids.has(s.id) || urls.has(s.feedUrl))
      throw Error("Duplicate source: " + s.id);
    if (
      !safeLink(s.feedUrl) ||
      !s.feedUrl.startsWith("https://") ||
      !safeLink(s.siteUrl)
    )
      throw Error("Invalid source URL: " + s.id);
    if (
      !["ai", "security", "software"].includes(s.domainId) ||
      !Array.isArray(s.tags) ||
      !Array.isArray(s.crossDomainIds) ||
      typeof s.enabled !== "boolean"
    )
      throw Error("Invalid source schema: " + s.id);
    ids.add(s.id);
    urls.add(s.feedUrl);
  }
}
export function preserveFailedSnapshot(
  source,
  previousSource,
  previousItems,
  error,
  checkedAt,
) {
  return {
    state: {
      ...source,
      status: previousItems.length ? "stale" : "unverified",
      verificationStatus: previousSource?.verificationStatus ?? "unverified",
      lastCheckedAt: checkedAt,
      lastSuccessAt: previousSource?.lastSuccessAt ?? null,
      error,
    },
    items: previousItems,
  };
}

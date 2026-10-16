import { plainText } from "./rss-core.mjs";

// Read metadata as inert strings. Never execute page markup or infer a date from a URL.
export function articlePublishedAt(html) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = Object.fromEntries(
      [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((m) => [
        m[1].toLowerCase(),
        m[2],
      ]),
    );
    if (
      !["article:published_time", "datepublished", "pubdate"].includes(
        (attrs.property ?? attrs.name ?? "").toLowerCase(),
      )
    )
      continue;
    const raw = attrs.content ?? "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw) && Number.isFinite(Date.parse(raw)))
      return raw;
    if (
      /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw) &&
      Number.isFinite(Date.parse(raw))
    )
      return new Date(raw).toISOString();
  }
  return null;
}

export function articleTitle(html) {
  const title = plainText(
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1] ?? "",
    240,
  );
  if (
    !title ||
    /^(just a moment|access denied|403 forbidden|404 not found|页面不存在|访问验证|安全验证)/i.test(
      title,
    )
  )
    throw Error("ARTICLE_UNREADABLE");
  return title;
}

export function publicationSummary(items, checkedAt) {
  const now = Date.parse(checkedAt);
  const known = items.map((i) => i.publishedAt).filter(Boolean);
  const valid = known
    .filter((date) => Date.parse(date) <= now + 5 * 60_000)
    .sort();
  return {
    latestPublishedAt: valid.at(-1) ?? null,
    freshness: valid.length
      ? now - Date.parse(valid.at(-1)) <= 90 * 86400_000
        ? "recent"
        : "older"
      : "unknown",
    missingDates: items.filter((i) => !i.publishedAt).length,
    futureDates: known.length - valid.length,
  };
}

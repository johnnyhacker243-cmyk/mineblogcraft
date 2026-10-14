import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseFeed,
  plainText,
  safeLink,
  validateSources,
  preserveFailedSnapshot,
} from "../scripts/rss-core.mjs";
const source = { id: "test", domainId: "ai", siteUrl: "https://example.org" };
test("Missing entry URLs are not turned into fabricated relative links", () => {
  assert.equal(safeLink(undefined, source.siteUrl), "");
  assert.equal(safeLink("", source.siteUrl), "");
  assert.equal(
    parseFeed(
      '<rss version="2.0"><channel><item><title>No link</title></item></channel></rss>',
      source,
    ).items.length,
    0,
  );
});
test("A failed refresh retains last successful content and its date", () => {
  const old = [
    { id: "old", sourceId: "test", title: "Saved entry", publishedAt: null },
  ];
  const result = preserveFailedSnapshot(
    source,
    { verificationStatus: "verified", lastSuccessAt: "2025-01-01T00:00:00Z" },
    old,
    "TIMEOUT",
    "2026-10-14T00:00:00Z",
  );
  assert.deepEqual(result.items, old);
  assert.equal(result.state.status, "stale");
  assert.equal(result.state.lastSuccessAt, "2025-01-01T00:00:00Z");
  assert.equal(result.state.lastCheckedAt, "2026-10-14T00:00:00Z");
  assert.equal(result.state.error, "TIMEOUT");
  assert.equal(
    preserveFailedSnapshot(source, null, [], "XML_INVALID", "2026-10-14").state
      .status,
    "unverified",
  );
});
test("RSS text, escaped Chinese, stable IDs, dedup and missing dates", () => {
  const xml =
    '<rss version="2.0"><channel><title>测试</title><item><title>甲 &amp; 乙</title><link>https://example.org/a</link><guid>one</guid><description><![CDATA[<script>alert(1)</script><b>摘要</b>]]></description></item><item><title>duplicate</title><link>https://example.org/a</link></item></channel></rss>';
  const a = parseFeed(xml, source, "2026-10-14T00:00:00Z").items;
  assert.equal(a.length, 1);
  assert.equal(a[0].title, "甲 & 乙");
  assert.equal(a[0].description, "摘要");
  assert.equal(a[0].publishedAt, null);
  assert.equal(
    a[0].id,
    parseFeed(xml, source, "2026-10-15T00:00:00Z").items[0].id,
  );
});
test("Atom namespaced author/link/date normalization", () => {
  const xml =
    '<feed xmlns="http://www.w3.org/2005/Atom"><title>Atom</title><entry><id>urn:one</id><title>Entry</title><link rel="self" href="https://example.org/api"/><link rel="alternate" href="/article"/><author><name>Alice</name></author><updated>2025-01-01T01:00:00+08:00</updated><summary>Hi</summary></entry></feed>';
  const { format, items } = parseFeed(xml, source);
  assert.equal(format, "Atom");
  assert.equal(items[0].author, "Alice");
  assert.equal(items[0].link, "https://example.org/article");
  assert.equal(items[0].publishedAt, "2024-12-31T17:00:00.000Z");
});
test("Reject malformed XML, non-feed, DTD, JavaScript and credentials", () => {
  assert.throws(() => parseFeed("<rss><channel>", source), /XML_INVALID/);
  assert.throws(() => parseFeed("<html>Hi</html>", source), /FORMAT/);
  assert.throws(
    () => parseFeed('<!DOCTYPE rss><rss version="2.0"/>', source),
    /XML_DTD/,
  );
  assert.equal(safeLink("javascript:alert(1)"), "");
  assert.equal(safeLink("https://user:password@example.org/"), "");
  assert.equal(plainText("<iframe>x</iframe><p>safe</p>"), "safe");
});
test("RSS duplicate IDs and duplicate feed addresses rejected", () => {
  const s = {
    id: "a",
    name: "A",
    domainId: "ai",
    description: "x",
    feedUrl: "https://example.org/feed",
    siteUrl: "https://example.org",
    language: "en",
    iconKey: "book",
    tags: [],
    crossDomainIds: [],
    enabled: true,
  };
  assert.throws(() => validateSources([s, s]), /Duplicate/);
  assert.throws(
    () => validateSources([{ ...s, feedUrl: "http://example.org/feed" }]),
    /Invalid/,
  );
});
test("Inert code samples in CDATA do not count as active XML declarations", () => {
  const xml =
    '<rss version="2.0"><channel><item><title>XML examples</title><link>https://example.org/xml</link><description><![CDATA[<!DOCTYPE html><p>Example</p>]]></description></item></channel></rss>';
  assert.equal(parseFeed(xml, source).items[0].description, "Example");
});

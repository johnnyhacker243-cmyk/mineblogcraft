import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  articlePublishedAt,
  articleTitle,
  publicationSummary,
} from "../scripts/rss-quality.mjs";
import { privateIP } from "../scripts/rss-network.mjs";
const read = async (p) =>
  JSON.parse(await readFile(new URL("../" + p, import.meta.url), "utf8"));

test("Each subscription uses its own original item texture and a real feed host", async () => {
  const [sources, icons, hosts] = await Promise.all(
    [
      "config/rssSources.json",
      "config/rssIcons.json",
      "config/rssAllowlist.json",
    ].map(read),
  );
  assert.equal(sources.length, 21);
  assert.equal(new Set(sources.map((s) => s.iconKey)).size, 21);
  for (const domain of ["ai", "security", "software"])
    assert.equal(sources.filter((s) => s.domainId === domain).length, 7);
  for (const source of sources) {
    assert.ok(hosts.includes(new URL(source.feedUrl).hostname));
    assert.ok(hosts.includes(new URL(source.siteUrl).hostname));
    assert.equal(source.accessibility.regionalStatus, "not-region-tested");
    assert.equal(icons[source.iconKey].label, source.iconLabel);
    assert.equal(icons[source.iconKey].reason, source.iconReason);
    assert.equal(
      icons[source.iconKey].source,
      `assets/minecraft/textures/item/${source.iconKey}.png`,
    );
  }
});

test("Snapshot and access evidence refer only to current sources, without pretending to be regional monitoring", async () => {
  const [config, snapshots, report, items] = await Promise.all(
    [
      "config/rssSources.json",
      "public/data/rss/sources.json",
      "public/data/rss/access-report.json",
      "public/data/rss/items.json",
    ].map(read),
  );
  assert.deepEqual(
    snapshots.map((s) => s.id),
    config.map((s) => s.id),
  );
  assert.equal(report.regionalStatus, "not-region-tested");
  assert.equal(report.scope, "current-network-sample");
  assert.deepEqual(
    report.sources.map((s) => s.id),
    config.map((s) => s.id),
  );
  for (const source of snapshots) {
    const declared = config.find((s) => s.id === source.id);
    assert.equal(source.feedUrl, declared.feedUrl);
    assert.equal(source.iconKey, declared.iconKey);
    assert.equal(
      source.latestPublishedAt,
      publicationSummary(
        items.filter((i) => i.sourceId === source.id),
        source.articleAccess.checkedAt,
      ).latestPublishedAt,
    );
    assert.equal(
      source.articleAccess.passed,
      report.sources
        .find((s) => s.id === source.id)
        .samples.filter((c) => c.status === "reachable").length,
    );
  }
  for (const item of items)
    assert.ok(config.some((s) => s.id === item.sourceId));
});

test("Article metadata is inert and never substitutes crawl time for a missing publication date", () => {
  assert.equal(
    articlePublishedAt(
      '<meta content="2026-10-01T09:00:00+08:00" property="article:published_time">',
    ),
    "2026-10-01T01:00:00.000Z",
  );
  assert.equal(
    articlePublishedAt(
      '<meta property="article:published_time" content="2026-10-01">',
    ),
    "2026-10-01",
  );
  assert.equal(
    articlePublishedAt(
      '<meta property="article:modified_time" content="2026-10-01">',
    ),
    null,
  );
  assert.equal(
    articlePublishedAt('<script>window.date="2026-10-01"</script>'),
    null,
  );
  assert.equal(
    articlePublishedAt(
      '<meta property="article:published_time" content="2026-10-01T09:00:00">',
    ),
    null,
  );
  assert.equal(
    articleTitle(
      "<title>研究 &amp; 实践</title><script>throw Error()</script>",
    ),
    "研究 & 实践",
  );
  assert.throws(
    () => articleTitle("<title>Just a moment...</title>"),
    /UNREADABLE/,
  );
  const result = publicationSummary(
    [
      { publishedAt: null },
      { publishedAt: "2026-10-01T00:00:00Z" },
      { publishedAt: "2027-01-01T00:00:00Z" },
    ],
    "2026-10-16T00:00:00Z",
  );
  assert.equal(result.latestPublishedAt, "2026-10-01T00:00:00Z");
  assert.equal(result.futureDates, 1);
  assert.equal(result.missingDates, 1);
  assert.equal(
    publicationSummary([{ publishedAt: null }], "2026-10-16").latestPublishedAt,
    null,
  );
});

test("Shared public fetcher retains local-network rejection", () => {
  for (const ip of [
    "127.0.0.1",
    "10.0.0.1",
    "192.168.1.2",
    "169.254.169.254",
    "100.64.0.1",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])
    assert.equal(privateIP(ip), true, ip);
  for (const ip of ["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111"])
    assert.equal(privateIP(ip), false, ip);
});

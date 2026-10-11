import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
await mkdir("tests/screenshots", { recursive: true });
const names = [
  "AI Research Server",
  "OpenAI Laboratory",
  "Cyber Security Server",
  "Security Research World",
  "Open Source World",
  "Software Engineering Hub",
];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(
  hash(await readFile("public/assets/rss/background.png")),
  hash(await readFile("gptphotos/暮色湖畔的村庄与紫色传送门.png")),
  "Background copy preserves original bytes",
);
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [],
  failed = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
p.on("response", (r) => {
  if (r.status() >= 400) failed.push(r.url());
});
await p.goto("http://127.0.0.1:5173/");
await p.getByRole("button", { name: "MineRSS", exact: true }).click();
await p.getByRole("option", { name: names[5] }).waitFor();
assert.deepEqual(
  await p
    .getByRole("option")
    .evaluateAll((ns) => ns.map((n) => n.getAttribute("aria-label"))),
  names,
);
assert.equal(await p.locator(".rss-screen button").count(), 2);
assert.equal(await p.locator(".rss-ping").count(), 6);
assert.equal(
  await p.locator(".rss-server-status canvas[aria-label='ONLINE']").count(),
  6,
);
await p.waitForFunction(() =>
  [...document.querySelectorAll(".rss-screen canvas")].every((c) =>
    c
      .getContext("2d")
      .getImageData(0, 0, c.width, c.height)
      .data.some((v, i) => i % 4 === 3 && v > 0),
  ),
);
const texts = await p
  .locator(".rss-screen canvas")
  .evaluateAll((ns) => ns.map((n) => n.getAttribute("aria-label")).join(""));
const glyphs = await p.evaluate(async () =>
  (await fetch("/assets/inventory/font.json")).json(),
);
for (const c of texts)
  if (c !== " ") assert.ok(glyphs[c], `Missing glyph ${c}`);
const dimensions = [];
for (const [width, height] of [
  [1366, 768],
  [1920, 1080],
  [2560, 1440],
]) {
  await p.setViewportSize({ width, height });
  await p.waitForTimeout(150);
  const list = await p.locator(".rss-server-list").boundingBox();
  const footer = await p.locator(".rss-screen footer").boundingBox();
  const container = await p.locator(".rss-list-band").boundingBox();
  const logo = await p.locator(".rss-brand").boundingBox();
  const title = await p.locator(".rss-screen h1").boundingBox();
  const firstRow = await p.getByRole("option").first().boundingBox();
  const scale = Number(
    await p.locator(".rss-screen").getAttribute("data-rss-scale"),
  );
  assert.ok(container.width / width >= 0.7 && container.width / width <= 0.8);
  assert.ok(logo.x + logo.width < title.x, "Logo never overlaps central title");
  assert.ok(logo.y + logo.height <= container.y, "Logo stays above list frame");
  assert.equal(firstRow.height, 62 * scale);
  assert.equal(title.height, 18 * scale);
  assert.ok(container.y + container.height <= footer.y);
  assert.ok(Math.abs(list.x + list.width / 2 - width / 2) < 0.1);
  assert.ok(footer.y + footer.height <= height + 0.1);
  for (const row of await p.getByRole("option").all()) {
    const body = await row.locator(".rss-server-copy").boundingBox();
    const status = await row.locator(".rss-server-status").boundingBox();
    assert.ok(
      body.x + body.width <= status.x,
      "Description and right status do not overlap",
    );
  }
  assert.ok(
    await p
      .locator(".rss-server-icon img")
      .evaluateAll((ns) => ns.every((n) => n.complete && n.naturalWidth > 0)),
  );
  assert.equal(
    await p
      .locator(".rss-ping")
      .evaluateAll(
        (ns) => ns.filter((n) => n.complete && n.naturalWidth > 0).length,
      ),
    6,
  );
  await p.getByRole("option", { name: names[0] }).click();
  assert.equal(
    await p
      .getByRole("option", { name: names[0] })
      .getAttribute("aria-selected"),
    "true",
  );
  await p.screenshot({ path: `tests/screenshots/rss-${width}x${height}.png` });
  await p
    .locator(".rss-list-band")
    .evaluate((n) => (n.scrollTop = n.scrollHeight));
  const lastRow = await p.getByRole("option").last().boundingBox();
  assert.ok(
    lastRow.y + lastRow.height <= container.y + container.height,
    "Last server can be fully viewed by scrolling",
  );
  await p.screenshot({
    path: `tests/screenshots/rss-scrolled-${width}x${height}.png`,
  });
  await p.locator(".rss-list-band").evaluate((n) => (n.scrollTop = 0));
  dimensions.push({
    width,
    height,
    scale: await p.locator(".rss-screen").getAttribute("data-rss-scale"),
    list,
    container,
    logo,
    title,
    rowHeight: firstRow.height,
    footer,
  });
}
await p.getByRole("option", { name: names[1] }).focus();
await p.keyboard.press("Space");
assert.equal(
  await p.getByRole("option", { name: names[1] }).getAttribute("aria-selected"),
  "true",
);
await p.getByRole("button", { name: "连接信息源", exact: true }).focus();
await p.keyboard.press("Enter");
await p.locator(".rss-notice").waitFor();
assert.equal(
  await p.locator(".rss-notice canvas").getAttribute("aria-label"),
  "RSS管理功能将在未来版本开放",
);
await p.setViewportSize({ width: 1920, height: 1080 });
await p.screenshot({ path: "tests/screenshots/rss-management-notice.png" });
await p.keyboard.press("Escape");
assert.equal(await p.locator(".rss-notice").count(), 0);
assert.equal(
  await p.locator(".game").getAttribute("data-screen"),
  "multiplayer",
);
await p.getByRole("button", { name: "返回主菜单", exact: true }).focus();
await p.keyboard.press("Space");
assert.equal(await p.locator(".game").getAttribute("data-screen"), "main");
await p.getByRole("button", { name: "MineRSS", exact: true }).click();
await p.getByRole("option", { name: names[0] }).waitFor();
await p.keyboard.press("Escape");
assert.equal(await p.locator(".game").getAttribute("data-screen"), "main");
assert.deepEqual(errors, []);
assert.deepEqual(failed, []);
const result = {
  date: new Date().toISOString(),
  dimensions,
  sources: names,
  backgroundUnchanged: true,
  staticStatus: true,
  keyboard: true,
  managementNotice: true,
  errors,
  failed,
};
await writeFile("tests/rss-results.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await b.close();

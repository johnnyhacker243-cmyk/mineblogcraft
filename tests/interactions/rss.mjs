import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
await mkdir("tests/screenshots", { recursive: true });
const sources = JSON.parse(await readFile("config/rssSources.json", "utf8"));
const names = sources.map((s) => s.name);
const options = () => p.locator(".rss-server-list").getByRole("option");
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
assert.equal(
  await p
    .locator(".rss-screen")
    .evaluate((n) => getComputedStyle(n).backgroundImage),
  "none",
);
assert.equal(
  await p
    .locator(".rss-screen")
    .evaluate((n) => getComputedStyle(n).backgroundColor),
  "rgba(0, 0, 0, 0)",
);
await p.locator(".panorama[data-status='ready']").waitFor();
const yawStart = Number(await p.locator(".panorama").getAttribute("data-yaw"));
await p.waitForTimeout(1200);
const rotationDelta =
  Number(await p.locator(".panorama").getAttribute("data-yaw")) - yawStart;
assert.ok(
  rotationDelta > 0.005,
  "Default panorama continues rotating on MineRSS",
);

assert.deepEqual(
  await p
    .locator(".rss-server-list")
    .getByRole("option")
    .evaluateAll((ns) => ns.map((n) => n.getAttribute("aria-label"))),
  names,
);
assert.equal(await p.locator(".rss-actions button").count(), 2);
assert.equal(await p.locator(".rss-ping").count(), names.length);
assert.equal(await p.locator(".rss-server-status").count(), names.length);
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
assert.ok(texts.includes("构建快照"));
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
  const firstRow = await options().first().boundingBox();
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
  for (const row of await options().all()) {
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
    names.length,
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
  const lastRow = await options().last().boundingBox();
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
await p.locator(".rss-article-list").waitFor();
assert.ok((await p.locator(".rss-article").count()) > 0);
assert.equal(
  await p.locator(".rss-article a").first().getAttribute("target"),
  "_blank",
);
await p.setViewportSize({ width: 1920, height: 1080 });
await p.screenshot({ path: "tests/screenshots/rss-articles.png" });
await p.keyboard.press("Escape");
assert.equal(await p.locator(".rss-article-list").count(), 0);
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
  background: "shared rotating panorama",
  rotationDelta,
  staticStatus: true,
  keyboard: true,
  articleReader: true,
  errors,
  failed,
};
await writeFile("tests/rss-results.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await b.close();

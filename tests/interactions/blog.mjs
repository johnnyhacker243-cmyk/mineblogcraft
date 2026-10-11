import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [],
  failed = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) failed.push(r.url());
});
await page.goto("http://127.0.0.1:5173/");
await page.getByRole("button", { name: "MineBlog", exact: true }).click();
const option = page.getByRole("option", { name: "Mineblogcraft 的诞生" });
await option.waitFor();
const enter = page.getByRole("button", { name: "进入选中的 Blog" });
assert.ok(await enter.isDisabled());
const search = page.getByRole("textbox", { name: "搜索世界" });
for (const term of [
  "诞生",
  "开发过程",
  "AI",
  "development",
  "WEB",
  " Software Engineering ",
]) {
  await search.fill(term);
  await option.waitFor();
  assert.equal(await page.getByRole("option").count(), 1);
}
await option.click();
assert.ok(await enter.isEnabled());
await search.fill("不存在的世界");
await page.getByRole("status").waitFor();
assert.equal(await page.getByRole("option").count(), 0);
assert.ok(await enter.isDisabled());
await search.fill("");
await option.waitFor();
const dimensions = [];
for (const [width, height] of [
  [1366, 768],
  [1920, 1080],
  [2560, 1440],
]) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(150);
  const list = await page.locator(".world-list").boundingBox();
  const searchBox = await page.locator(".world-search").boundingBox();
  const footer = await page.locator(".world-select footer").boundingBox();
  assert.ok(Math.abs(list.x + list.width / 2 - width / 2) < 1);
  assert.ok(list.y > searchBox.y + searchBox.height);
  assert.ok(footer.y + footer.height <= height);
  assert.ok(searchBox.x >= 0);
  const scale = Number(
    await page.locator(".blog-screen").getAttribute("data-blog-scale"),
  );
  assert.equal(searchBox.width, 200 * scale);
  await page.screenshot({
    path: `tests/screenshots/blog-worlds-${width}x${height}.png`,
  });
  await option.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("article").waitFor();
  const article = await page.getByRole("article").boundingBox();
  const back = await page
    .getByRole("button", { name: "返回世界列表" })
    .boundingBox();
  assert.ok(article.y + article.height <= back.y);
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".blog-reader canvas")].every((c) =>
      c
        .getContext("2d")
        .getImageData(0, 0, c.width, c.height)
        .data.some((v, i) => i % 4 === 3 && v > 0),
    ),
  );
  const glyphs = await page.evaluate(async () =>
    (await fetch("/assets/inventory/font.json")).json(),
  );
  const texts = await page
    .locator(".blog-reader canvas")
    .evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute("aria-label")).join(""),
    );
  for (const c of texts)
    if (c !== " ") assert.ok(glyphs[c], `Missing glyph ${c}`);
  await page.screenshot({
    path: `tests/screenshots/blog-reader-${width}x${height}.png`,
  });
  await page
    .getByRole("article")
    .evaluate((n) => (n.scrollTop = n.scrollHeight));
  assert.ok(await page.getByRole("article").evaluate((n) => n.scrollTop > 0));
  await page.keyboard.press("Escape");
  await option.waitFor();
  dimensions.push({ width, height, scale, list, article });
}
await option.dblclick();
await page.getByRole("article").waitFor();
await page.getByRole("button", { name: "返回世界列表" }).click();
await option.waitFor();
const feed = await page.request.get("http://127.0.0.1:5173/feed.xml");
assert.ok(feed.ok());
const xml = await feed.text();
const rss = await page.evaluate((text) => {
  const doc = new DOMParser().parseFromString(text, "text/xml");
  return {
    error: doc.querySelector("parsererror")?.textContent,
    items: [...doc.querySelectorAll("item")].map((i) => ({
      title: i.querySelector("title").textContent,
      link: i.querySelector("link").textContent,
      date: i.querySelector("pubDate").textContent,
    })),
  };
}, xml);
assert.ok(!rss.error);
assert.equal(rss.items.length, 1);
assert.equal(rss.items[0].title, "Mineblogcraft 的诞生");
assert.ok(!Number.isNaN(Date.parse(rss.items[0].date)));
await page.goto(rss.items[0].link);
await page.getByRole("article").waitFor();
await page.getByRole("button", { name: "返回世界列表" }).click();
await option.waitFor();
await page.getByRole("button", { name: "返回主菜单" }).focus();
await page.keyboard.press("Space");
assert.equal(await page.locator(".game").getAttribute("data-screen"), "main");
assert.deepEqual(errors, []);
assert.deepEqual(failed, []);
const result = {
  date: new Date().toISOString(),
  dimensions,
  searchFields: ["title", "description", "tags", "category"],
  emptySelectionDisabled: true,
  keyboard: true,
  doubleClick: true,
  readerScrollable: true,
  rss,
  errors,
  failed,
};
await writeFile("tests/blog-results.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();

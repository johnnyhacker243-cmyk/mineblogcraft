import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const blogs = JSON.parse(await readFile("src/data/blogs.json", "utf8"));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [],
    failed = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("response", (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  // Enter normally through CloudBase's test-domain notice if it is shown.
  await page.goto(base + "/");
  if (await page.getByText("页面访问提示", { exact: true }).count())
    await page.getByText("确定访问", { exact: true }).click();
  await page.getByRole("button", { name: "MineBlog", exact: true }).click();
  assert.equal(await page.getByRole("option").count(), blogs.length);
  await page.getByRole("option", { name: "Mineblogcraft 的诞生" }).click();
  await page.getByRole("button", { name: "进入选中的 Blog" }).click();
  await page.getByRole("article").waitFor();
  await page
    .getByRole("img", { name: "已审阅 · 发布 2026-10-11", exact: true })
    .waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "订阅博客", exact: true }).click();
  const [feedPage] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "打开 RSS" }).click(),
  ]);
  await feedPage.waitForLoadState("networkidle");
  assert.equal(new URL(feedPage.url()).pathname, "/feed.xml");
  const response = await page.request.get(base + "/feed.xml");
  assert.equal(response.status(), 200);
  const xml = await response.text();
  assert.equal(XMLValidator.validate(xml), true);
  assert.match(xml, /<\?xml-stylesheet type="text\/css" href="\/feed.css"\?>/);
  const items = new XMLParser().parse(xml).rss.channel.item;
  assert.equal(items.length, 22);
  assert.equal(new Set(items.map((item) => item.guid)).size, 22);
  for (const blog of blogs) {
    assert.equal(blog.status, "published");
    assert.equal(blog.reviewStatus, "reviewed");
    const item = items.find((item) => item.title === blog.title);
    assert.ok(item, blog.id);
    assert.equal(
      Date.parse(item.pubDate),
      Date.parse(`${blog.publishedAt ?? blog.createTime}T00:00:00+08:00`),
    );
    assert.ok(!item.link.includes("127.0.0.1"));
  }
  await mkdir("tests/screenshots", { recursive: true });
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [375, 667],
  ]) {
    await feedPage.setViewportSize({ width, height });
    const layout = await feedPage.evaluate(() => {
      const root = document.documentElement;
      const channel = document.querySelector("channel");
      const box = channel.getBoundingClientRect();
      const self = document.getElementsByTagNameNS(
        "http://www.w3.org/2005/Atom",
        "link",
      )[0];
      return {
        background: getComputedStyle(root).backgroundImage,
        display: getComputedStyle(root).display,
        overflow: root.scrollWidth > innerWidth,
        x: box.x,
        right: box.right,
        items: document.querySelectorAll("item").length,
        subscription: getComputedStyle(self, "::before").content,
      };
    });
    assert.match(layout.background, /grass-border\.png/);
    assert.match(layout.background, /dirt\.png/);
    assert.equal(layout.display, "block");
    assert.equal(layout.items, 22);
    assert.match(layout.subscription, /订阅地址：.*feed\.xml/);
    assert.equal(layout.overflow, false);
    assert.ok(layout.x >= 0 && layout.right <= width);
    await feedPage.screenshot({
      path: `tests/screenshots/feed-${base.startsWith("https") ? "live" : "local"}-${width}x${height}.png`,
    });
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  console.log(
    "PASS: 22 reviewed/published blogs, RSS dates and unique entries, styled XML, three viewports, subscription popup link.",
  );
} finally {
  await browser.close();
}

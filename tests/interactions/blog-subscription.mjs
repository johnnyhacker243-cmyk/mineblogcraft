import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: "MineBlog", exact: true }).click();
  const search = page.getByRole("textbox", { name: "搜索世界" });
  await search.fill("诞生");
  await page.getByRole("option", { name: "Mineblogcraft 的诞生" }).click();
  const subscribe = page.getByRole("button", { name: "订阅博客", exact: true });
  const dialog = page.getByRole("dialog", { name: "订阅博客" });
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
    [375, 667],
  ]) {
    await page.setViewportSize({ width, height });
    await subscribe.click();
    await dialog.waitFor();
    const box = await dialog.boundingBox();
    assert.ok(
      box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.width <= width &&
        box.y + box.height <= height,
    );
    assert.ok(
      await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
    );
    const address = page.getByRole("textbox", { name: "RSS 订阅地址" });
    assert.equal(await address.inputValue(), "http://127.0.0.1:5173/feed.xml");
    await page.getByRole("button", { name: "复制订阅地址" }).click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      await address.inputValue(),
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `tests/screenshots/blog-subscription-${width}x${height}.png`,
    });
    // Tab remains inside the modal; Escape closes only the modal and restores focus.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      assert.ok(
        await dialog.evaluate((node) => node.contains(document.activeElement)),
      );
    }
    await page.keyboard.press("Escape");
    assert.equal(await dialog.count(), 0);
    assert.ok(
      await subscribe.evaluate((node) => node === document.activeElement),
    );
    assert.equal(await search.inputValue(), "诞生");
    assert.ok(
      await page.getByRole("button", { name: "进入选中的 Blog" }).isEnabled(),
    );
  }
  await subscribe.click();
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => {
        throw Error("Denied");
      },
    }),
  );
  await page.getByRole("button", { name: "复制订阅地址" }).click();
  await page.getByRole("status").filter({ hasText: "Ctrl+C" }).waitFor();
  assert.ok(
    await page
      .getByRole("textbox", { name: "RSS 订阅地址" })
      .evaluate(
        (node) => node.selectionEnd - node.selectionStart === node.value.length,
      ),
  );
  await page.getByRole("button", { name: "完成订阅说明" }).click();
  assert.equal(await dialog.count(), 0);
  const feed = await page.request.get("http://127.0.0.1:5173/feed.xml");
  assert.ok(feed.ok());
  assert.match(await feed.text(), /<rss version="2.0"/);
  await page.getByRole("button", { name: "进入选中的 Blog" }).click();
  await page.getByRole("article").waitFor();
  await page.keyboard.press("Escape");
  await subscribe.waitFor();
  await page.getByRole("button", { name: "返回主菜单" }).click();
  await page.getByRole("button", { name: "MineRSS", exact: true }).click();
  await page.getByRole("button", { name: "最新文章", exact: true }).waitFor();
  assert.equal(
    await page.locator('.rss-screen a[href="/feed.xml"]').count(),
    0,
  );
  assert.equal(await page.getByRole("link", { name: "导出 OPML" }).count(), 1);
  await page.getByRole("button", { name: "最新文章", exact: true }).click();
  await page.getByLabel("RSS 文章列表").waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: modal, four viewports, clipboard and fallback, keyboard/focus, Blog reader, RSS and feed.",
  );
} finally {
  await browser.close();
}

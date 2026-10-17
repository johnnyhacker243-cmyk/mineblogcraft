import { chromium } from "playwright";
import assert from "node:assert/strict";

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  let injected = false;
  // Browser-only fault injection. No production code or saved data is changed.
  await page.route("**/src/screens/MineWikiPage.tsx*", async (route) => {
    const response = await route.fetch();
    const source = await response.text();
    const marker = "export function MineWikiPage({ back }) {";
    assert.ok(
      source.includes(marker),
      "Fault injection targets the real page component",
    );
    injected = true;
    await route.fulfill({
      response,
      body: source.replace(
        marker,
        marker +
          '\nif (!window.__allowWiki) throw new Error("controlled-render-failure");',
      ),
    });
  });
  await page.goto("http://127.0.0.1:5173");
  await page.getByRole("button", { name: "MineWiki", exact: true }).click();
  await page.getByRole("alert", { name: "页面恢复" }).waitFor();
  assert.ok(injected);
  assert.equal(await page.locator("#root > .game").count(), 1);
  assert.equal(await page.locator(".site-navigation").count(), 1);
  assert.equal(await page.locator(".panorama").count(), 1);
  await page.evaluate(() => {
    window.__allowWiki = true;
  });
  await page.getByRole("button", { name: "重新打开页面", exact: true }).click();
  await page.locator(".wiki-node").first().waitFor();
  assert.equal(await page.locator(".page-recovery").count(), 0);
  await page.evaluate(() => {
    window.__allowWiki = false;
    window.dispatchEvent(new Event("resize"));
  });
  await page.getByRole("alert", { name: "页面恢复" }).waitFor();
  await page.getByRole("button", { name: "返回首页", exact: true }).click();
  await page.getByRole("button", { name: "MineBlog", exact: true }).click();
  await page.locator(".world-card").first().waitFor();
  console.log(
    "PASS: controlled page failure preserves shared UI; retry remounts Wiki; return-home and another module remain usable.",
  );
} finally {
  await browser.close();
}

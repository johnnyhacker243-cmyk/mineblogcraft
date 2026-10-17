import { chromium } from "playwright";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1366, height: 768 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  if (await page.getByText("页面访问提示", { exact: true }).count())
    await page.getByText("确定访问", { exact: true }).click();
  assert.equal(await page.title(), "Mineblogcraft — Personal Blog Edition");
  await page.getByRole("button", { name: "MineStatus", exact: true }).click();
  await page.locator(".status-panel").waitFor();
  const data = await page.evaluate(async () => {
    const response = await fetch("/data/site-status.json", {
      cache: "no-cache",
    });
    if (!response.ok) throw Error("Missing build report");
    return response.json();
  });
  assert.equal(data.mode, "build-report");
  assert.deepEqual(data.counts, {
    pages: 8,
    blogs: 22,
    papers: 33,
    wiki: 89,
    feeds: 21,
    entries: 314,
  });
  assert.equal(data.checks.length, 3);
  assert.ok(data.checks.every((c) => c.result === "passed"));
  if (process.env.EXPECTED_SHA)
    assert.equal(data.commit, process.env.EXPECTED_SHA);
  const nav = page.getByRole("navigation", { name: "网站导航" });
  await nav.getByLabel("打开网站导航").click();
  assert.equal(
    await nav
      .getByRole("button", { name: "MineStatus", exact: true })
      .getAttribute("aria-current"),
    "page",
  );
  await nav.getByRole("button", { name: "MineWiki", exact: true }).click();
  await page.getByRole("textbox", { name: "搜索知识" }).waitFor();
  assert.equal(
    await page.locator(".site-navigation details").getAttribute("open"),
    null,
  );
  await nav.getByLabel("打开网站导航").click();
  assert.equal(
    await nav
      .getByRole("button", { name: "MineWiki", exact: true })
      .getAttribute("aria-current"),
    "page",
  );
  await nav.getByRole("button", { name: "MineStatus", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 700 });
  await page.waitForFunction(() => {
    const r = document.querySelector(".status-window")?.getBoundingClientRect();
    return r && r.left >= 0 && r.right <= innerWidth;
  });
  await page.screenshot({ path: "tests/screenshots/final-status-mobile.png" });
  await nav.getByLabel("打开网站导航").click();
  await nav.getByRole("button", { name: "首页", exact: true }).click();
  await page.getByRole("button", { name: "MineBlog", exact: true }).waitFor();
  await page.goto(base + "/#blog/%E0%A4%A");
  await page.locator(".world-card").first().waitFor();
  assert.equal(
    await page
      .getByRole("img", { name: "世界加载失败，请返回后重试", exact: true })
      .count(),
    0,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: production title, real build metadata/counts/checks, cross-module navigation/current page, mobile status, malformed deep link",
  );
} finally {
  await browser.close();
}

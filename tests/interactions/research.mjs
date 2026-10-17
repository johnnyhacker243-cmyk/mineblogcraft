import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
const papers = JSON.parse(await readFile("src/data/papers.json", "utf8"));
const paper = papers.find((p) => p.format === "pdf");
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: "MineResearch", exact: true }).click();
  assert.equal(await page.locator(".paper-item").count(), 33);
  const before = await page.locator(".paper-shelf-frame").boundingBox();
  await page
    .getByRole("button", { name: `打开书籍：${paper.title}`, exact: true })
    .click();
  await page.locator('.paper-book-viewer[data-book-state="open"]').waitFor();
  const after = await page.locator(".paper-shelf-frame").boundingBox();
  assert.deepEqual(after, before);
  await page
    .getByRole("img", { name: "完整 PDF 原文第 1 页", exact: true })
    .waitFor();
  await page
    .getByRole("img", { name: "完整 PDF 原文第 2 页", exact: true })
    .waitFor();
  await page.locator('canvas[data-pdf-rendered="true"]').nth(1).waitFor();
  await page
    .getByRole("spinbutton", { name: "跳转页码" })
    .fill(String(paper.pdf.pageCount));
  await page.getByRole("button", { name: "Go", exact: true }).click();
  await page
    .getByRole("img", {
      name: `完整 PDF 原文第 ${paper.pdf.pageCount} 页`,
      exact: true,
    })
    .waitFor();
  assert.equal(
    await page.getByRole("button", { name: "下一页", exact: true }).count(),
    0,
  );
  await page
    .getByRole("button", {
      name: `放大原文第 ${paper.pdf.pageCount} 页`,
      exact: true,
    })
    .click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  const dimensions = [];
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForFunction(() => {
      const rect = document
        .querySelector(".book-spread")
        ?.getBoundingClientRect();
      return (
        rect &&
        rect.width <= innerWidth &&
        rect.height <= innerHeight &&
        Math.abs(rect.x + rect.width / 2 - innerWidth / 2) < 2
      );
    });
    const rect = await page.locator(".book-spread").boundingBox();
    assert.ok(rect.width <= width && rect.height <= height);
    assert.ok(Math.abs(rect.x + rect.width / 2 - width / 2) < 2);
    dimensions.push({ width, height, book: rect });
  }
  await page.screenshot({
    path: "tests/screenshots/research-current-papers.png",
  });
  await page.getByRole("button", { name: "返回论文目录" }).click();
  assert.equal(await page.locator(".paper-item").count(), 33);
  await writeFile(
    "tests/research-results.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        catalog: 33,
        dimensions,
        fulltext: true,
        lastPage: true,
        zoom: true,
        catalogPreserved: true,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}

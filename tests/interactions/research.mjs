import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import ts from "typescript";
const compiled = ts.transpileModule(
  await readFile("src/utils/book-pagination.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { paginateBook, paperBookPages, bookMetrics } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const paper = JSON.parse(await readFile("src/data/papers.json", "utf8"))[0];
const body = await readFile("public/papers/paper001.md", "utf8");
const pages = paperBookPages(paper, body);
assert.equal(pages.length % 2, 0);
assert.ok(pages.length > 4);
for (const page of pages) {
  assert.ok(
    page.reduce((sum, block) => sum + (block.kind === "image" ? 6 : 1), 0) <=
      bookMetrics.linesPerPage,
  );
  for (const block of page)
    if (block.kind === "text")
      assert.ok(
        [...block.text].reduce(
          (sum, c) => sum + (c.charCodeAt(0) < 128 ? 4 : 8),
          0,
        ) <= 104,
      );
}
assert.equal(pages.flat().filter((b) => b.kind === "image").length, 3);
assert.equal(
  paginateBook("![safe](/papers/figures/example.svg)")[0][0].kind,
  "image",
);
assert.equal(
  paginateBook("![remote](https://example.com/x.png)")[0][0].kind,
  "text",
);
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
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
await p.getByRole("button", { name: "MineResearch", exact: true }).click();
const book = p.getByRole("button", { name: `打开书籍：${paper.title}` });
await book.waitFor();
await p.waitForFunction(() =>
  [...document.querySelectorAll(".paper-item canvas")].every((c) =>
    c
      .getContext("2d")
      .getImageData(0, 0, c.width, c.height)
      .data.some((v, i) => i % 4 === 3 && v > 0),
  ),
);
await p.screenshot({
  path: "tests/screenshots/research-catalog-1920x1080.png",
});
await book.click();
assert.equal(
  await p.locator(".paper-book-viewer").getAttribute("data-book-state"),
  "opening",
);
await p.screenshot({ path: "tests/screenshots/research-book-opening.png" });
await p.locator('.paper-book-viewer[data-book-state="open"]').waitFor();
await p.waitForFunction(() =>
  document
    .querySelector(".book-navigation canvas")
    ?.getAttribute("aria-label")
    ?.includes("共"),
);
assert.ok(
  await p
    .getByRole("button", { name: "上一页", exact: true, includeHidden: true })
    .isDisabled(),
);
const dimensions = [];
for (const [width, height] of [
  [1366, 768],
  [1920, 1080],
  [2560, 1440],
]) {
  await p.setViewportSize({ width, height });
  await p.waitForTimeout(150);
  const spread = await p.locator(".book-spread").boundingBox();
  const back = await p
    .getByRole("button", { name: "返回论文目录" })
    .boundingBox();
  assert.ok(
    spread.x >= 0 &&
      spread.y >= 0 &&
      spread.x + spread.width <= width &&
      back.y + back.height <= height,
  );
  assert.ok(Math.abs(spread.x + spread.width / 2 - width / 2) < 1);
  for (const copy of await p.locator(".book-page-copy").all()) {
    const box = await copy.boundingBox();
    assert.ok(box.y + box.height <= spread.y + spread.height);
  }
  const text = await p
    .locator(".book-page canvas")
    .evaluateAll((ns) => ns.map((n) => n.getAttribute("aria-label")).join(""));
  const glyphs = await p.evaluate(async () =>
    (await fetch("/assets/inventory/font.json")).json(),
  );
  for (const c of text)
    if (c !== " ") assert.ok(glyphs[c], `Missing glyph ${c}`);
  await p.screenshot({
    path: `tests/screenshots/research-book-${width}x${height}.png`,
  });
  dimensions.push({
    width,
    height,
    scale: await p
      .locator(".research-screen")
      .getAttribute("data-research-scale"),
    spread,
  });
}
await p.setViewportSize({ width: 1920, height: 1080 });
let foundImage = false;
for (let spread = 1; spread < pages.length / 2; spread++) {
  await p.keyboard.press("ArrowRight");
  assert.equal(
    await p.locator(".book-page").first().getAttribute("aria-label"),
    `第 ${spread * 2 + 1} 页`,
  );
  const figures = p.locator(".book-page figure img");
  if (await figures.count()) {
    await p.waitForFunction(() =>
      [...document.querySelectorAll(".book-page figure img")].every(
        (n) => n.complete && n.naturalWidth > 0,
      ),
    );
    if (!foundImage) {
      await p.screenshot({
        path: "tests/screenshots/research-formula-pages.png",
      });
      foundImage = true;
    }
  }
}
assert.ok(foundImage);
assert.ok(
  await p
    .getByRole("button", { name: "下一页", exact: true, includeHidden: true })
    .isDisabled(),
);
await p.keyboard.press("ArrowLeft");
assert.ok(
  await p
    .getByRole("button", { name: "下一页", exact: true, includeHidden: true })
    .isEnabled(),
);
await p
  .getByRole("button", { name: "上一页", exact: true, includeHidden: true })
  .focus();
await p.keyboard.press("Enter");
await p.keyboard.press("Escape");
await book.waitFor();
assert.equal(await p.locator(".paper-book-viewer").count(), 0);
await book.click();
await p.locator('.paper-book-viewer[data-book-state="open"]').waitFor();
await p.getByRole("button", { name: "返回论文目录" }).click();
await book.waitFor();
await p.getByRole("button", { name: "返回主菜单" }).click();
assert.equal(await p.locator(".game").getAttribute("data-screen"), "main");
assert.deepEqual(errors, []);
assert.deepEqual(failed, []);
const reduced = await browser.newPage({ reducedMotion: "reduce" });
await reduced.goto("http://127.0.0.1:5173/");
await reduced
  .getByRole("button", { name: "MineResearch", exact: true })
  .click();
await reduced.getByRole("button", { name: `打开书籍：${paper.title}` }).click();
await reduced.locator('.paper-book-viewer[data-book-state="open"]').waitFor();
await reduced.close();
const missing = await browser.newPage();
await missing.route("**/papers/paper001.md", (r) => r.abort());
await missing.goto("http://127.0.0.1:5173/");
await missing
  .getByRole("button", { name: "MineResearch", exact: true })
  .click();
await missing.getByRole("button", { name: `打开书籍：${paper.title}` }).click();
await missing.getByRole("alert").waitFor();
await missing.getByRole("button", { name: "返回论文目录" }).click();
await missing.close();
const result = {
  date: new Date().toISOString(),
  pages: pages.length,
  images: 3,
  dimensions,
  openingAnimation: true,
  keyboard: true,
  pageBoundaries: true,
  reducedMotion: true,
  contentFailureFallback: true,
  errors,
  failed,
};
await writeFile("tests/research-results.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();

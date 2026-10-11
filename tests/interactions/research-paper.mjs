import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import ts from "typescript";
const compiled = ts.transpileModule(
  await readFile("src/utils/paper-document.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext } },
).outputText;
const { parsePaperDocument } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
assert.throws(() =>
  parsePaperDocument(
    JSON.stringify({
      version: 1,
      blocks: [
        {
          kind: "image",
          src: "https://example.org/a.png",
          width: 0,
          height: 0,
          alt: "x",
        },
      ],
    }),
  ),
);
assert.throws(() =>
  parsePaperDocument(JSON.stringify({ version: 2, blocks: [] })),
);
const catalog = JSON.parse(await readFile("src/data/papers.json", "utf8"));
const paper = catalog.find((p) => p.id === "nids-fgpa");
const doc = JSON.parse(await readFile("public" + paper.content, "utf8"));
parsePaperDocument(JSON.stringify(doc));
const provenance = JSON.parse(
  await readFile("public/papers/nids-fgpa/provenance.json", "utf8"),
);
assert.equal(provenance.assets.length, 160);
for (const a of provenance.assets) {
  const raw = await readFile("public" + a.src);
  assert.equal(createHash("sha256").update(raw).digest("hex"), a.sha256);
}
const browser = await chromium.launch({ headless: true });
try {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } }),
    errors = [],
    failed = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  p.on("response", (r) => {
    if (r.status() >= 400) failed.push(r.url());
  });
  await p.goto("http://127.0.0.1:5173/");
  await p
    .locator(".gui")
    .evaluate(
      async (n) => await Promise.all(n.getAnimations().map((a) => a.finished)),
    );
  await p.getByRole("button", { name: "MineResearch", exact: true }).click();
  await p.getByRole("button", { name: `打开书籍：${paper.title}` }).click();
  await p.locator('.paper-book-viewer[data-book-state="open"]').waitFor();
  await p.waitForFunction(() =>
    document
      .querySelector(".book-navigation canvas")
      ?.getAttribute("aria-label")
      ?.includes("共"),
  );
  const counter = await p
    .locator(".book-navigation canvas")
    .getAttribute("aria-label");
  const total = Number(counter.match(/共 (\d+) 页/)[1]);
  assert.ok(total > 50);
  const dimensions = [];
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await p.setViewportSize({ width, height });
    await p.waitForTimeout(150);
    const book = await p.locator(".book-spread").boundingBox(),
      back = await p
        .getByRole("button", { name: "返回论文目录" })
        .boundingBox();
    assert.ok(book.width / width > 0.8 && book.width / width < 0.97);
    assert.ok(book.y >= 0 && back.y + back.height <= height);
    assert.ok(Math.abs(book.x + book.width / 2 - width / 2) < 1);
    await p.screenshot({
      path: `tests/screenshots/research-real-paper-${width}x${height}.png`,
    });
    dimensions.push({ width, height, book });
  }
  await p.setViewportSize({ width: 1920, height: 1080 });
  await p.waitForTimeout(150);
  const shownAssets = new Set();
  let zoom = false,
    figureShot = false,
    textShot = false;
  for (let page = 1; page <= total; page += 2) {
    await p.getByRole("spinbutton", { name: "跳转页码" }).fill(String(page));
    await p.getByRole("spinbutton", { name: "跳转页码" }).press("Enter");
    await p.waitForFunction(
      (number) =>
        document.querySelector(".book-page")?.getAttribute("aria-label") ===
        `第 ${number} 页`,
      page,
    );
    const currentBook = await p.locator(".book-spread").boundingBox();
    assert.ok(
      currentBook.y >= 0,
      "Focusing the page field must not scroll the book out of view",
    );
    await p.waitForFunction(() =>
      [...document.querySelectorAll(".book-page img")].every(
        (n) => n.complete && n.naturalWidth > 0,
      ),
    );
    const layout = await p.locator(".book-page-copy").evaluateAll((nodes) =>
      nodes.map((n) => ({
        height: n.getBoundingClientRect().height,
        limit: n.closest(".book-page").getBoundingClientRect().height,
        overflow: [...n.querySelectorAll(".book-rich-line")].some(
          (line) => line.scrollWidth > line.clientWidth + 2,
        ),
      })),
    );
    for (const l of layout) {
      assert.ok(l.height + 60 < l.limit);
      assert.equal(l.overflow, false);
    }
    for (const src of await p
      .locator(".book-page img")
      .evaluateAll((ns) => ns.map((n) => n.getAttribute("src"))))
      shownAssets.add(src);
    if (!textShot && (await p.locator(".book-rich-line").count()) > 5) {
      await p.screenshot({
        path: "tests/screenshots/research-real-paper-text.png",
      });
      textShot = true;
    }
    if (await p.locator(".paper-figure-button").count()) {
      if (!figureShot) {
        await p.screenshot({
          path: "tests/screenshots/research-real-paper-figure.png",
        });
        figureShot = true;
      }
      if (!zoom) {
        await p.locator(".paper-figure-button").first().click();
        await p.getByRole("dialog", { name: "原图查看" }).waitFor();
        await p.screenshot({
          path: "tests/screenshots/research-real-paper-original-image.png",
        });
        await p.keyboard.press("Escape");
        assert.equal(await p.getByRole("dialog").count(), 0);
        assert.equal(
          await p.locator(".book-page").first().getAttribute("aria-label"),
          `第 ${page} 页`,
        );
        zoom = true;
      }
    }
  }
  const expected = new Set(
    doc.blocks.flatMap((b) =>
      b.kind === "image"
        ? [b.src]
        : b.runs.filter((r) => r.src).map((r) => r.src),
    ),
  );
  assert.deepEqual([...shownAssets].sort(), [...expected].sort());
  assert.ok(zoom && figureShot && textShot);
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  const result = {
    date: new Date().toISOString(),
    paper: paper.title,
    doi: paper.doi,
    pages: total,
    blocks: doc.blocks.length,
    assetsVerified: provenance.assets.length,
    assetsDisplayed: shownAssets.size,
    dimensions,
    allSpreadsChecked: true,
    wordWrapping: true,
    figureZoom: true,
    errors,
    failed,
  };
  await writeFile(
    "tests/research-paper-results.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}

import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import ts from "typescript";
const js = ts.transpileModule(
  await readFile("src/services/PaperSearchService.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { LocalPaperSearchService } = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
);
const service = new LocalPaperSearchService();
const papers = JSON.parse(await readFile("src/data/papers.json", "utf8"));
for (const [q, id] of [
  ["扩散", "001"],
  ["YTC", "001"],
  ["建模", "001"],
  ["数学建模", "001"],
  ["网络安全", "nids-fgpa"],
  ["人工智能", "nids-fgpa"],
  ["fedrated", "nids-fgpa"],
  ["理论估算", "001"],
])
  assert.equal(service.search(q, papers)[0]?.paper.id, id, q);
assert.equal(service.search("zzzzzzzzzz", papers).length, 0);
const fixture = [
  {
    ...papers[1],
    id: "title",
    title: "Agent research",
    category: "Other",
    keywords: [],
  },
  {
    ...papers[1],
    id: "tag",
    title: "Another study",
    keywords: ["Agent"],
    category: "Other",
  },
  {
    ...papers[1],
    id: "description",
    title: "Third study",
    keywords: [],
    category: "Other",
    description: "Agent research",
  },
];
assert.deepEqual(
  service.search("agent", fixture).map((x) => x.paper.id),
  ["title", "tag", "description"],
);
assert.equal(service.search("智能体", fixture)[0].paper.id, "tag");
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
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
  await p.locator(".gui").evaluate(async (n) => {
    await Promise.all(n.getAnimations().map((a) => a.finished));
  });
  await p.getByRole("button", { name: "MineResearch", exact: true }).click();
  await p.locator(".paper-item").first().waitFor();
  await p.waitForTimeout(800);
  assert.equal(await p.locator(".empty-shelf-record").count(), 4);
  assert.equal(await p.locator(".bookshelf-pillar img").count(), 6);
  const sizes = [];
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await p.setViewportSize({ width, height });
    await p.waitForTimeout(350);
    const box = await p.locator(".paper-bookshelf").boundingBox();
    const cells = await p.locator(".shelf-record").evaluateAll((ns) =>
      ns.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      }),
    );
    assert.equal(
      new Set(cells.map((c) => c.y)).size,
      3,
      "Three shelf rows must be visible",
    );
    assert.equal(new Set(cells.map((c) => c.x)).size, 2, "Two papers per row");
    for (const tile of await p.locator(".bookshelf-pillar img").all()) {
      const r = await tile.boundingBox();
      assert.ok(
        Math.abs(r.width - r.height) < 1,
        "Original bookshelf texture must remain square",
      );
    }
    assert.ok(cells.every((c) => c.y + c.h <= box.y + box.height + 1));
    const table = await p.locator(".enchantment-hotspot").boundingBox();
    assert.ok(
      table.x < width * 0.03,
      "Enchantment table belongs at viewport left edge",
    );
    assert.ok(
      box.x >= 0 &&
        box.x + box.width <= width &&
        table.y + table.height <= height,
    );
    await p.screenshot({
      path: `tests/screenshots/research-shelf-${width}x${height}.png`,
    });
    sizes.push({ width, height, shelf: box });
  }
  await p.setViewportSize({ width: 1920, height: 1080 });
  await p.waitForTimeout(150);
  const search = p.getByRole("textbox", { name: "附魔检索 · 搜索知识之书" });
  assert.equal(await search.isVisible(), false);
  await p.locator(".enchantment-hotspot").hover();
  await search.waitFor({ state: "visible" });
  await search.fill("YTC");
  await search.press("Enter");
  assert.equal(await p.locator(".paper-unmatched").count(), 1);
  assert.match(await p.locator("[role=status]").last().innerText(), /.*/);
  await p.screenshot({ path: "tests/screenshots/research-shelf-search.png" });
  await search.fill("zzzzzzzzzz");
  assert.equal(await p.locator(".paper-unmatched").count(), 2);
  await p.getByRole("button", { name: "清空搜索" }).click();
  assert.equal(await p.locator(".paper-unmatched").count(), 0);
  await p.mouse.move(1900, 10);
  await p
    .locator(".enchantment-search")
    .evaluate((n) => n.querySelector("input").blur());
  await p.waitForTimeout(250);
  const before = await p.locator(".research-catalog").boundingBox();
  const itemBefore = await p.locator(".paper-item").first().boundingBox();
  await p.locator(".paper-item").first().click();
  const during = await p.locator(".research-catalog").boundingBox();
  const itemDuring = await p.locator(".paper-item").first().boundingBox();
  assert.deepEqual(during, before, "Catalog must not reflow on open");
  assert.deepEqual(itemDuring, itemBefore, "Paper record must keep geometry");
  await p.locator(".paper-book-viewer[data-book-state=open]").waitFor();
  await p.keyboard.press("Escape");
  await p.locator(".paper-item").first().waitFor();
  assert.deepEqual(await p.locator(".research-catalog").boundingBox(), before);
  // Keyboard entry does not depend on pointer hover.
  await p.getByRole("button", { name: "打开论文搜索" }).focus();
  await p.keyboard.press("Enter");
  assert.equal(
    await search.evaluate((n) => n === document.activeElement),
    true,
  );
  const six = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await six.route("**/src/data/papers.json*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `export default ${JSON.stringify(Array.from({ length: 6 }, (_, i) => ({ ...papers[i % 2], id: `fixture-${i}`, title: `测试藏书 ${i + 1}` })))};`,
    }),
  );
  await six.goto("http://127.0.0.1:5173/");
  await six.locator(".gui").evaluate(async (n) => {
    await Promise.all(n.getAnimations().map((a) => a.finished));
  });
  await six.getByRole("button", { name: "MineResearch", exact: true }).click();
  await six.locator(".paper-item").first().waitFor();
  assert.equal(await six.locator(".paper-item").count(), 6);
  assert.equal(await six.locator(".empty-shelf-record").count(), 0);
  assert.ok(
    await six
      .locator(".paper-bookshelf")
      .evaluate((n) => n.scrollHeight <= n.clientHeight + 1),
    "Six paper records must fit without vertical scrolling",
  );
  await six.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  await writeFile(
    "tests/research-shelf-results.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        sixPaperCapacity: true,
        completeBookshelfColumns: true,
        viewportBottomLeftTable: true,
        searchTests: true,
        ranking: true,
        keyboardSearch: true,
        stableCatalogOnOpen: true,
        sizes,
        errors,
        failed,
      },
      null,
      2,
    ),
  );
  console.log("Shelf/search/reflow checks passed", sizes);
} finally {
  await browser.close();
}

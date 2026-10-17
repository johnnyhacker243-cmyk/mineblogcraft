import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import ts from "typescript";
const nodes = JSON.parse(await readFile("src/data/wiki.json", "utf8"));
const source = ts.transpileModule(
  await readFile("src/services/WikiSearchService.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { LocalWikiSearchService } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const search = new LocalWikiSearchService();
for (const [q, id] of [
  ["NMAP", "nmap"],
  ["agent", "agent"],
  ["扩散方程", "diffusion"],
  ["mathematical", "modeling"],
  ["NIDS-FGPA", "federated-nids"],
  ["Agnet", "agent"],
])
  assert.equal(search.search(q, nodes)[0]?.node.id, id, q);
assert.ok(search.search("建模", nodes).some((r) => r.node.id === "modeling"));
assert.equal(search.search("zzzzzzzzzzzz", nodes).length, 0);
assert.ok(nodes.every((n) => n.status === "untracked"));
const ids = new Set(nodes.map((n) => n.id));
assert.equal(ids.size, nodes.length);
for (const n of nodes) assert.ok(n.parentIds.every((id) => ids.has(id)));
const visit = (n, path = []) => {
  assert.ok(!path.includes(n.id), "No graph cycle");
  n.parentIds.forEach((id) =>
    visit(
      nodes.find((p) => p.id === id),
      [...path, n.id],
    ),
  );
};
nodes.forEach((n) => visit(n));
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } }),
    errors = [],
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
  await p.getByRole("button", { name: "MineWiki", exact: true }).click();
  await p.locator(".wiki-node").first().waitFor();
  await p.waitForTimeout(350);
  const dimensions = [];
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await p.setViewportSize({ width, height });
    await p.waitForTimeout(250);
    const box = await p.locator(".wiki-window").boundingBox();
    assert.ok(
      box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.width <= width &&
        box.y + box.height <= height,
    );
    const back = await p
      .getByRole("button", { name: "返回主菜单" })
      .boundingBox();
    assert.ok(back.y + back.height <= height);
    await p.mouse.move(0, 0);
    await p.screenshot({
      path: `tests/screenshots/wiki-${width}x${height}.png`,
    });
    dimensions.push({ width, height, window: box });
  }
  await p.setViewportSize({ width: 1920, height: 1080 });
  for (const [cat, count] of [
    ["Security", nodes.filter((n) => n.category === "Security").length],
    ["Software", nodes.filter((n) => n.category === "Software").length],
    ["Modeling", nodes.filter((n) => n.category === "Modeling").length],
    ["AI", nodes.filter((n) => n.category === "AI").length],
  ]) {
    await p.getByRole("tab", { name: cat, exact: true }).click();
    assert.equal(await p.locator(".wiki-node").count(), count);
    assert.equal(
      await p
        .getByRole("tab", { name: cat, exact: true })
        .getAttribute("aria-selected"),
      "true",
    );
  }
  await p.getByRole("tab", { name: "AI", exact: true }).focus();
  await p.keyboard.press("ArrowRight");
  assert.equal(
    await p
      .getByRole("tab", { name: "Security", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await p.getByRole("tab", { name: "AI", exact: true }).click();
  const tree = p.locator(".wiki-tree"),
    map = p.locator(".wiki-map");
  const before = await map.getAttribute("data-view");
  const r = await tree.boundingBox();
  await p.mouse.move(r.x + 80, r.y + 40);
  await p.mouse.down();
  await p.mouse.move(r.x + 170, r.y + 70, { steps: 6 });
  await p.mouse.up();
  assert.notEqual(await map.getAttribute("data-view"), before);
  await p.mouse.wheel(0, -250);
  await p.waitForTimeout(150);
  const zoomed = await map.getAttribute("data-view");
  assert.notEqual(zoomed, before);
  await p.getByRole("button", { name: "重置知识树视图" }).click();
  assert.equal(await map.getAttribute("data-view"), before);
  await p
    .getByRole("button", { name: "知识点：AI Security", exact: true })
    .focus();
  await p.waitForTimeout(100);
  const focusBox = await p
    .getByRole("button", { name: "知识点：AI Security", exact: true })
    .boundingBox();
  const focusedTree = await tree.boundingBox();
  assert.ok(
    focusBox.x >= focusedTree.x &&
      focusBox.x + focusBox.width <= focusedTree.x + focusedTree.width,
  );
  assert.equal(
    await tree.evaluate((n) => n.scrollLeft),
    0,
    "Keyboard focus must not cause hidden native scrolling",
  );
  const input = p.getByRole("textbox", { name: "搜索知识" });
  await input.fill("nmap");
  await p.waitForTimeout(150);
  assert.equal(
    await p
      .getByRole("tab", { name: "Security", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  const node = p.getByRole("button", { name: "知识点：Nmap", exact: true });
  assert.match(await node.getAttribute("class"), /wiki-matched/);
  const nb = await node.boundingBox();
  const tr = await tree.boundingBox();
  assert.ok(Math.abs(nb.x + nb.width / 2 - (tr.x + tr.width / 2)) < 2);
  await node.hover();
  await p.getByRole("tooltip").waitFor();
  await p.screenshot({ path: "tests/screenshots/wiki-search-tooltip.png" });
  await node.click();
  await p.getByRole("dialog", { name: "Nmap 详情" }).waitFor();
  await p.screenshot({ path: "tests/screenshots/wiki-detail.png" });
  await p.keyboard.press("Escape");
  assert.equal(await p.locator(".wiki-detail").count(), 0);
  assert.equal(await p.locator(".game").getAttribute("data-screen"), "wiki");
  await input.fill("zzzzzzzzzz");
  assert.equal(await p.locator(".wiki-matched").count(), 0);
  await p.getByRole("button", { name: "清空知识搜索" }).click();
  assert.equal(await input.inputValue(), "");
  await input.fill("扩散方程");
  await p.waitForTimeout(100);
  assert.equal(
    await p
      .getByRole("tab", { name: "Modeling", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await p
    .getByRole("button", { name: "知识点：Diffusion Equation", exact: true })
    .focus();
  await p.keyboard.press("Enter");
  await p.getByRole("dialog", { name: "Diffusion Equation 详情" }).waitFor();
  await p.getByRole("button", { name: "关闭知识详情" }).click();
  await p.getByRole("button", { name: "返回主菜单" }).click();
  assert.equal(await p.locator(".game").getAttribute("data-screen"), "main");
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  const result = {
    date: new Date().toISOString(),
    nodes: nodes.length,
    dimensions,
    tabs: true,
    drag: true,
    wheelZoom: true,
    searchFocus: true,
    tooltip: true,
    detail: true,
    keyboard: true,
    untrackedStates: true,
    errors,
    failed,
  };
  await writeFile("tests/wiki-results.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}

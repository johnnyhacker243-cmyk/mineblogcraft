import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const duration = Number(process.env.STABILITY_MS || 180000);
const channel = process.env.BROWSER_CHANNEL;
assert.ok(!channel || ["msedge", "chrome"].includes(channel));
const reportName = channel ? `wiki-stability-${channel}` : "wiki-stability";
const browser = await chromium.launch({ channel });
await mkdir("tests/screenshots", { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("crash", () => errors.push("Browser renderer crashed"));
  await page.goto(base);
  if (await page.getByText("页面访问提示", { exact: true }).count())
    await page.getByText("确定访问", { exact: true }).click();
  await page.getByRole("button", { name: "MineWiki", exact: true }).click();
  await page.locator(".wiki-node").first().waitFor();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Performance.enable");
  const samples = [];
  async function sample() {
    await cdp.send("HeapProfiler.collectGarbage");
    const metrics = (await cdp.send("Performance.getMetrics")).metrics;
    samples.push({
      heapBytes: metrics.find((m) => m.name === "JSHeapUsedSize")?.value,
      nodes: metrics.find((m) => m.name === "Nodes")?.value,
      canvases: await page.locator("canvas").count(),
    });
  }
  // One task queues multiple React updaters and clears the drag ref before
  // render. The unfixed implementation throws panX/null and empties #root.
  async function releaseBurst(type) {
    const tree = page.locator("#wiki-tree");
    const box = await tree.boundingBox();
    await page.mouse.move(box.x + box.width - 20, box.y + box.height - 20);
    await page.mouse.down();
    await tree.evaluate((element, endType) => {
      for (let i = 0; i < 12; i++)
        element.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            pointerId: 1,
            buttons: 1,
            clientX: 150 + i * 3,
            clientY: 160 + i * 2,
          }),
        );
      element.dispatchEvent(
        new PointerEvent(endType, { bubbles: true, pointerId: 1 }),
      );
    }, type);
    await page.mouse.up();
    await page.waitForTimeout(20);
    assert.deepEqual(errors, []);
    assert.equal(await page.locator(".page-recovery").count(), 0);
    assert.ok(await page.locator(".wiki-screen").isVisible());
  }
  await sample();
  for (let i = 0; i < 60; i++)
    await releaseBurst(
      ["pointerup", "pointercancel", "lostpointercapture"][i % 3],
    );
  await sample();
  console.log(
    "PASS: 60 batched drag/release/cancel/capture-loss regressions; starting soak.",
  );
  const started = Date.now();
  let rounds = 0;
  while (Date.now() - started < duration) {
    await page
      .getByRole("tab", {
        name: ["AI", "Security", "Software", "Modeling"][rounds % 4],
        exact: true,
      })
      .click();
    const directory = page.getByRole("combobox", { name: "知识目录" });
    const id = await directory.locator("option").nth(1).getAttribute("value");
    await directory.selectOption(id);
    await page.locator(".wiki-detail-scroll").evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.getByRole("button", { name: "关闭知识详情" }).click();
    await releaseBurst("pointerup");
    await page.getByRole("button", { name: "重置知识树视图" }).click();
    await page.waitForTimeout(1800);
    assert.deepEqual(errors, []);
    rounds++;
    if (rounds % 15 === 0)
      console.log(
        `Soak ${Math.round((Date.now() - started) / 1000)}s: ${rounds} reading/navigation rounds, no errors.`,
      );
  }
  await page.getByRole("tab", { name: "AI", exact: true }).click();
  await page.mouse.move(0, 0);
  await sample();
  assert.ok(
    samples.at(-1).canvases <= samples[0].canvases + 10,
    "Canvas count stays bounded",
  );
  assert.deepEqual(errors, []);
  await page.screenshot({ path: "tests/screenshots/wiki-stability.png" });
  await page.getByRole("button", { name: "返回主菜单", exact: true }).click();
  await page.getByRole("button", { name: "MineBlog", exact: true }).click();
  await page.locator(".world-card").first().waitFor();
  const result = {
    durationMs: Date.now() - started,
    burstCases: 60,
    readingRounds: rounds,
    samples,
    errors,
    crossPageUsable: true,
  };
  await writeFile(
    `tests/${reportName}-results.json`,
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}

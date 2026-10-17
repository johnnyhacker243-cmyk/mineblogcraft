import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.__audio = [];
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(...args) {
        super(...args);
        window.__audio.push(this);
      }
    };
  });
  const page = await context.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + "/");
  if (await page.getByText("页面访问提示", { exact: true }).count())
    await page.getByText("确定访问", { exact: true }).click();
  const toggle = page.getByRole("button", {
    name: "关闭背景音乐",
    exact: true,
  });
  await toggle.waitFor();
  // A fresh visit never downloads music before a real gesture.
  assert.equal(
    await page.evaluate(
      () => window.__audio.filter((a) => a.src.includes("/menu-")).length,
    ),
    0,
  );
  await toggle.click();
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await page.waitForFunction(() =>
    window.__audio.some(
      (a) =>
        a.src.includes("/menu-") &&
        !a.paused &&
        a.currentTime > 0 &&
        a.duration > 60,
    ),
  );
  await mkdir("tests/screenshots", { recursive: true });
  await page.screenshot({
    path: `tests/screenshots/menu-music-${base.startsWith("https") ? "live" : "local"}.png`,
  });
  await page.getByRole("button", { name: "MineWiki", exact: true }).click();
  const directory = page.getByRole("combobox", { name: "知识目录" });
  await directory.selectOption("rag");
  let panel = page.getByRole("dialog");
  await panel.waitFor();
  await panel.getByRole("article").waitFor();
  assert.ok((await panel.getByRole("article").innerText()).length > 700);
  assert.ok(
    await page.evaluate(() =>
      window.__audio.some((a) => a.src.includes("/menu-") && !a.paused),
    ),
  );
  await panel
    .getByRole("button", { name: "图谱与全局检索", exact: true })
    .first()
    .click();
  panel = page.getByRole("dialog", { name: "图谱与全局检索 详情" });
  await panel.waitFor();
  await panel.locator(".wiki-evidence summary").click();
  await panel.getByRole("link", { name: "打开来源 ↗", exact: true }).waitFor();
  await mkdir("tests/screenshots", { recursive: true });
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    const box = await panel.boundingBox();
    assert.ok(
      box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.width <= width &&
        box.y + box.height <= height,
    );
    assert.ok(await panel.evaluate((n) => n.scrollWidth <= n.clientWidth));
    await page.screenshot({
      path: `tests/screenshots/wiki-rich-${base.startsWith("https") ? "live" : "local"}-${width}x${height}.png`,
    });
  }
  await panel.getByRole("button", { name: "关闭知识详情" }).click();
  await page.getByRole("textbox", { name: "搜索知识" }).fill("零知识证明");
  await directory
    .getByRole("option", { name: "隐私与可验证计算", exact: true })
    .waitFor({ state: "attached" });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "返回主菜单" }).click();
  await page.getByRole("button", { name: "关闭背景音乐", exact: true }).click();
  assert.ok(
    await page.evaluate(() =>
      window.__audio
        .filter((a) => a.src.includes("/menu-"))
        .every((a) => a.paused),
    ),
  );
  await page.reload();
  await page
    .getByRole("button", { name: "开启背景音乐", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "MineWiki", exact: true }).click();
  assert.equal(
    await page.evaluate(
      () => window.__audio.filter((a) => a.src.includes("/menu-")).length,
    ),
    0,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: native OGG decoding/playback, gesture gate, continuous music across navigation, mute persistence, rich Wiki sources/backlinks, full-text search, three viewports.",
  );
} finally {
  await browser.close();
}

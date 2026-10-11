import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const errors = [],
  badResponses = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400)
    badResponses.push({ url: r.url(), status: r.status() });
});
await page.goto("http://127.0.0.1:5173");
await page.locator('.panorama[data-status="ready"]').waitFor();
await page.waitForFunction(() =>
  [...document.querySelectorAll(".pixel-text")].every((c) => c.width > 1),
);
await page.waitForTimeout(2200);
await page.mouse.move(0, 0);
const dimensions = [];
for (const [width, height] of [
  [1920, 1080],
  [1366, 768],
  [1280, 720],
  [1600, 900],
  [2560, 1440],
]) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(250);
  const scale = Number(
    await page.locator(".game").getAttribute("data-gui-scale"),
  );
  const box = await page
    .getByRole("button", { name: "MineBlog", exact: true })
    .boundingBox();
  const gw = Math.ceil(width / scale),
    gh = Math.ceil(height / scale),
    sx = width / gw,
    sy = height / gh;
  const expected = {
    x: (Math.floor(gw / 2) - 100) * sx,
    y: (Math.floor(gh / 4) + 48) * sy,
    width: 200 * sx,
    height: 20 * sy,
  };
  const delta = Object.fromEntries(
    Object.keys(expected).map((k) => [k, box[k] - expected[k]]),
  );
  Object.values(delta).forEach((d) => assert.ok(Math.abs(d) < 0.05));
  const gui = await page.evaluate(() =>
    Object.fromEntries(
      [".logo", ".edition", ".lower-buttons", ".splash-anchor", "footer"].map(
        (s) => {
          const element = document.querySelector(s);
          if (!element) return [s, null];
          const r = element.getBoundingClientRect();
          return [s, { x: r.x, y: r.y, width: r.width, height: r.height }];
        },
      ),
    ),
  );
  dimensions.push({
    width,
    height,
    scale,
    logicalWidth: gw,
    logicalHeight: gh,
    singleplayer: box,
    expected,
    delta,
    gui,
  });
  await page.screenshot({
    path: `tests/screenshots/main-${width}x${height}.png`,
  });
}
await page.setViewportSize({ width: 1920, height: 1080 });
await page.getByRole("button", { name: "MineBlog", exact: true }).hover();
await page.screenshot({ path: "tests/screenshots/hover-1920x1080.png" });
assert.match(
  await page
    .getByRole("button", { name: "MineBlog", exact: true })
    .evaluate((el) => getComputedStyle(el).borderImageSource),
  /button-highlight/,
);
const before = Number(await page.locator(".panorama").getAttribute("data-yaw"));
await page.waitForTimeout(1100);
const after = Number(await page.locator(".panorama").getAttribute("data-yaw"));
assert.ok(after > before, "panorama rotates");
const menus = [
  ["MineBlog", "worlds"],
  ["MineRSS", "multiplayer"],
  ["MineResearch", "realms"],
  ["MineWiki", "wiki"],
  ["Quit Game", "exit"],
  ["Language", "language"],
  ["作者介绍", "profile"],
];
for (const [name, id] of menus) {
  await page.getByRole("button", { name, exact: true }).click();
  assert.equal(await page.locator(".game").getAttribute("data-screen"), id);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".game").getAttribute("data-screen"), "main");
}
await page.mouse.move(0, 0);
await page.getByRole("button", { name: "MineBlog", exact: true }).focus();
await page.keyboard.press("Enter");
assert.equal(await page.locator(".game").getAttribute("data-screen"), "worlds");
await page.getByRole("button", { name: "返回主菜单", exact: true }).focus();
await page.keyboard.press("Space");
assert.equal(await page.locator(".game").getAttribute("data-screen"), "main");
await page.keyboard.press("Tab");
assert.equal(
  await page.evaluate(() => document.activeElement?.tagName),
  "BUTTON",
);
await page.screenshot({ path: "tests/screenshots/main-final-1920x1080.png" });
const fail = await browser.newPage();
await fail.route("**/panorama_3.png", (r) => r.abort());
await fail.goto("http://127.0.0.1:5173");
await fail.locator('.panorama[data-status="fallback"]').waitFor();
await fail.waitForTimeout(2200);
await fail.screenshot({ path: "tests/screenshots/texture-fallback.png" });
await fail.close();
const noGL = await browser.newPage();
await noGL.addInitScript(() => {
  const get = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    if (String(type).startsWith("webgl")) return null;
    return get.call(this, type, ...args);
  };
});
await noGL.goto("http://127.0.0.1:5173");
await noGL.locator('.panorama[data-status="fallback"]').waitFor();
await noGL.close();
const result = {
  date: new Date().toISOString(),
  dimensions,
  rotationDeltaRadians: after - before,
  errors,
  badResponses,
  interactionCases: menus.map((x) => x[0]),
  keyboard: ["Tab", "Enter", "Space", "Escape"],
  textureFailureFallback: true,
  webGLFallback: true,
};
await writeFile("tests/results.json", JSON.stringify(result, null, 2));
await browser.close();
assert.deepEqual(errors, []);
assert.deepEqual(badResponses, []);
console.log(JSON.stringify(result, null, 2));

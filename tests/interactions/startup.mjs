import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  let release;
  const gate = new Promise((resolve) => (release = resolve));
  await page.route("**/assets/panorama/panorama_0.png", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" });
  const boot = page.locator("#startup-loader");
  await boot.waitFor();
  assert.equal(
    await boot.evaluate((n) => getComputedStyle(n).backgroundColor),
    "rgb(239, 50, 61)",
  );
  await page.waitForTimeout(1300);
  assert.ok(
    await boot.isVisible(),
    "Loader waits for panorama instead of a fake fixed delay",
  );
  assert.ok((await page.locator("#root").getAttribute("inert")) !== null);
  assert.ok(
    await page
      .locator(".startup-logo")
      .evaluate((n) => n.complete && n.naturalWidth === 1024),
  );
  assert.ok(
    Number(await page.getByRole("progressbar").getAttribute("aria-valuenow")) <
      100,
  );
  await page.screenshot({ path: "tests/screenshots/startup-1920x1080.png" });
  release();
  await boot.waitFor({ state: "detached", timeout: 15000 });
  assert.equal(await page.locator("#root").getAttribute("inert"), null);
  await page.getByRole("button", { name: "MineRSS", exact: true }).click();
  assert.equal(
    await boot.count(),
    0,
    "Navigation does not replay startup animation",
  );
  await page.keyboard.press("Escape");
  const sizes = [];
  for (const [width, height] of [
    [1366, 768],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    await page.reload({ waitUntil: "domcontentloaded" });
    await boot.waitFor();
    const logo = await page.locator(".startup-logo").boundingBox();
    assert.ok(Math.abs(logo.width / logo.height - 4) < 0.001);
    assert.ok(Math.abs(logo.x + logo.width / 2 - width / 2) < 1);
    assert.ok(Math.abs(logo.y + logo.height / 2 - height / 2) < 1);
    await page.screenshot({
      path: `tests/screenshots/startup-${width}x${height}.png`,
    });
    await boot.waitFor({ state: "detached", timeout: 15000 });
    sizes.push({ width, height, logo });
  }
  assert.deepEqual(errors, []);
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const overlay = document.getElementById("startup-loader");
      new MutationObserver(() => {
        if (overlay.dataset.phase === "fading")
          window.loadingFadeDuration =
            getComputedStyle(overlay).transitionDuration;
      }).observe(overlay, {
        attributes: true,
        attributeFilter: ["data-phase"],
      });
    });
  });
  await reduced.goto("http://127.0.0.1:5173/", {
    waitUntil: "domcontentloaded",
  });
  await reduced.locator("#startup-loader").waitFor({ state: "detached" });
  assert.equal(
    await reduced.evaluate(() => window.loadingFadeDuration),
    "0.15s",
  );
  const failed = await browser.newPage();
  await failed.route("**/assets/panorama/panorama_*.png", (route) =>
    route.abort(),
  );
  await failed.goto("http://127.0.0.1:5173/", {
    waitUntil: "domcontentloaded",
  });
  await failed
    .locator("#startup-loader")
    .waitFor({ state: "detached", timeout: 15000 });
  assert.equal(
    await failed.locator(".panorama").getAttribute("data-status"),
    "fallback",
  );
  await failed.getByRole("button", { name: "MineBlog", exact: true }).click();
  assert.equal(
    await failed.locator(".game").getAttribute("data-screen"),
    "worlds",
  );
  await writeFile(
    "tests/startup-results.json",
    JSON.stringify(
      {
        sizes,
        errors,
        checks: [
          "original logo and red color",
          "waits for actual resources",
          "refresh replays",
          "no replay on navigation",
          "inert during loading",
          "reduced motion",
          "texture failure permits fallback",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "Startup overlay: resource wait, reload, three resolutions, reduced motion and fallback passed.",
  );
} finally {
  await browser.close();
}

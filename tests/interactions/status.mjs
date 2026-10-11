import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    }),
    errors = [],
    failures = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(r.url());
  });
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: "MineStatus", exact: true }).click();
  await page.locator(".status-panel").waitFor();
  await page.waitForTimeout(1000);
  assert.equal(await page.locator(".status-item").count(), 3);
  assert.equal(
    await page
      .getByRole("img", { name: "静态示例 · 未接监控", exact: true })
      .count(),
    1,
  );
  const sizes = [];
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(250);
    const box = await page.locator(".status-window").boundingBox();
    assert.ok(
      box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.width <= width &&
        box.y + box.height < height,
    );
    const before = await page.locator(".status-window").boundingBox();
    await page
      .getByRole("button", { name: "Website Online", exact: true })
      .click();
    const after = await page.locator(".status-window").boundingBox();
    await page.waitForTimeout(100);
    const singleColor = await page
      .locator(".status-panel canvas.inventory-text")
      .evaluateAll((nodes) =>
        nodes.every((canvas) => {
          const pixels = canvas
            .getContext("2d")
            .getImageData(0, 0, canvas.width, canvas.height).data;
          const colors = new Set();
          for (let i = 0; i < pixels.length; i += 4)
            if (pixels[i + 3])
              colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`);
          return colors.size === 1;
        }),
      );
    assert.ok(
      singleColor,
      "Each detail glyph is drawn in one color without an offset shadow layer",
    );
    if (width === 1920)
      await page.screenshot({
        path: "tests/screenshots/status-website-no-shadow.png",
      });

    assert.deepEqual(after, before, "Details do not resize or move frame");
    assert.equal(
      await page.getByRole("img", { name: "未接入", exact: true }).count(),
      1,
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator(".game").getAttribute("data-screen"),
      "status",
    );
    await page.mouse.move(0, 0);
    await page.locator(".status-heading").click();
    await page.screenshot({
      path: `tests/screenshots/status-${width}x${height}.png`,
    });
    sizes.push({ width, height, box });
  }
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page
    .getByRole("button", { name: "Mineblogcraft Core", exact: true })
    .hover();
  assert.ok(
    await page.getByRole("tooltip").filter({ hasText: "" }).first().isVisible(),
  );
  await page.screenshot({ path: "tests/screenshots/status-tooltip.png" });
  await page
    .getByRole("button", { name: "Modules Ready", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".status-detail-rows > div").count(), 4);
  await page.mouse.move(0, 0);
  await page.screenshot({ path: "tests/screenshots/status-detail.png" });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Last Update", exact: true }).focus();
  await page.keyboard.press("Space");
  assert.equal(
    await page
      .getByRole("img", { name: "Mineblogcraft v1.0", exact: true })
      .count(),
    1,
  );
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".game").getAttribute("data-screen"), "main");
  await page.getByRole("button", { name: "MineStatus", exact: true }).click();
  await page.locator(".status-panel").waitFor();
  assert.equal(
    await page.locator(".status-item[aria-pressed=true]").count(),
    0,
  );
  assert.ok(await page.locator(".status-book canvas").isVisible());
  assert.equal(
    await page.locator(".enchantment-model").getAttribute("data-fallback"),
    null,
  );
  await page.waitForTimeout(600);
  const frameA = await page.locator(".status-book").screenshot();
  await page.waitForTimeout(700);
  const frameB = await page.locator(".status-book").screenshot();
  assert.ok(!frameA.equals(frameB), "Book actually animates");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(100);
  const stillA = await page.locator(".status-book").screenshot();
  await page.waitForTimeout(300);
  const stillB = await page.locator(".status-book").screenshot();
  assert.ok(stillA.equals(stillB), "Reduced motion stops book animation");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  await writeFile(
    "tests/status-results.json",
    JSON.stringify(
      {
        sizes,
        errors,
        failures,
        checks: [
          "static demo disclosure",
          "detail text has no shadow layer",
          "frame stability",
          "tooltips",
          "keyboard activation",
          "Escape/back and re-entry",
          "WebGL book",
          "actual book animation and reduced motion",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "MineStatus browser checks passed at 1366×768, 1920×1080, 2560×1440.",
  );
} finally {
  await browser.close();
}

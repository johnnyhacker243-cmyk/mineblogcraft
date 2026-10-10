import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("tests/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.addInitScript(() => {
  window.__profileAudioPlays = 0;
  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    window.__profileAudioPlays++;
    return originalPlay.call(this);
  };
  window.__profileGL = [];
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    const gl = original.call(this, type, ...args);
    if (gl && String(type).startsWith("webgl") && !gl.__tracked) {
      gl.__tracked = true;
      const tracked = {
        gl,
        canvas: this,
        textures: new Set(),
        buffers: new Set(),
        programs: new Set(),
      };
      window.__profileGL.push(tracked);
      for (const [kind, create, destroy] of [
        ["textures", "createTexture", "deleteTexture"],
        ["buffers", "createBuffer", "deleteBuffer"],
        ["programs", "createProgram", "deleteProgram"],
      ]) {
        const make = gl[create].bind(gl),
          remove = gl[destroy].bind(gl);
        gl[create] = (...values) => {
          const object = make(...values);
          tracked[kind].add(object);
          return object;
        };
        gl[destroy] = (object) => {
          tracked[kind].delete(object);
          return remove(object);
        };
      }
    }
    return gl;
  };
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
await page.getByRole("button", { name: "作者介绍", exact: true }).click();
await page.locator('.steve-model[data-ready="true"]').waitFor();
await page.waitForFunction(() =>
  [...document.querySelectorAll(".inventory-text")].every((c) =>
    c
      .getContext("2d")
      .getImageData(0, 0, c.width, c.height)
      .data.some((v, i) => i % 4 === 3 && v > 0),
  ),
);
assert.equal(
  await page.locator(".inventory-screen button").count(),
  1,
  "Only the requested return button is interactive",
);
assert.equal(await page.locator(".inventory-tab").count(), 8);
assert.equal(await page.locator(".item-slots>.inventory-slot").count(), 9);
assert.equal(await page.locator(".text-slots,.sign-board").count(), 0);
assert.equal(await page.locator(".item-count").count(), 8);
assert.equal(await page.locator(".status-hearts>.status-icon").count(), 10);
assert.equal(await page.locator(".status-food>.status-icon").count(), 10);
assert.equal(
  await page.locator('.item-slots img[src$="pickaxe.png"]').count(),
  1,
);
assert.equal(
  await page.locator('.item-slots img[src$="diamond.png"]').count(),
  8,
);
const frameBox = await page.locator(".inventory-frame").boundingBox();
const tabsBox = await page.locator(".inventory-tabs").boundingBox();
const brandBox = await page.locator(".inventory-brand").boundingBox();
assert.ok(
  Math.abs(tabsBox.x + tabsBox.width - frameBox.x - frameBox.width) < 0.1,
  "Tabs align to right edge",
);
assert.ok(Math.abs(brandBox.x - frameBox.x) < 0.1, "Logo aligns to left edge");
assert.match(
  await page.locator(".steve-model").getAttribute("data-equipment"),
  /diamond_boots,diamond_pickaxe/,
);
const dimensions = [];
for (const [width, height] of [
  [1920, 1080],
  [1366, 768],
  [1280, 720],
  [1600, 900],
  [2560, 1440],
]) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(200);
  const box = await page.locator(".inventory-scene").boundingBox();
  assert.ok(
    box.x >= 0 &&
      box.y >= 0 &&
      box.x + box.width <= width + 0.1 &&
      box.y + box.height <= height + 0.1,
  );
  for (const margin of [
    box.x,
    box.y,
    width - box.x - box.width,
    height - box.y - box.height,
  ])
    assert.ok(Math.abs(margin - 64) < 0.1, "Exactly one 64px block border");
  const statusBox = await page.locator(".player-status").boundingBox();
  const hotbarBox = await page.locator(".item-slots").boundingBox();
  const copyBox = await page.locator(".website-introduction").boundingBox();
  const captionBox = await page.locator(".player-caption").boundingBox();
  assert.ok(
    captionBox.y + captionBox.height <= copyBox.y,
    "Player caption does not overlap introduction",
  );
  const backBox = await page
    .getByRole("button", { name: "返回目录" })
    .boundingBox();
  assert.ok(
    hotbarBox.y + hotbarBox.height < backBox.y,
    `Return button sits below hotbar: ${JSON.stringify({ width, hotbarBox, backBox })}`,
  );
  const currentFrame = await page.locator(".inventory-frame").boundingBox();
  assert.ok(
    currentFrame.y + currentFrame.height < backBox.y,
    "Return is outside and below the frame",
  );
  assert.ok(
    Math.abs(backBox.x + backBox.width / 2 - width / 2) < 0.1,
    "Return is horizontally centered",
  );
  const logicalScale = Number(
    await page.locator(".inventory-scene").getAttribute("data-inventory-scale"),
  );
  assert.equal(
    hotbarBox.height,
    18 * (logicalScale + 1),
    "Hotbar uses larger integer pixel scale",
  );
  assert.ok(
    copyBox.y + copyBox.height <= statusBox.y,
    "Website introduction does not overlap HUD",
  );
  assert.ok(
    statusBox.y + statusBox.height < hotbarBox.y,
    "Status icons sit above hotbar",
  );
  const viewport = await page.locator(".steve-model").boundingBox();
  await page.mouse.move(
    viewport.x + viewport.width / 2,
    viewport.y + viewport.height / 2,
  );
  await page.waitForTimeout(100);
  dimensions.push({
    width,
    height,
    scale: await page
      .locator(".inventory-scene")
      .getAttribute("data-inventory-scale"),
    box,
  });
  await page.screenshot({
    path: `tests/screenshots/profile-${width}x${height}.png`,
  });
}
await page.setViewportSize({ width: 1920, height: 1080 });
const host = page.locator(".steve-model");
await page.mouse.move(100, 400);
await page.waitForTimeout(100);
const left = Number(await host.getAttribute("data-head-yaw"));
await page.screenshot({ path: "tests/screenshots/profile-look-left.png" });
await page.mouse.move(1800, 700);
await page.waitForTimeout(100);
const right = Number(await host.getAttribute("data-head-yaw"));
assert.ok(left < 0 && right > 0, "Head turns towards mouse in 3D");
await page.screenshot({ path: "tests/screenshots/profile-look-right.png" });
const modelBox = await host.boundingBox();
await page.mouse.move(modelBox.x + modelBox.width / 2, 50);
await page.waitForTimeout(50);
const up = Number(await host.getAttribute("data-head-pitch"));
await page.mouse.move(modelBox.x + modelBox.width / 2, 1000);
await page.waitForTimeout(50);
const down = Number(await host.getAttribute("data-head-pitch"));
assert.ok(up < 0 && down > 0, "Head pitch responds to vertical mouse offset");
assert.equal(
  Number(await host.getAttribute("data-body-pitch")),
  0,
  "Torso stays upright while looking down",
);
assert.ok(Math.abs(down) <= (25 * Math.PI) / 180 + 0.001);
assert.equal(await host.getAttribute("data-grip"), "wooden_handle_at_palm");
const shaftNormalDot = Number(await host.getAttribute("data-shaft-normal-dot"));
assert.ok(
  Math.abs(shaftNormalDot - 1) < 1e-10,
  "Shaft is perpendicular to the user-facing hand surface (+Z)",
);
await page.screenshot({ path: "tests/screenshots/profile-look-down.png" });
const geometries = Number(await host.getAttribute("data-geometries"));
assert.ok(geometries > 20);
const playsBeforeReturn = await page.evaluate(() => window.__profileAudioPlays);
await page.getByRole("button", { name: "返回目录" }).click();
await page.locator('.game[data-screen="main"]').waitFor();
assert.ok(
  (await page.evaluate(() => window.__profileAudioPlays)) > playsBeforeReturn,
  "Return invokes click audio playback",
);
assert.equal(await page.locator(".game").getAttribute("data-screen"), "main");
// Repeated entry exercises creation/disposal and checks canvases do not pile up.
for (let i = 0; i < 3; i++) {
  await page.getByRole("button", { name: "作者介绍", exact: true }).click();
  await page.locator('.steve-model[data-ready="true"]').waitFor();
  assert.equal(await page.locator(".steve-model canvas").count(), 1);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".steve-model canvas").count(), 0);
}
await page.waitForFunction(() =>
  window.__profileGL
    .filter((c) => !c.canvas.isConnected)
    .every((c) => c.gl.isContextLost()),
);
const disposal = await page.evaluate(() =>
  window.__profileGL
    .filter((c) => !c.canvas.isConnected)
    .map((c) => ({
      textures: [...c.textures].filter((t) => c.gl.isTexture(t)).length,
      buffers: c.buffers.size,
      programs: c.programs.size,
      contextLost: c.gl.isContextLost(),
      internalTextureHandles: c.textures.size,
    })),
);
assert.ok(disposal.length >= 4);
for (const context of disposal)
  assert.deepEqual(context, {
    textures: 0,
    buffers: 0,
    programs: 0,
    contextLost: true,
    internalTextureHandles: 4,
  });
assert.deepEqual(errors, []);
assert.deepEqual(badResponses, []);
const noGL = await browser.newPage();
await noGL.addInitScript(() => {
  const get = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    return String(type).startsWith("webgl")
      ? null
      : get.call(this, type, ...args);
  };
});
await noGL.goto("http://127.0.0.1:5173");
await noGL.getByRole("button", { name: "作者介绍", exact: true }).click();
await noGL.locator(".model-error").waitFor();
await noGL.keyboard.press("Escape");
assert.equal(await noGL.locator(".game").getAttribute("data-screen"), "main");
await noGL.close();
const missing = await browser.newPage();
await missing.route("**/inventory/steve.png", (route) => route.abort());
await missing.goto("http://127.0.0.1:5173");
await missing.getByRole("button", { name: "作者介绍", exact: true }).click();
await missing.locator(".model-error").waitFor();
await missing.close();
const result = {
  date: new Date().toISOString(),
  dimensions,
  mouse: { left, right, up, down },
  geometries,
  errors,
  badResponses,
  reentry: 3,
  disposal,
  webGLUnavailableMessage: true,
  missingSkinMessage: true,
  hotbar: { slots: 9, diamondStacks: 8, countPerStack: 64 },
  torsoUpright: true,
  shaftNormalDot,
  status: { health: 20, food: 20, hearts: 10, foodIcons: 10 },
  blockBorder: 64,
  removedSignAndTextSlots: true,
};
await writeFile("tests/profile-results.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();

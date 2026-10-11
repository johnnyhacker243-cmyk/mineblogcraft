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
assert.equal(await page.locator(".inventory-tab").count(), 10);
assert.equal(await page.locator("svg.block-icon").count(), 3);
assert.equal(await page.locator("svg.block-icon image").count(), 9);
assert.equal(await page.locator('.inventory-tab[title="下界之星"]').count(), 0);
assert.deepEqual(
  await page
    .locator(".website-copy canvas")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label"))),
  [
    "Mineblogcraft 是一个属于我的数字世界。",
    "这里记录 AI、网络安全、软件工程学习过程中的探索与收获。",
    "有新的知识，就挖下来；有新的想法，就建起来。",
    "欢迎来到我的技术世界。",
  ],
);
assert.deepEqual(
  await page
    .locator(".profile-panel dd canvas")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("aria-label")),
    ),
  [
    "YTC",
    "JSPI",
    "AI · 网络安全 · 软件工程",
    "Mineblogcraft",
    "Minecraft 风格个人技术博客",
    "这个人很神秘，什么都没有写。",
    "只有风暴才能击倒大树",
  ],
);
assert.equal(await page.locator(".item-slots>.inventory-slot").count(), 9);
assert.equal(await page.locator(".text-slots,.sign-board").count(), 0);
assert.equal(await page.locator(".item-count").count(), 0);
assert.deepEqual(
  await page
    .locator(".item-slots>.inventory-slot")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label"))),
  [
    "Python",
    "AI",
    "Security",
    "Linux",
    "Docker",
    "Data",
    "Blog",
    "Wiki",
    "Research",
  ],
);
assert.equal(await page.locator(".status-hearts>.status-icon").count(), 10);
assert.equal(await page.locator(".status-food>.status-icon").count(), 10);
assert.equal(
  await page.locator('.item-slots img[src$="pickaxe.png"]').count(),
  0,
);
assert.equal(
  await page.locator('.item-slots img[src$="diamond.png"]').count(),
  0,
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
  [2559, 1258],
  [2559, 1438],
  [1440, 900],
  [1440, 760],
  [1100, 700],
  [900, 600],
  [800, 600],
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
  assert.ok(
    Math.abs(box.x + box.width / 2 - width / 2) < 0.1,
    "Logical GUI is centered horizontally",
  );
  assert.ok(
    Math.abs(box.y + box.height / 2 - height / 2) < 0.1,
    "Logical GUI is centered vertically",
  );
  const statusBox = await page.locator(".player-status").boundingBox();
  const windowBrand = await page.locator(".inventory-brand").boundingBox();
  const windowTabs = await page.locator(".inventory-tabs").boundingBox();
  assert.ok(
    windowBrand.x + windowBrand.width < windowTabs.x,
    "Logo and ten category icons never overlap",
  );
  const hotbarBox = await page.locator(".item-slots").boundingBox();
  const heartsBox = await page.locator(".status-hearts").boundingBox();
  const foodBox = await page.locator(".status-food").boundingBox();
  assert.ok(
    Math.abs(heartsBox.x - hotbarBox.x) < 0.1,
    "Hearts align with the left edge of skill slots",
  );
  assert.ok(
    Math.abs(foodBox.x + foodBox.width - hotbarBox.x - hotbarBox.width) < 0.1,
    "Hunger aligns with the right edge of skill slots",
  );
  const copyBox = await page.locator(".website-introduction").boundingBox();
  const panelBox = await page.locator(".profile-panel").boundingBox();
  const mottoBox = await page.locator(".profile-panel dd").last().boundingBox();
  assert.ok(
    mottoBox.y + mottoBox.height <= panelBox.y + panelBox.height,
    "All seven author fields fit the panel",
  );
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
    22 * logicalScale,
    "Skill slots use balanced integer pixel scale",
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
    profileBox: panelBox,
    playerBox: viewport,
    introductionBox: copyBox,
    statusAlignment: {
      leftDifference: heartsBox.x - hotbarBox.x,
      rightDifference:
        foodBox.x + foodBox.width - hotbarBox.x - hotbarBox.width,
    },
  });
  await page.screenshot({
    path: `tests/screenshots/profile-${width}x${height}.png`,
  });
}
await page.setViewportSize({ width: 1920, height: 1080 });
await page
  .locator(".inventory-tabs")
  .screenshot({ path: "tests/screenshots/profile-block-icons.png" });
await page.mouse.move(0, 0);
const firstSkill = page.getByRole("listitem", { name: "Python", exact: true });
const normalSkill = await firstSkill.evaluate(
  (n) => getComputedStyle(n).filter,
);
await firstSkill.hover();
const hoverSkill = await firstSkill.evaluate((n) => getComputedStyle(n).filter);
await page.screenshot({
  path: "tests/screenshots/profile-skill-hover-1920x1080.png",
});
await page.mouse.move(0, 0);
await firstSkill.focus();
await page.keyboard.press("Tab");
await page.keyboard.press("Shift+Tab");
const focusedSkill = await firstSkill.evaluate(
  (n) => getComputedStyle(n).filter,
);
assert.notEqual(normalSkill, hoverSkill);
assert.equal(focusedSkill, hoverSkill);
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
for (const { textures, buffers, programs, contextLost } of disposal)
  assert.deepEqual(
    { textures, buffers, programs, contextLost },
    {
      textures: 0,
      buffers: 0,
      programs: 0,
      contextLost: true,
    },
  );
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
  skillsHighlight: {
    normal: normalSkill,
    hover: hoverSkill,
    keyboardFocus: focusedSkill,
  },
  errors,
  badResponses,
  reentry: 3,
  disposal,
  webGLUnavailableMessage: true,
  missingSkinMessage: true,
  hotbar: {
    slots: 9,
    skills: [
      "Python",
      "AI",
      "Security",
      "Linux",
      "Docker",
      "Data",
      "Blog",
      "Wiki",
      "Research",
    ],
  },
  torsoUpright: true,
  shaftNormalDot,
  status: { health: 20, food: 20, hearts: 10, foodIcons: 10 },
  layout: "centered logical GUI with content-sized author tooltip",
  removedSignAndTextSlots: true,
};
await writeFile("tests/profile-results.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();

import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import ts from "typescript";
const transpile = (s) =>
  ts.transpileModule(s, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const url = (s) =>
  `data:text/javascript;base64,${Buffer.from(s).toString("base64")}`;
const configURL = url(
  transpile(await readFile("src/config/world-config.ts", "utf8")),
);
const { WorldCollision } = await import(
  url(
    transpile(await readFile("src/utils/world-collision.ts", "utf8")).replace(
      '"../config/world-config"',
      JSON.stringify(configURL),
    ),
  )
);
const c = new WorldCollision();
c.add({ minX: 0, maxX: 1, minZ: -5, maxZ: 5 });
assert.ok(
  c.move(-3, 0, 20, 0).x <= -0.29,
  "Large movement cannot tunnel through walls",
);
const slide = c.move(-0.31, 0, 1, 3);
assert.ok(slide.x < 0 && slide.z > 2.9, "Wall sliding remains possible");
assert.ok(c.blocked(49, 0), "Map boundaries are solid");
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
  await p.getByRole("button", { name: "MineWorld", exact: true }).click();
  const viewport = p.locator(".world-viewport");
  await p
    .locator(".world-viewport[data-ready=true]")
    .waitFor({ timeout: 20000 });
  const start = async () => {
    await p.getByRole("button", { name: "开始探索", exact: true }).click();
    await p.waitForTimeout(150);
  };
  await start();
  const pointerLock = await p.evaluate(
    () =>
      document.pointerLockElement ===
      document.querySelector(".world-viewport canvas"),
  );
  assert.ok(pointerLock, "Actual mouse pointer lock works");
  const sizes = [];
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await p.setViewportSize({ width, height });
    await p.waitForTimeout(200);
    const box = await viewport.boundingBox();
    assert.equal(box.width, width);
    assert.equal(box.height, height);
    await p.screenshot({
      path: `tests/screenshots/world-entrance-${width}x${height}.png`,
    });
    sizes.push({ width, height });
  }
  await p.setViewportSize({ width: 1366, height: 768 });
  const axis = async (axis, target) => {
    const current = Number(await viewport.getAttribute(`data-${axis}`));
    if (Math.abs(current - target) < 0.3) return;
    const positive = current < target;
    const key = axis === "x" ? (positive ? "d" : "a") : positive ? "s" : "w";
    await p.keyboard.down("Shift");
    await p.keyboard.down(key);
    try {
      await p.waitForFunction(
        ({ axis, target, positive, key }) => {
          const n = document.querySelector(".world-viewport");
          const v = Number(n?.dataset[axis]);
          const reached = positive ? v >= target - 0.15 : v <= target + 0.15;
          // Stop in the browser frame to avoid automation round-trip overshoot.
          if (reached) {
            window.dispatchEvent(
              new KeyboardEvent("keyup", { code: "Key" + key.toUpperCase() }),
            );
            window.dispatchEvent(
              new KeyboardEvent("keyup", { code: "ShiftLeft" }),
            );
          }
          return reached;
        },
        { axis, target, positive, key },
        { timeout: 30000 },
      );
    } catch (error) {
      console.log(
        "Movement stopped",
        axis,
        target,
        await viewport.evaluate((n) => ({ ...n.dataset })),
      );
      await p.screenshot({
        path: "tests/screenshots/world-movement-failure.png",
      });
      throw error;
    } finally {
      await p.keyboard.up(key);
      await p.keyboard.up("Shift");
    }
    await p.waitForTimeout(80);
  };
  const position = async () =>
    viewport.evaluate((n) => ({
      x: Number(n.dataset.x),
      z: Number(n.dataset.z),
      yaw: Number(n.dataset.yaw),
    }));
  await axis("z", 18);
  await p.screenshot({ path: "tests/screenshots/world-main-hall.png" });
  const cases = [];
  const enter = async (id, x, z, screen) => {
    await axis("x", 0);
    await axis("z", z);
    await axis("x", x);
    const button = p.getByRole("button", { name: `进入 ${id}`, exact: true });
    await button.waitFor();
    const before = await position();
    await p.keyboard.press("e");
    if (screen === "workshop") {
      await p
        .getByRole("button", { name: "关闭工作室介绍", exact: true })
        .waitFor();
      await p.screenshot({ path: "tests/screenshots/world-workshop.png" });
      await p
        .getByRole("button", { name: "关闭工作室介绍", exact: true })
        .click();
    } else {
      await p.waitForFunction(
        (screen) => document.querySelector(".game")?.dataset.screen === screen,
        screen,
      );
      await p.keyboard.press("Escape");
      await p
        .locator(".world-viewport[data-ready=true]")
        .waitFor({ timeout: 20000 });
    }
    await start();
    const after = await position();
    assert.ok(
      Math.abs(after.x - before.x) < 0.02 &&
        Math.abs(after.z - before.z) < 0.02,
      "Module return preserves position",
    );
    cases.push(id);
    console.log("Walked to and activated", id);
  };
  await enter("World Journal", 4, 17, "worlds");
  await enter("Knowledge Hall", -18, -13, "wiki");
  await p.screenshot({ path: "tests/screenshots/world-library.png" });
  await enter("Research Gallery", 18, -13, "realms");
  await p.screenshot({ path: "tests/screenshots/world-research.png" });
  await enter("Project Workshop", -18, 8, "workshop");
  await enter("Portal Room", 18, 8, "multiplayer");
  await p.screenshot({ path: "tests/screenshots/world-portal.png" });
  await enter("Status Chamber", 0, -30, "status");
  await p.screenshot({ path: "tests/screenshots/world-status.png" });
  // Aim at a closed wall outside the side doors and hold movement against it.
  await axis("z", -13);
  await axis("x", 0);
  await axis("z", 0);
  await p.keyboard.down("d");
  await p.waitForFunction(
    () => Number(document.querySelector(".world-viewport").dataset.x) > 11.05,
    null,
    { timeout: 30000 },
  );
  await p.waitForTimeout(500);
  await p.keyboard.up("d");
  assert.ok(
    (await position()).x < 11.25,
    "Player cannot pass through hall wall",
  );
  await p.keyboard.press("Escape");
  await p.getByRole("button", { name: "回到入口", exact: true }).click();
  await start();
  assert.ok((await position()).z > 44.5);
  const yawBefore = (await position()).yaw;
  await p.mouse.move(550, 340);
  await p.mouse.move(730, 380);
  await p.waitForTimeout(100);
  assert.notEqual(
    (await position()).yaw,
    yawBefore,
    "Mouse controls camera orientation",
  );
  await p.keyboard.press("Escape");
  await p.getByRole("button", { name: "返回主菜单", exact: true }).click();
  assert.equal(await p.locator(".game").getAttribute("data-screen"), "main");
  assert.equal(await viewport.count(), 0);
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  const drag = await browser.newPage({
    viewport: { width: 1366, height: 768 },
  });
  await drag.addInitScript(() => {
    HTMLCanvasElement.prototype.requestPointerLock = () =>
      Promise.reject(Error("Test denied pointer lock"));
  });
  await drag.goto("http://127.0.0.1:5173/");
  await drag.getByRole("button", { name: "MineWorld", exact: true }).click();
  await drag
    .locator(".world-viewport[data-ready=true]")
    .waitFor({ timeout: 20000 });
  await drag.getByRole("button", { name: "开始探索", exact: true }).click();
  await drag.mouse.move(600, 350);
  await drag.mouse.down();
  await drag.mouse.move(750, 400, { steps: 5 });
  await drag.mouse.up();
  await drag.waitForTimeout(100);
  assert.ok(
    Math.abs(
      Number(await drag.locator(".world-viewport").getAttribute("data-yaw")),
    ) > 0.1,
    "Drag look works when pointer lock is denied",
  );
  await drag.close();
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = new Proxy(
      HTMLCanvasElement.prototype.getContext,
      {
        apply(target, that, args) {
          return String(args[0]).startsWith("webgl")
            ? null
            : Reflect.apply(target, that, args);
        },
      },
    );
  });
  await fallback.goto("http://127.0.0.1:5173/");
  await fallback
    .getByRole("button", { name: "MineWorld", exact: true })
    .click();
  await fallback
    .getByRole("img", { name: "WebGL 不可用，无法进入三维展馆。", exact: true })
    .waitFor();
  await fallback
    .getByRole("button", { name: "返回主菜单", exact: true })
    .click();
  await writeFile(
    "tests/world-results.json",
    JSON.stringify(
      {
        sizes,
        pointerLock,
        cases,
        errors,
        failed,
        checks: [
          "collision unit checks",
          "actual walking through all five rooms plus Blog",
          "module return position",
          "mouse look",
          "pointer lock denied drag fallback",
          "wall collision",
          "reset and return",
          "WebGL unavailable feedback",
        ],
      },
      null,
      2,
    ),
  );
  console.log("MineWorld exploration and navigation checks passed.");
} finally {
  await browser.close();
}

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import {
  prepareMineWorldClient,
  clientName,
} from "../../scripts/prepare-mineworld-client.mjs";
const config = ts.transpileModule(
  await readFile("src/MineWorld/GameConfig.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext } },
).outputText;
const { readGameMessage } = await import(
  "data:text/javascript;base64," + Buffer.from(config).toString("base64")
);
const bridge = await readFile("public/vendor/classicube/bootstrap.js", "utf8");
async function boot(ok = true, contentType = "application/zip") {
  const messages = [],
    scripts = [];
  const canvas = {
    addEventListener() {},
    focus() {
      this.focused = true;
    },
  };
  const body = {
    dataset: {},
    appendChild(script) {
      scripts.push(script);
    },
  };
  const context = {
    document: {
      addEventListener() {},
      body,
      getElementById: (id) => (id === "canvas" ? canvas : { textContent: "" }),
      createElement: () => ({}),
    },
    location: {
      origin: "https://example.test",
      href: "https://example.test/vendor/classicube/index.html",
      search: "?username=YTC",
    },
    parent: { postMessage: (data, origin) => messages.push({ data, origin }) },
    innerWidth: 1366,
    innerHeight: 720,
    URL,
    URLSearchParams,
    console,
    requestAnimationFrame: (fn) => fn(),
    fetch: async () => ({ ok, headers: { get: () => contentType } }),
  };
  context.window = context;
  context.addEventListener = () => {};
  vm.runInNewContext(bridge, context);
  await new Promise((resolve) => setImmediate(resolve));
  return { context, messages, scripts, canvas, body };
}
test("messages reject malformed/unrecognised payloads", () => {
  for (const value of [
    null,
    {},
    "running",
    { type: "other", state: "running" },
    { type: "mineworld:state", state: "unknown" },
  ])
    assert.equal(readGameMessage(value), null);
  assert.equal(
    readGameMessage({ type: "mineworld:state", state: "running" }).state,
    "running",
  );
});
test("bridge waits for filesystem phase and keeps singleplayer arguments", async () => {
  const b = await boot();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.canvas.width, 1366);
  assert.deepEqual(Array.from(b.context.Module.arguments), ["YTC"]);
  b.context.Module.setStatus("");
  assert.notEqual(b.body.dataset.state, "running");
  b.context.Module.setStatus("Preloading filesystem.. (2/2)");
  b.context.Module.setStatus("");
  assert.equal(b.body.dataset.state, "running");
  assert.equal(b.canvas.focused, true);
  assert.equal(b.messages.at(-1).origin, "https://example.test");
});
test("missing textures and SPA HTML fallback block engine startup", async () => {
  for (const [ok, type] of [
    [false, "application/zip"],
    [true, "text/html"],
  ]) {
    const b = await boot(ok, type);
    assert.equal(b.scripts.length, 0);
    assert.equal(b.body.dataset.state, "error");
  }
});
test("binary server MIME and engine script failures are handled", async () => {
  const b = await boot(true, "application/octet-stream");
  assert.equal(b.scripts.length, 1);
  b.scripts[0].onerror();
  assert.equal(b.body.dataset.state, "error");
});

test("The actual pinned client cannot open either pause menu; inventory key handling is unchanged", async () => {
  const original = await readFile("public/vendor/classicube/ClassiCube.js");
  const source = original.toString("utf8"),
    adapted = prepareMineWorldClient(original);
  const fn = (text, name) =>
    text.slice(
      text.indexOf(`function ${name}(`),
      text.indexOf("\nfunction ", text.indexOf(`function ${name}(`) + 1),
    );
  const menu = fn(adapted, "_Gui_ShowPauseMenu");
  let shown = 0;
  vm.runInNewContext(menu + "; _Gui_ShowPauseMenu(); _Gui_ShowPauseMenu();", {
    _PauseScreen_Show: () => shown++,
    _ClassicPauseScreen_Show: () => shown++,
  });
  assert.equal(shown, 0);
  assert.ok(!fn(adapted, "_OnInputDown").includes("_Gui_ShowPauseMenu"));
  assert.ok(!fn(adapted, "_OnInputDown").includes("HEAP8[1869857] = 1"));
  for (const name of [
    "_OnInputUp",
    "_Input_SetPressed",
    "_Input_SetReleased",
    "_OnKeyDown_2921",
    "_InventoryScreen_Show",
    "_Gui_Remove",
  ])
    if (source.includes(`function ${name}(`))
      assert.equal(fn(adapted, name), fn(source, name), name);
  assert.ok(
    !bridge.includes('"keydown"'),
    "Do not intercept Escape: inventory needs its native keydown/up pair",
  );
});

test("The pause adapter fails closed on an upgraded or altered vendor client", () => {
  assert.throws(
    () => prepareMineWorldClient(Buffer.from("unrecognised client")),
    /Unsupported ClassiCube/,
  );
});

test("The loader starts the adapted client and its reproducible build exists", async () => {
  const b = await boot();
  assert.ok(b.scripts[0].src.endsWith("/" + clientName));
  const bytes = await readFile("public/vendor/classicube/ClassiCube.js");
  assert.equal(
    await readFile("public/vendor/classicube/" + clientName, "utf8"),
    prepareMineWorldClient(bytes),
  );
});

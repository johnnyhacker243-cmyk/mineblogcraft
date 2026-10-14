import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
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

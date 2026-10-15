import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = await readFile(
  new URL("../src/services/PDFRepository.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { openPDFSources } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);

test("An unreachable external host cannot break a verified local PDF", async () => {
  const requested = [];
  const handle = openPDFSources(["local.pdf", "remote.pdf"], (url) => {
    requested.push(url);
    return {
      promise:
        url === "local.pdf"
          ? Promise.resolve({ numPages: 13 })
          : Promise.reject(Error("network unavailable")),
      destroy: async () => {},
    };
  });
  assert.equal((await handle.document).numPages, 13);
  assert.deepEqual(requested, ["local.pdf"]);
  await handle.destroy();
});
test("A missing local copy falls back to the source after cleaning up", async () => {
  const events = [];
  const handle = openPDFSources(["missing.pdf", "remote.pdf"], (url) => ({
    promise:
      url === "missing.pdf"
        ? Promise.reject(Error("404"))
        : Promise.resolve({ numPages: 6 }),
    destroy: async () => {
      events.push(url);
    },
  }));
  assert.equal((await handle.document).numPages, 6);
  assert.deepEqual(events, ["missing.pdf"]);
  await handle.destroy();
  assert.deepEqual(events, ["missing.pdf", "remote.pdf"]);
});
test("Leaving the reader cancels loading without starting another source", async () => {
  let reject,
    requests = 0;
  const handle = openPDFSources(["local.pdf", "remote.pdf"], () => {
    requests++;
    return {
      promise: new Promise((_, r) => {
        reject = r;
      }),
      destroy: async () => {
        reject(Error("cancelled"));
      },
    };
  });
  const rejected = assert.rejects(handle.document);
  await handle.destroy();
  await rejected;
  assert.equal(requests, 1);
});

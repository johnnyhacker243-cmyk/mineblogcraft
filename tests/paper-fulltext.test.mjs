import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const read = async (path) =>
  JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const papers = await read("../src/data/papers.json");
const catalog = await read("../public/papers/fulltext-catalog.json");
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
const { trustedPDFUrl } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);

test("Every external paper opens complete original content rather than a reading guide", () => {
  const external = papers.filter((p) => p.origin === "external");
  assert.equal(external.length, 33);
  for (const paper of external) {
    assert.equal(paper.readingMode, "fulltext", paper.id);
    if (paper.format === "pdf") {
      const audit = catalog.find((entry) => entry.id === paper.id);
      assert.ok(audit, paper.id);
      assert.equal(paper.pdf.pageCount, audit.pageCount);
      assert.equal(paper.pdf.sha256, audit.sha256);
      assert.equal(paper.content, "");
      assert.ok(
        audit.lastPageTextCharacters > 0,
        "Original last page must be readable",
      );
    } else {
      assert.equal(paper.format, "document");
      assert.ok(paper.content.endsWith(".json"));
    }
  }
});

test("Original PDF sources reject active URLs, credentials and arbitrary mirrors", () => {
  const origin = "http://127.0.0.1:5173";
  for (const entry of catalog)
    assert.equal(trustedPDFUrl(entry.url, origin), new URL(entry.url).href);
  for (const url of [
    "javascript:alert(1)",
    "https://evil.test/paper.pdf",
    "https://user:pass@arxiv.org/pdf/a",
    "https://arxiv.org:9000/a.pdf",
    "https://arxiv.org/pdf/a#action",
    "https://raw.githubusercontent.com/unknown/repo/main/a.pdf",
    "/papers/../../private.pdf",
  ]) {
    assert.throws(() => trustedPDFUrl(url, origin), url);
  }
});

test("Verified public archive copies exactly match the canonical original PDF", () => {
  for (const entry of catalog.filter((entry) => entry.canonicalPDFUrl)) {
    assert.equal(entry.sha256, entry.canonicalSHA256, entry.id);
    assert.match(new URL(entry.url).pathname.split("/")[3], /^[a-f0-9]{40}$/);
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
async function service(path, name) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return new (
    await import(
      "data:text/javascript;base64," + Buffer.from(js).toString("base64")
    )
  )[name]();
}
const wiki = JSON.parse(
  await readFile(new URL("../src/data/wiki.json", import.meta.url), "utf8"),
);
const papers = JSON.parse(
  await readFile(new URL("../src/data/papers.json", import.meta.url), "utf8"),
);
const wikiSearch = await service(
  "../src/services/WikiSearchService.ts",
  "LocalWikiSearchService",
);
const paperSearch = await service(
  "../src/services/PaperSearchService.ts",
  "LocalPaperSearchService",
);
test("Knowledge names, Chinese aliases, partial terms and typos rank concepts", () => {
  for (const [query, id] of [
    ["RAG", "rag"],
    ["检索增强生成", "rag"],
    ["工具调用", "tool-calling"],
    ["nmap", "nmap"],
    ["agnte", "agent"],
  ])
    assert.equal(wikiSearch.search(query, wiki)[0]?.node.id, id, query);
  assert.equal(wikiSearch.search("zzzzzzzzzzzz", wiki).length, 0);
});
test("External-paper authors remain searchable and domain aliases include relevant papers", () => {
  assert.equal(
    paperSearch.search("Ashish Vaswani", papers)[0]?.paper.id,
    "arxiv-1706.03762",
  );
  assert.equal(paperSearch.search("YTC", papers)[0]?.paper.id, "001");
  assert.ok(
    paperSearch.search("软件工程", papers).some((r) => r.paper.id === "raft"),
  );
  assert.ok(
    paperSearch
      .search("网络安全", papers)
      .some((r) => r.paper.id === "nids-fgpa"),
  );
});

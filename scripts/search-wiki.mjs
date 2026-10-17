// Local, evidence-only retrieval. No model, remote requests or execution of content.
import { readFile } from "node:fs/promises";
import ts from "typescript";
const query = process.argv.slice(2).join(" ").trim();
const nodes = JSON.parse(await readFile("src/data/wiki.json", "utf8"));
const js = ts.transpileModule(
  await readFile("src/services/WikiSearchService.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { LocalWikiSearchService } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
const matches = new LocalWikiSearchService()
  .search(query, nodes)
  .filter((r) => r.score > 0)
  .slice(0, 5);
console.log(
  JSON.stringify(
    matches.length
      ? {
          question: query,
          mode: "evidence-only",
          sources: matches.map(({ node, score }, i) => ({
            label: `SOURCE ${i + 1}`,
            id: node.id,
            title: node.title,
            file: node.file,
            updated: node.updated,
            score,
            sections: node.sections,
            sources: node.sources,
          })),
        }
      : { question: query, message: "当前 Wiki 中没有足够依据" },
    null,
    2,
  ),
);

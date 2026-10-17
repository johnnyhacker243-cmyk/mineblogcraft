import { readFile, writeFile } from "node:fs/promises";
const papers = JSON.parse(await readFile("src/data/papers.json", "utf8"));
const catalog = JSON.parse(
  await readFile("public/papers/fulltext-catalog.json", "utf8"),
);
const registry = JSON.parse(
  await readFile("config/paperFulltextSources.json", "utf8"),
);
if (
  catalog.length !== registry.length ||
  registry.some(
    (source) =>
      !catalog.some(
        (record) => record.id === source.id && record.url === source.url,
      ),
  )
)
  throw Error("Incomplete source audit");
for (const record of catalog) {
  const paper = papers.find((p) => p.id === record.id);
  if (!paper) throw Error("Unknown paper");
  paper.noteContent = paper.noteContent || paper.content;
  paper.content = "";
  paper.format = "pdf";
  paper.readingMode = "fulltext";
  paper.pdf = {
    url: record.hostedUrl ?? record.url,
    delivery: record.delivery,
    pageCount: record.pageCount,
    verifiedAt: record.verifiedAt,
    sha256: record.sha256,
  };
  if (record.licenseUrl.includes("creativecommons.org")) {
    paper.license =
      "CC " +
      record.licenseUrl
        .split("/licenses/")[1]
        .replace(/\/$/, "")
        .replaceAll("/", " ")
        .toUpperCase();
    paper.licenseUrl = record.licenseUrl;
  } else if (record.licenseUrl.includes("arxiv.org/licenses/")) {
    paper.license = "arXiv source license";
    paper.licenseUrl = record.licenseUrl;
  }
}
await writeFile("src/data/papers.json", JSON.stringify(papers, null, 2) + "\n");
console.log(
  "Activated " +
    catalog.length +
    " complete PDFs; other existing documents preserved",
);

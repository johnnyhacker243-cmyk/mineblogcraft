import { readFile, writeFile } from "node:fs/promises";
const read = async (path) => JSON.parse(await readFile(path, "utf8"));
const selection = await read("config/researchSelection.json");
const old = await read("src/data/papers.json");
const nids = old.find((p) => p.id === "nids-fgpa");
nids.tags = ["联邦学习", "入侵检测", "隐私保护"];
nids.publicationStatus = "published";
const categories = {
  ai: "AI",
  security: "Cyber Security",
  software: "Software Engineering",
};
const papers = selection.map((p) => ({
  id: p.id,
  title: p.title,
  author: p.authors.join(", "),
  authors: p.authors,
  year: p.publishedAt.slice(0, 4),
  publishedAt: p.publishedAt,
  updatedAt: p.updatedAt,
  description: p.description + " · 预印本",
  category: categories[p.domainId],
  domainId: p.domainId,
  crossDomainIds: [],
  keywords: p.tags,
  tags: p.tags,
  cover: "/assets/inventory/enchanted-book.png",
  content: "",
  abstract: p.abstract,
  draft: false,
  format: "pdf",
  sourceUrl: p.sourceUrl,
  license: p.licenseUrl.includes("by-sa") ? "CC BY-SA 4.0" : "CC BY 4.0",
  licenseUrl: p.licenseUrl,
  language: "English",
  origin: "external",
  readingMode: "fulltext",
  publicationStatus: p.publicationStatus,
  arxivVersion: p.arxivVersion,
  verificationStatus: "verified-original",
  metadataCheckedAt: p.metadataCheckedAt,
}));
papers.push(nids);
papers.sort(
  (a, b) =>
    (b.publishedAt ?? b.year).localeCompare(a.publishedAt ?? a.year) ||
    a.id.localeCompare(b.id),
);
await writeFile("src/data/papers.json", JSON.stringify(papers, null, 2) + "\n");
const wiki = await read("src/data/wiki.json");
for (const node of wiki) {
  node.relatedPapers = papers
    .filter((p) =>
      p.id === "nids-fgpa"
        ? ["machine-learning", "ai-security", "intrusion-detection"].includes(
            node.id,
          )
        : selection.find((s) => s.id === p.id)?.wikiNodeIds.includes(node.id),
    )
    .slice(0, 5)
    .map((p) => ({ id: p.id, title: p.title }));
}
await writeFile("src/data/wiki.json", JSON.stringify(wiki, null, 2) + "\n");
console.log(
  "Applied balanced recent catalog and concept-specific Wiki references.",
);

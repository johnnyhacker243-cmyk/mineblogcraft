import type { ResearchPaper } from "../models/ResearchPaper";
export interface PaperMatch {
  paper: ResearchPaper;
  score: number;
}
export interface PaperSearch {
  search(query: string, papers: ResearchPaper[]): PaperMatch[];
}
const normalize = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const aliases: Record<string, string[]> = {
  "mathematical modeling": ["数学建模", "建模"],
  "cyber security": ["网络安全", "安全"],
  security: ["网络安全", "安全"],
  ai: ["人工智能"],
  "data mining": ["数据挖掘"],
  "software engineering": ["软件工程"],
  software: ["软件工程"],
  agent: ["智能体"],
};
function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const next = [i + 1];
    for (let j = 0; j < b.length; j++)
      next.push(
        Math.min(next[j] + 1, row[j + 1] + 1, row[j] + Number(a[i] !== b[j])),
      );
    row = next;
  }
  return row[b.length];
}
function strength(query: string, field: string) {
  if (field === query) return 1;
  if (field.includes(query)) return 0.85;
  const limit = query.length < 5 ? 1 : 2;
  if (query.length < 3) return 0;
  // Sliding windows also handle unsegmented Chinese words and partial phrases.
  for (
    let length = Math.max(2, query.length - limit);
    length <= query.length + limit;
    length++
  ) {
    for (let start = 0; start + length <= field.length; start++) {
      const d = distance(query, field.slice(start, start + length));
      if (d <= limit) return 0.35 * (1 - d / query.length);
    }
  }
  return 0;
}
export class LocalPaperSearchService implements PaperSearch {
  private cache = new WeakMap<
    ResearchPaper[],
    { paper: ResearchPaper; fields: [string, number][] }[]
  >();
  search(query: string, papers: ResearchPaper[]): PaperMatch[] {
    const terms = normalize(query).slice(0, 100).split(/\s+/).filter(Boolean);
    if (!terms.length) return papers.map((paper) => ({ paper, score: 0 }));
    let index = this.cache.get(papers);
    if (!index) {
      index = papers.map((paper) => {
        const categories = [
          paper.category,
          ...paper.keywords,
          ...(paper.tags ?? []),
        ];
        const expanded = categories.flatMap((value) =>
          Object.entries(aliases)
            .filter(([key]) => normalize(value).includes(key))
            .flatMap(([, words]) => words),
        );
        return {
          paper,
          fields: [
            [normalize(paper.title), 100],
            [normalize([...categories, ...expanded].join(" ")), 65],
            [normalize(paper.author), 55],
            [normalize(paper.description), 30],
          ] as [string, number][],
        };
      });
      this.cache.set(papers, index);
    }
    return index
      .map(({ paper, fields }) => {
        const scores = terms.map((term) =>
          Math.max(
            ...fields.map(([field, weight]) => strength(term, field) * weight),
          ),
        );
        return {
          paper,
          score: scores.every((score) => score > 0)
            ? scores.reduce((a, b) => a + b, 0)
            : 0,
        };
      })
      .filter((result) => result.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score || a.paper.title.localeCompare(b.paper.title),
      );
  }
}
export const paperSearchService: PaperSearch = new LocalPaperSearchService();

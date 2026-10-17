import type { WikiNodeData, WikiMatch } from "../models/WikiNode";
export interface WikiSearch {
  search(query: string, nodes: WikiNodeData[]): WikiMatch[];
}
const norm = (s: string) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
function edits(a: string, b: string) {
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
function match(q: string, text: string) {
  if (text === q) return 1;
  if (
    text.includes(q) &&
    (!/^[a-z0-9 ]+$/.test(q) || text.startsWith(q) || text.includes(" " + q))
  )
    return 0.9;
  if (text.length > 2000) return 0;
  if (q.length < 3) return 0;
  const limit = q.length < 5 ? 1 : 2;
  for (const word of text.split(/\s+/)) {
    if (Math.abs(word.length - q.length) <= limit && edits(q, word) <= limit)
      return 0.35;
  }
  if (/[\u3400-\u9fff]/.test(q))
    for (let i = 0; i + q.length <= text.length; i++)
      if (edits(q, text.slice(i, i + q.length)) <= 1) return 0.3;
  return 0;
}
export class LocalWikiSearchService implements WikiSearch {
  private cache = new WeakMap<
    WikiNodeData[],
    { node: WikiNodeData; fields: [string, number][] }[]
  >();
  search(query: string, nodes: WikiNodeData[]) {
    const terms = norm(query).slice(0, 100).split(/\s+/).filter(Boolean);
    if (!terms.length) return nodes.map((node) => ({ node, score: 0 }));
    let index = this.cache.get(nodes);
    if (!index) {
      index = nodes.map((node) => ({
        node,
        fields: [
          [norm(node.id), 140],
          ...[node.title, ...(node.aliases ?? [])].map(
            (value) => [norm(value), 100] as [string, number],
          ),
          [norm([node.title, ...(node.aliases ?? [])].join(" ")), 100],
          [norm([...node.tags, node.category].join(" ")), 65],
          [norm(node.description), 30],
          [
            norm(
              [
                node.details,
                ...(node.sections ?? []).map((s) => s.text),
                ...(node.sources ?? []).map((s) => s.title + " " + s.excerpt),
              ].join(" "),
            ),
            10,
          ],
          [
            norm(
              [...node.relatedBlogs, ...node.relatedPapers]
                .map((r) => r.title)
                .join(" "),
            ),
            20,
          ],
        ] as [string, number][],
      }));
      this.cache.set(nodes, index);
    }
    return index
      .map(({ node, fields }) => {
        const scores = terms.map((q) =>
          Math.max(...fields.map(([text, w]) => match(q, text) * w)),
        );
        return {
          node,
          score: scores.every((s) => s > 0)
            ? scores.reduce((a, b) => a + b, 0)
            : 0,
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.node.id.localeCompare(b.node.id));
  }
}
export const wikiSearchService: WikiSearch = new LocalWikiSearchService();

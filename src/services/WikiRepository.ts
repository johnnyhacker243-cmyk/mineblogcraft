import blogs from "../data/blogs.json";
import papers from "../data/papers.json";
import sources from "../../config/rssSources.json";
import type { WikiNodeData } from "../models/WikiNode";
export interface WikiRepository {
  getAllNodes(signal?: AbortSignal): Promise<WikiNodeData[]>;
}
export class StaticWikiRepository implements WikiRepository {
  async getAllNodes(signal?: AbortSignal) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const { default: data } = await import("../data/wiki.json");
    signal?.throwIfAborted();
    const nodes = structuredClone(data) as WikiNodeData[];
    const blogTitles = new Map(blogs.map((b) => [b.id, b.title]));
    const paperTitles = new Map(papers.map((p) => [p.id, p.title]));
    const sourceTitles = new Map(sources.map((s) => [s.id, s.name]));
    for (const node of nodes) {
      node.relatedBlogs = node.relatedBlogs.map((r) => ({
        id: r.id,
        title: blogTitles.get(r.id) ?? r.title,
      }));
      node.relatedPapers = node.relatedPapers.map((r) => ({
        id: r.id,
        title: paperTitles.get(r.id) ?? r.title,
      }));
      node.relatedSources = (node.relatedRss ?? [])
        .filter((id) => sourceTitles.has(id))
        .map((id) => ({ id, title: sourceTitles.get(id)! }));
    }
    const ids = new Set(nodes.map((n) => n.id));
    if (
      ids.size !== nodes.length ||
      nodes.some(
        (n) =>
          !Number.isFinite(n.x) ||
          !Number.isFinite(n.y) ||
          n.parentIds.some((id) => !ids.has(id)),
      )
    )
      throw Error("Invalid knowledge tree");
    return nodes;
  }
}
export const wikiRepository: WikiRepository = new StaticWikiRepository();

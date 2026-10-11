import data from "../data/wiki.json";
import type { WikiNodeData } from "../models/WikiNode";
export interface WikiRepository {
  getAllNodes(signal?: AbortSignal): Promise<WikiNodeData[]>;
}
export class StaticWikiRepository implements WikiRepository {
  async getAllNodes(signal?: AbortSignal) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const nodes = structuredClone(data) as WikiNodeData[];
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

import { wikiRepository } from "./WikiRepository";
import { wikiSearchService } from "./WikiSearchService";

export interface KnowledgeSnippet {
  id: string;
  title: string;
  text: string;
  sourceType: "wiki";
  relatedBlogIds: string[];
  relatedPaperIds: string[];
  score: number;
}
// Stable, evidence-only boundary for a future RAG adapter. No model or Prompt
// execution: this method retrieves existing content and preserves its IDs.
export async function retrieveKnowledge(
  query: string,
  limit = 5,
  signal?: AbortSignal,
): Promise<KnowledgeSnippet[]> {
  if (!query.trim()) return [];
  const nodes = await wikiRepository.getAllNodes(signal);
  return wikiSearchService
    .search(query, nodes)
    .slice(0, Math.min(20, Math.max(0, limit)))
    .map(({ node, score }) => ({
      id: node.id,
      title: node.title,
      text: node.details,
      sourceType: "wiki",
      relatedBlogIds: node.relatedBlogs.map((r) => r.id),
      relatedPaperIds: node.relatedPapers.map((r) => r.id),
      score,
    }));
}

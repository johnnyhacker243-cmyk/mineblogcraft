import data from "../data/papers.json";
import type { ResearchPaper } from "../models/ResearchPaper";
export interface PaperRepository {
  getPapers(signal?: AbortSignal): Promise<ResearchPaper[]>;
  getContent(paper: ResearchPaper, signal?: AbortSignal): Promise<string>;
}
export class StaticPaperRepository implements PaperRepository {
  async getPapers() {
    return data.map((paper) => ({ ...paper, keywords: [...paper.keywords] }));
  }
  async getContent(paper: ResearchPaper, signal?: AbortSignal) {
    const response = await fetch(paper.content, { signal });
    if (!response.ok) throw new Error("Paper content unavailable");
    return response.text();
  }
}
export const paperRepository: PaperRepository = new StaticPaperRepository();

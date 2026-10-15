import data from "../data/papers.json";
import type { ResearchPaper } from "../models/ResearchPaper";
export interface PaperRepository {
  getPapers(signal?: AbortSignal): Promise<ResearchPaper[]>;
  getContent(paper: ResearchPaper, signal?: AbortSignal): Promise<string>;
}
export class StaticPaperRepository implements PaperRepository {
  async getPapers() {
    return data.map((paper) => ({
      ...paper,
      keywords: [...paper.keywords],
      format: paper.format,
    })) as ResearchPaper[];
  }
  async getContent(paper: ResearchPaper, signal?: AbortSignal) {
    if (paper.format === "pdf")
      throw Error("Original PDF pages are loaded through PDFRepository");
    if (paper.readingMode === "metadata" || !paper.content)
      return "# 阅读说明\n本站仅提供书目信息。没有可展示全文，请通过下方 Original / DOI 链接阅读原始文献。";
    const response = await fetch(paper.content, { signal });
    if (!response.ok) throw new Error("Paper content unavailable");
    return response.text();
  }
}
export const paperRepository: PaperRepository = new StaticPaperRepository();

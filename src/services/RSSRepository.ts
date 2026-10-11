import data from "../data/rssSources.json";
import type { RSSServer, RSSArticle, RSSQuery } from "../models/RSSServer";
export interface RSSRepository {
  getSources(signal?: AbortSignal): Promise<RSSServer[]>;
  getLatest(signal?: AbortSignal): Promise<RSSArticle[]>;
}
export class StaticRSSRepository implements RSSRepository {
  async getSources(): Promise<RSSServer[]> {
    return data.map((source) => ({
      ...source,
      status: source.status as RSSServer["status"],
      tags: [...source.tags],
    }));
  }
  async getLatest(): Promise<RSSArticle[]> {
    return [];
  }
}
export class RSSService {
  constructor(private repository: RSSRepository) {}
  async getSources(query: RSSQuery = {}, signal?: AbortSignal) {
    const sources = await this.repository.getSources(signal);
    const terms = (query.search ?? "")
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    return sources.filter(
      (source) =>
        (!query.category || source.category === query.category) &&
        terms.every((term) =>
          [source.name, source.description, source.category, ...source.tags]
            .join(" ")
            .toLocaleLowerCase()
            .includes(term),
        ),
    );
  }
  getLatest(signal?: AbortSignal) {
    return this.repository.getLatest(signal);
  }
}
export const rssService = new RSSService(new StaticRSSRepository());

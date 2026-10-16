import type { RSSServer, RSSArticle, RSSQuery } from "../models/RSSServer";
export interface RSSRepository {
  getSources(signal?: AbortSignal): Promise<RSSServer[]>;
  getLatest(signal?: AbortSignal): Promise<RSSArticle[]>;
}
export class StaticRSSRepository implements RSSRepository {
  async getSources(signal?: AbortSignal): Promise<RSSServer[]> {
    const response = await fetch("/data/rss/sources.json", { signal });
    if (!response.ok) throw Error("Sources unavailable");
    const data = await response.json();
    return data.map((source: RSSServer & { iconKey: string }) => ({
      ...source,
      icon: source.iconKey,
      category: source.domainId,
      sourceUrl: source.siteUrl,
      lastUpdate: (source.latestPublishedAt ?? "").slice(0, 10),
      tags: [...source.tags],
    }));
  }
  async getLatest(signal?: AbortSignal): Promise<RSSArticle[]> {
    const response = await fetch("/data/rss/items.json", { signal });
    if (!response.ok) throw Error("Articles unavailable");
    return response.json();
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

export interface RSSServer {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  lastUpdate: string;
  status: "online" | "offline";
}
export interface RSSArticle {
  id: string;
  sourceId: string;
  title: string;
  url: string;
  publishedAt: string;
}
export interface RSSQuery {
  search?: string;
  category?: string;
}

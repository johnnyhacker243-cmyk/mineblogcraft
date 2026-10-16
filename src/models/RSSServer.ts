export interface RSSServer {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  lastUpdate: string;
  status: "online" | "offline" | "stale" | "cached" | "unverified";
  domainId: string;
  feedUrl: string;
  siteUrl: string;
  lastCheckedAt: string | null;
  lastSuccessAt: string | null;
  verificationStatus: string;
  error?: string | null;
  latestPublishedAt?: string | null;
  articleAccess?: {
    checkedAt: string;
    scope: "current-network-sample";
    regionalStatus: "not-region-tested";
    status: "reachable" | "partial" | "failed" | "unknown";
    sampled: number;
    passed: number;
  };
}
export interface RSSArticle {
  id: string;
  sourceId: string;
  title: string;
  link: string;
  description: string;
  author: string;
  publishedAt: string | null;
  fetchedAt: string;
  domainId: string;
}
export interface RSSQuery {
  search?: string;
  category?: string;
}

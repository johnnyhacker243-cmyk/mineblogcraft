export interface BlogWorld {
  id: string;
  title: string;
  image: string;
  createTime: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  file?: string;
  domainId?: string;
  status?: "draft" | "published";
  reviewStatus?: "reviewed";
  reviewedAt?: string;
  publishedAt?: string;
  author?: string;
  provenance?: string;
  updatedAt?: string;
  dateMeaning?: "editorial-series";
  seriesIndex?: number;
  iconKey?: string;
  iconLabel?: string;
  iconReason?: string;
  sources?: {
    title: string;
    url: string;
    publishedAt?: string;
    checkedAt?: string;
  }[];
}

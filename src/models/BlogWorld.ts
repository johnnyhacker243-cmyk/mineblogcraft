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
  author?: string;
  provenance?: string;
  sources?: { title: string; url: string }[];
}

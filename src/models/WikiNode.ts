export type WikiCategory = "AI" | "Security" | "Software" | "Modeling";
export interface WikiNodeData {
  id: string;
  title: string;
  description: string;
  category: WikiCategory;
  tags: string[];
  icon: string;
  x: number;
  y: number;
  parentIds: string[];
  status: "untracked" | "completed" | "planned";
  frame: "task" | "goal" | "challenge";
  details: string;
  learningPoints: string[];
  relatedBlogs: { id: string; title: string }[];
  relatedPapers: { id: string; title: string }[];
  aliases?: string[];
  domainId?: string;
  relatedRss?: string[];
  relatedSources?: { id: string; title: string }[];
  updated: string;
  provenance: string;
  file: string;
  body: string;
  iconKey: string;
  iconLabel: string;
  iconReason: string;
  sections: { title: string; text: string }[];
  sources: {
    id: string;
    kind: string;
    title: string;
    url: string;
    locator: string;
    excerpt: string;
    sourceId?: string;
  }[];
  relatedNodes: { id: string; title: string }[];
  backlinks: { id: string; title: string }[];
}
export interface WikiMatch {
  node: WikiNodeData;
  score: number;
}

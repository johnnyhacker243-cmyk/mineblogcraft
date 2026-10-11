export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  year: string;
  description: string;
  category: string;
  keywords: string[];
  cover: string;
  content: string;
  abstract: string;
  draft: boolean;
}
export type BookBlock =
  | { kind: "text"; text: string; heading?: boolean }
  | { kind: "image"; src: string; alt: string };
export type BookPage = BookBlock[];

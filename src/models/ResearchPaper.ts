export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  year: string;
  description: string;
  category: string;
  keywords: string[];
  tags?: string[];
  cover: string;
  content: string;
  abstract: string;
  draft: boolean;
  format?: "document" | "pdf";
  pdf?: {
    url: string;
    delivery: "canvas";
    pageCount: number;
    verifiedAt: string;
    sha256: string;
  };
  sourceUrl?: string;
  doi?: string;
  license?: string;
  licenseUrl?: string;
  language?: string;
  domainId?: string;
  authors?: string[];
  origin?: "external" | "example" | "original";
  readingMode?: "metadata" | "note" | "fulltext";
  verificationStatus?: string;
  publishedAt?: string;
  updatedAt?: string;
  publicationStatus?: "preprint" | "published";
  arxivVersion?: string;
  metadataCheckedAt?: string;
}
export type BookBlock =
  | { kind: "text"; text: string; heading?: boolean }
  | {
      kind: "image";
      src: string;
      alt: string;
      height?: number;
      caption?: string;
    }
  | { kind: "rich"; runs: PaperRun[]; heading?: boolean };
export type PaperRun =
  | { text: string }
  | { src: string; width: number; height: number; alt: string };
export interface PaperDocument {
  version: 1;
  blocks: (
    | { kind: "paragraph"; runs: PaperRun[]; heading?: boolean }
    | {
        kind: "image";
        src: string;
        width: number;
        height: number;
        alt: string;
        caption?: string;
        label?: string;
      }
  )[];
}
export type BookPage = BookBlock[];

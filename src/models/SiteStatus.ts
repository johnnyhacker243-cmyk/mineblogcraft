export interface SiteStatus {
  mode: "build-report";
  builtAt: string;
  commit: string;
  runId: string;
  version: string;
  counts: {
    pages: number;
    blogs: number;
    papers: number;
    wiki: number;
    feeds: number;
    entries: number;
  };
  modules: { name: string; count: number }[];
  checks: { name: string; result: "passed" }[];
}

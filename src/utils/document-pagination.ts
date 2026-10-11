import type {
  BookPage,
  BookBlock,
  PaperDocument,
  PaperRun,
  ResearchPaper,
} from "../models/ResearchPaper";
import { bookMetrics } from "./book-pagination";
export const readerMetrics = {
  pageWidth: 190,
  spreadWidth: 380,
  pageHeight: 180,
  textWidth: 150,
  fontSize: 5,
  lineHeight: 8,
};
function wrapRuns(runs: PaperRun[], heading = false): BookBlock[] {
  const output: BookBlock[] = [];
  let line: PaperRun[] = [],
    width = 0;
  const flush = () => {
    if (line.length) {
      output.push({ kind: "rich", runs: line, heading });
      line = [];
      width = 0;
    }
  };
  const canvas = document.createElement("canvas"),
    context = canvas.getContext("2d")!;
  context.font = `${readerMetrics.fontSize}px Monocraft, monospace`;
  for (const run of runs) {
    const parts =
      "text" in run ? (run.text.match(/\S+\s*|\s+/gu) ?? []) : [run];
    for (const part of parts) {
      if (typeof part !== "string") {
        const h = 5.8,
          w = Math.min(readerMetrics.textWidth, (part.width / part.height) * h);
        if (width + w > readerMetrics.textWidth) flush();
        line.push({ ...part, width: w, height: h });
        width += w;
        continue;
      }
      // Split only genuinely oversized words; normal English words stay intact.
      let token = part;
      while (token) {
        if (!line.length) token = token.trimStart();
        if (!token) break;
        let size = context.measureText(token).width;
        if (size <= readerMetrics.textWidth) {
          if (width + size > readerMetrics.textWidth) flush();
          line.push({ text: token });
          width += size;
          break;
        }
        let prefix = "";
        for (const c of token) {
          if (
            context.measureText(prefix + c).width >
            readerMetrics.textWidth - width
          )
            break;
          prefix += c;
        }
        if (!prefix) {
          flush();
          continue;
        }
        line.push({ text: prefix });
        width += context.measureText(prefix).width;
        token = token.slice(prefix.length);
        flush();
      }
    }
  }
  flush();
  return output;
}
export function documentBookPages(
  paper: ResearchPaper,
  doc: PaperDocument,
): BookPage[] {
  const pages: BookPage[] = [];
  let page: BookPage = [],
    used = 0;
  const flush = () => {
    if (page.length) pages.push(page);
    page = [];
    used = 0;
  };
  const add = (block: BookBlock, cost = 1) => {
    if (used + cost > bookMetrics.linesPerPage) flush();
    page.push(block);
    used += cost;
  };
  const information = [
    paper.title,
    "",
    `Authors: ${paper.author}`,
    `Year: ${paper.year}`,
    paper.category,
    "",
    paper.license ?? "",
    paper.doi ?? "",
    "Original English text / figures",
    "Reformatted for MineResearch",
  ];
  for (const [index, text] of information.entries()) {
    if (!text) add({ kind: "text", text: "" });
    else for (const line of wrapRuns([{ text }], index === 0)) add(line);
  }
  flush();
  for (const block of doc.blocks) {
    if (block.kind === "image") {
      flush();
      const height = Math.min(
        128,
        (readerMetrics.textWidth * block.height) / block.width,
      );
      add(
        {
          kind: "image",
          src: block.src,
          alt: block.alt,
          height,
          caption: block.label,
        },
        Math.ceil((height + 8) / readerMetrics.lineHeight),
      );
      for (const line of wrapRuns([
        { text: [block.label, block.caption].filter(Boolean).join(". ") },
      ]))
        add(line);
      flush();
    } else {
      const lines = wrapRuns(block.runs, block.heading);
      if (
        block.heading &&
        used + Math.min(lines.length + 2, bookMetrics.linesPerPage) >
          bookMetrics.linesPerPage
      )
        flush();
      for (const line of lines) add(line);
      if (used < bookMetrics.linesPerPage) add({ kind: "text", text: "" });
    }
  }
  flush();
  if (pages.length % 2) pages.push([]);
  return pages;
}

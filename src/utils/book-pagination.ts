import type {
  BookBlock,
  BookPage,
  ResearchPaper,
} from "../models/ResearchPaper";
export const bookMetrics = { lineWidth: 240, linesPerPage: 19, lineHeight: 8 };
export function wrapBookText(
  text: string,
  width = bookMetrics.lineWidth,
): string[] {
  const lines: string[] = [];
  let line = "",
    length = 0;
  for (const c of text) {
    const advance = c.charCodeAt(0) < 128 ? 4 : 8;
    if (length + advance > width && line) {
      const space = line.lastIndexOf(" ");
      if (/^[A-Za-z0-9]$/.test(c) && space > line.length / 2) {
        lines.push(line.slice(0, space));
        line = line.slice(space + 1);
        length = [...line].reduce(
          (n, char) => n + (char.charCodeAt(0) < 128 ? 4 : 8),
          0,
        );
      } else {
        lines.push(line);
        line = "";
        length = 0;
      }
    }
    line += c;
    length += advance;
  }
  lines.push(line);
  if (lines.length > 1 && [...line].length === 1 && line.charCodeAt(0) >= 128) {
    const previous = [...lines[lines.length - 2]];
    const last = previous.pop();
    if (last) {
      lines[lines.length - 2] = previous.join("");
      lines[lines.length - 1] = last + line;
    }
  }
  return lines;
}
export function paginateBook(markdown: string): BookPage[] {
  const pages: BookPage[] = [];
  let page: BookPage = [],
    used = 0;
  const add = (block: BookBlock, cost: number) => {
    if (used + cost > bookMetrics.linesPerPage) {
      pages.push(page);
      page = [];
      used = 0;
    }
    page.push(block);
    used += cost;
  };
  for (const paragraph of markdown.replaceAll("\r", "").split("\n")) {
    const image = paragraph.match(/^!\[([^\]]*)\]\((\/[^\s)]+)\)$/);
    if (image) {
      add({ kind: "image", src: image[2], alt: image[1] }, 6);
      continue;
    }
    const heading = /^#{1,6}\s/.test(paragraph);
    for (const line of wrapBookText(paragraph.replace(/^#{1,6}\s/, "")))
      add({ kind: "text", text: line, heading }, 1);
  }
  if (page.length) pages.push(page);
  return pages;
}
export function paperBookPages(
  paper: ResearchPaper,
  markdown: string,
): BookPage[] {
  const information = paginateBook(
    [
      paper.title,
      "",
      `作者：${paper.author}`,
      `年份：${paper.year}`,
      `类型：${paper.category}`,
      "",
      "关键词：",
      ...paper.keywords,
      "",
      ...(paper.license ? [paper.license, "原文作者保留署名"] : []),
    ].join("\n"),
  );
  const abstract = paginateBook(
    [
      "摘要",
      "",
      paper.abstract,
      "",
      ...(paper.draft ? ["原创示例 · 非发表论文"] : []),
    ].join("\n"),
  );
  const pages = [...information, ...abstract, ...paginateBook(markdown)];
  if (pages.length % 2) pages.push([]);
  return pages;
}

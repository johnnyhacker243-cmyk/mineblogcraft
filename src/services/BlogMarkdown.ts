export type BlogBlock =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph" | "item" | "quote"; text: string }
  | { kind: "code"; language: string; lines: string[] };

// Text-only subset: no HTML interpretation, remote images, or executable links.
export function parseBlogMarkdown(text: string): BlogBlock[] {
  const lines = text
    .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
    .split(/\r?\n/);
  const blocks: BlogBlock[] = [];
  let paragraph: string[] = [];
  let code: { language: string; lines: string[] } | undefined;
  const flush = () => {
    if (paragraph.length)
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  for (const line of lines) {
    const fence = line.match(/^```(.*)$/);
    if (code) {
      if (fence) {
        blocks.push({ kind: "code", ...code });
        code = undefined;
      } else code.lines.push(line);
      continue;
    }
    if (fence) {
      flush();
      code = { language: fence[1].trim(), lines: [] };
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    const item = line.match(/^(?:[-*]|\d+\.)\s+(.*)$/);
    const quote = line.match(/^>\s?(.*)$/);
    if (heading || item || quote) {
      flush();
      if (heading)
        blocks.push({
          kind: "heading",
          level: heading[1].length,
          text: heading[2],
        });
      else if (item) blocks.push({ kind: "item", text: item[1] });
      else if (quote) blocks.push({ kind: "quote", text: quote[1] });
    } else paragraph.push(line.trim());
  }
  if (code) blocks.push({ kind: "code", ...code });
  flush();
  return blocks;
}

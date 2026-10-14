import { createElement } from "react";
import { BlogText } from "./BlogText";

// A deliberately small, text-only Markdown adapter. HTML is never interpreted.
export function MarkdownText({ text }: { text: string }) {
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  let code = false;
  return body.split(/\r?\n/).map((line, index) => {
    if (line.startsWith("```")) {
      code = !code;
      return null;
    }
    if (!line.trim()) return null;
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading && !code)
      return createElement(
        `h${heading[1].length}`,
        { key: index },
        <BlogText text={heading[2]} width={310} color="#ffff55" />,
      );
    const value = code
      ? line
      : line.replace(/^[-*]\s/, "• ").replace(/^>\s?/, "引用：");
    return (
      <p key={index} className={code ? "markdown-code" : undefined}>
        <BlogText text={value} width={310} />
      </p>
    );
  });
}

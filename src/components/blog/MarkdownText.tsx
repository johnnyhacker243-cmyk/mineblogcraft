import { createElement } from "react";
import { BlogText } from "./BlogText";
import { parseBlogMarkdown } from "../../services/BlogMarkdown";

// A deliberately small, text-only Markdown adapter. HTML is never interpreted.
export function MarkdownText({
  text,
  hideTitle,
}: {
  text: string;
  hideTitle?: string;
}) {
  return parseBlogMarkdown(text).map((block, index) => {
    if (block.kind === "heading") {
      if (index === 0 && block.level === 1 && block.text === hideTitle)
        return null;
      return createElement(
        `h${Math.max(2, block.level)}`,
        { key: index },
        <BlogText text={block.text} width={310} color="#ffff55" />,
      );
    }
    if (block.kind === "code")
      return (
        <div
          key={index}
          className="markdown-code"
          role="group"
          aria-label={`${block.language || "文本"} 代码示例`}
        >
          {block.lines.map((line, i) => (
            <BlogText key={i} text={line || " "} width={300} color="#aaffff" />
          ))}
        </div>
      );
    const value =
      block.kind === "item"
        ? `• ${block.text}`
        : block.kind === "quote"
          ? `引用：${block.text}`
          : block.text;
    return (
      <p key={index}>
        <BlogText text={value} width={310} />
      </p>
    );
  });
}

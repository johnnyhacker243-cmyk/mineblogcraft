import { useState } from "react";
import type { BookPage } from "../../models/ResearchPaper";
import { InventoryText } from "../InventoryText";
export function PageRenderer({
  page,
  number,
  onZoom,
}: {
  page: BookPage;
  number: number;
  onZoom?: (image: { src: string; alt: string }) => void;
}) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  return (
    <section className="book-page" aria-label={`第 ${number} 页`}>
      <div className="book-page-copy">
        {page.map((block, index) =>
          block.kind === "image" ? (
            <figure
              key={index}
              style={
                block.height
                  ? {
                      height: `calc(${block.height + 8}px * var(--book-scale))`,
                    }
                  : undefined
              }
            >
              <button
                className="paper-figure-button"
                aria-label={`放大：${block.alt}`}
                onClick={() => onZoom?.({ src: block.src, alt: block.alt })}
              >
                {failed[block.src] ? (
                  <span>图片暂不可用</span>
                ) : (
                  <img
                    src={block.src}
                    alt={block.alt}
                    style={
                      block.height
                        ? {
                            maxHeight: `calc(${block.height}px * var(--book-scale))`,
                          }
                        : undefined
                    }
                    onError={() =>
                      setFailed((previous) => ({
                        ...previous,
                        [block.src]: true,
                      }))
                    }
                  />
                )}
              </button>
            </figure>
          ) : block.kind === "rich" ? (
            <div
              className={`book-rich-line ${block.heading ? "book-rich-heading" : ""}`}
              key={index}
            >
              {block.runs.map((run, i) =>
                "text" in run ? (
                  <span key={i}>{run.text}</span>
                ) : (
                  <img
                    key={i}
                    src={run.src}
                    alt={run.alt}
                    style={{
                      width: `calc(${run.width}px * var(--book-scale))`,
                      height: `calc(${run.height}px * var(--book-scale))`,
                    }}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="book-line" key={index}>
              {block.text && (
                <InventoryText
                  text={block.text}
                  color={block.heading ? "#5a3017" : "#292019"}
                  shadow={false}
                />
              )}
            </div>
          ),
        )}
      </div>
    </section>
  );
}

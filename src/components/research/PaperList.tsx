import type { ResearchPaper } from "../../models/ResearchPaper";
import type { PaperMatch } from "../../services/PaperSearchService";
import { BlogText } from "../blog/BlogText";
import { InventoryText } from "../InventoryText";
import { audioManager } from "../../managers/AudioManager";
export function PaperList({
  papers,
  results,
  searching,
  open,
}: {
  papers: ResearchPaper[];
  results: PaperMatch[];
  searching: boolean;
  open: (paper: ResearchPaper) => void;
}) {
  const scores = new Map(
    results.map((result) => [result.paper.id, result.score]),
  );
  const ordered = searching
    ? [
        ...results.map((result) => result.paper),
        ...papers.filter((paper) => !scores.has(paper.id)),
      ]
    : papers;
  return (
    <div
      className="paper-list paper-bookshelf"
      role="list"
      aria-label="论文目录"
    >
      {ordered.map((paper) => (
        <div
          key={paper.id}
          role="listitem"
          className={`shelf-record ${searching && !scores.has(paper.id) ? "paper-unmatched" : ""}`}
        >
          <button
            className="paper-item"
            aria-label={`打开书籍：${paper.title}`}
            onClick={() => {
              audioManager.click();
              open(paper);
            }}
          >
            <div className="shelf-book-rest">
              <img src={paper.cover} alt="附魔书" />
            </div>
            <div className="shelf-title">
              <BlogText
                text={
                  paper.title.length > 55
                    ? paper.title.split(":")[0]
                    : paper.title
                }
                width={136}
              />
              <InventoryText text={paper.year} color="#d6ba83" />
            </div>
          </button>
          <aside className="paper-tooltip" role="tooltip">
            <BlogText text={paper.title} width={190} color="#ffff55" />
            <BlogText
              text={`作者：${paper.author} · ${paper.year}`}
              width={190}
            />
            <BlogText text={paper.description} width={190} color="#aaa" />
            <BlogText text={paper.category} width={190} color="#55ffff" />
            {paper.draft && (
              <InventoryText text="原创示例 · 非发表论文" color="#aaa" />
            )}
          </aside>
        </div>
      ))}
    </div>
  );
}

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
    <div className="paper-shelf-frame">
      <div className="bookshelf-pillar" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <img key={i} src="/assets/inventory/bookshelf.png" alt="" />
        ))}
      </div>
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
              {paper.origin === "external" && (
                <InventoryText
                  text={
                    paper.readingMode === "fulltext"
                      ? "外部论文 · 授权全文"
                      : "外部论文 · 书目与阅读引导"
                  }
                  color="#aaa"
                />
              )}
              {paper.draft && (
                <InventoryText text="原创示例 · 非发表论文" color="#aaa" />
              )}
            </aside>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 6 - ordered.length) }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="shelf-record empty-shelf-record"
            aria-label="空藏书位"
          >
            <div className="empty-book-space" />
            <InventoryText text="待收录" color="#b69b70" />
          </div>
        ))}
      </div>
      <div className="bookshelf-pillar" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <img key={i} src="/assets/inventory/bookshelf.png" alt="" />
        ))}
      </div>
    </div>
  );
}

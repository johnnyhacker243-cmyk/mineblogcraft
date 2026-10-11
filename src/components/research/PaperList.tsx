import type { ResearchPaper } from "../../models/ResearchPaper";
import { BlogText } from "../blog/BlogText";
import { InventoryText } from "../InventoryText";
import { audioManager } from "../../managers/AudioManager";
export function PaperList({
  papers,
  open,
}: {
  papers: ResearchPaper[];
  open: (paper: ResearchPaper) => void;
}) {
  return (
    <div className="paper-list" role="list" aria-label="论文目录">
      {papers.map((paper) => (
        <div key={paper.id} role="listitem">
          <button
            className="paper-item"
            aria-label={`打开书籍：${paper.title}`}
            onClick={() => {
              audioManager.click();
              open(paper);
            }}
          >
            <img src={paper.cover} alt="成书" />
            <div>
              <BlogText text={paper.title} width={280} />
              <InventoryText
                text={`作者：${paper.author} · ${paper.year}`}
                color="#aaa"
              />
              <BlogText text={paper.description} width={280} color="#aaa" />
              <InventoryText text={paper.category} color="#ffff55" />
              {paper.draft && (
                <InventoryText text="原创示例 · 非发表论文" color="#808080" />
              )}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}

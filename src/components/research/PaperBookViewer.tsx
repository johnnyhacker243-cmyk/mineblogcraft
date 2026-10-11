import { useEffect, useState } from "react";
import type { ResearchPaper, BookPage } from "../../models/ResearchPaper";
import { paperRepository } from "../../services/PaperRepository";
import { paperBookPages } from "../../utils/book-pagination";
import { PageRenderer } from "./PageRenderer";
import { BookAnimation } from "./BookAnimation";
import { InventoryText } from "../InventoryText";
import { MinecraftButton } from "../MinecraftButton";
import { audioManager } from "../../managers/AudioManager";
export function PaperBookViewer({
  paper,
  back,
}: {
  paper: ResearchPaper;
  back: () => void;
}) {
  const [pages, setPages] = useState<BookPage[]>([]);
  const [spread, setSpread] = useState(0);
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    paperRepository
      .getContent(paper, controller.signal)
      .then((text) => {
        if (!controller.signal.aborted) setPages(paperBookPages(paper, text));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [paper]);
  const turn = (direction: number) => {
    if (!opened) return;
    setSpread((previous) =>
      Math.max(
        0,
        Math.min(Math.ceil(pages.length / 2) - 1, previous + direction),
      ),
    );
    audioManager.click();
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        turn(e.key === "ArrowRight" ? 1 : -1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [opened, pages.length]);
  return (
    <div
      className="paper-book-viewer"
      data-book-state={opened ? "open" : "opening"}
      aria-label={paper.title}
    >
      <div className="book-stage">
        <div className="book-spread" aria-busy={!opened || !pages.length}>
          <div className={`book-leaves ${opened ? "leaves-open" : ""}`}>
            <PageRenderer
              page={pages[spread * 2] ?? []}
              number={spread * 2 + 1}
            />
            <PageRenderer
              page={pages[spread * 2 + 1] ?? []}
              number={spread * 2 + 2}
            />
          </div>
          <BookAnimation opened={opened} onOpened={() => setOpened(true)} />
        </div>
      </div>
      <div className="book-navigation">
        <button
          className="book-arrow backward"
          aria-label="上一页"
          disabled={!opened || spread === 0}
          onClick={() => turn(-1)}
        />
        <InventoryText
          text={
            pages.length
              ? `第 ${spread * 2 + 1}-${spread * 2 + 2} 页 / 共 ${pages.length} 页`
              : "正在读取书籍..."
          }
        />
        <button
          className="book-arrow forward"
          aria-label="下一页"
          disabled={!opened || spread >= pages.length / 2 - 1}
          onClick={() => turn(1)}
        />
      </div>
      {error && (
        <div role="alert">
          <InventoryText text="正文加载失败，请返回后重试" />
        </div>
      )}
      <MinecraftButton aria-label="返回论文目录" onClick={back}>
        <InventoryText text="返回" />
      </MinecraftButton>
    </div>
  );
}

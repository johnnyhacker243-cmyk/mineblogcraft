import { useEffect, useState, type CSSProperties } from "react";
import type { ResearchPaper } from "../models/ResearchPaper";
import { paperRepository } from "../services/PaperRepository";
import { PaperList } from "../components/research/PaperList";
import { PaperBookViewer } from "../components/research/PaperBookViewer";
import { InventoryText } from "../components/InventoryText";
import { MinecraftButton } from "../components/MinecraftButton";
import "../styles/research.css";
export function MineResearchPage({ back }: { back: () => void }) {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [message, setMessage] = useState("加载论文目录...");
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  useEffect(() => {
    const resize = () => setSize({ width: innerWidth, height: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    paperRepository
      .getPapers(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setPapers(result);
          setMessage(result.length ? "" : "暂无论文");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setMessage("论文目录加载失败");
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        if (paper) setPaper(null);
        else back();
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [paper, back]);
  const scale = Math.max(
    1,
    Math.min(5, Math.floor(Math.min(size.width / 410, size.height / 240))),
  );
  return (
    <main
      className={`research-screen ${paper ? "reading-book" : ""}`}
      data-research-scale={scale}
      style={
        {
          "--book-scale": scale,
          "--blog-scale": scale,
          "--inventory-scale": scale,
          "--gui-scale-x": scale,
          "--gui-scale-y": scale,
          "--button-width": `${150 * scale}px`,
          "--button-height": `${20 * scale}px`,
        } as CSSProperties
      }
    >
      {paper ? (
        <PaperBookViewer
          key={paper.id}
          paper={paper}
          back={() => setPaper(null)}
        />
      ) : (
        <section className="research-catalog">
          <header>
            <h1>
              <InventoryText text="MineResearch" />
            </h1>
            <InventoryText text="论文收藏 · 知识之书" />
          </header>
          <PaperList papers={papers} open={setPaper} />
          {message && (
            <div role="status">
              <InventoryText text={message} />
            </div>
          )}
          <footer>
            <MinecraftButton aria-label="返回主菜单" onClick={back}>
              <InventoryText text="返回" />
            </MinecraftButton>
          </footer>
        </section>
      )}
    </main>
  );
}

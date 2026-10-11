import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { WikiNodeData, WikiCategory } from "../models/WikiNode";
import { wikiRepository } from "../services/WikiRepository";
import { wikiSearchService } from "../services/WikiSearchService";
import { WikiTabs } from "../components/wiki/WikiTabs";
import { WikiTree } from "../components/wiki/WikiTree";
import { WikiDetailPanel } from "../components/wiki/WikiDetailPanel";
import { InventoryText } from "../components/InventoryText";
import { MinecraftButton } from "../components/MinecraftButton";
import { audioManager } from "../managers/AudioManager";
import "../styles/wiki.css";
export function MineWikiPage({ back }: { back: () => void }) {
  const [nodes, setNodes] = useState<WikiNodeData[]>([]),
    [error, setError] = useState(false),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState<WikiCategory>("AI"),
    [detail, setDetail] = useState<WikiNodeData | null>(null),
    [resetKey, setReset] = useState(0),
    [focusId, setFocus] = useState<string>();
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight });
  useEffect(() => {
    const resize = () => setSize({ w: innerWidth, h: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    wikiRepository
      .getAllNodes(controller.signal)
      .then((n) => {
        if (!controller.signal.aborted) setNodes(n);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, []);
  const results = useMemo(
    () => wikiSearchService.search(query, nodes),
    [query, nodes],
  );
  useEffect(() => {
    if (query.trim() && results.length) {
      setCategory(results[0].node.category);
      setFocus(results[0].node.id);
      setDetail(null);
    } else setFocus(undefined);
  }, [results, query]);
  const closeDetail = () => {
    const id = detail?.id;
    setDetail(null);
    if (id)
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLButtonElement>(
            `[data-node-id="${CSS.escape(id)}"]`,
          )
          ?.focus(),
      );
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        if (detail) closeDetail();
        else if (query) {
          setQuery("");
        } else back();
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [detail, query, back]);
  const scale = Math.max(
    1,
    Math.floor(Math.min((size.w * 0.94) / 480, (size.h * 0.92) / 334) * 4) / 4,
  );
  const visible = useMemo(
    () => nodes.filter((n) => n.category === category),
    [nodes, category],
  );
  const select = (c: WikiCategory) => {
    setCategory(c);
    setDetail(null);
    setFocus(undefined);
    setReset((k) => k + 1);
  };
  return (
    <main
      className="wiki-screen"
      data-wiki-scale={scale}
      style={
        {
          "--wiki-scale": scale,
          "--inventory-scale": scale * 0.75,
          "--gui-scale-x": scale,
          "--gui-scale-y": scale,
          "--button-width": `${125 * scale}px`,
          "--button-height": `${20 * scale}px`,
        } as CSSProperties
      }
    >
      <header className="wiki-heading">
        <h1>
          <InventoryText text="MineWiki" />
        </h1>
        <InventoryText text="知识进度 · 技术成长树" />
        <div className="wiki-search">
          <label htmlFor="wiki-search">
            <InventoryText text="搜索知识" />
          </label>
          <input
            id="wiki-search"
            placeholder="Nmap / Agent / 扩散方程"
            value={query}
            maxLength={100}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span role="status">
            <InventoryText
              text={
                query
                  ? `共找到 ${results.length} 个结果`
                  : `${nodes.length} 个知识节点`
              }
              color="#aaa"
            />
          </span>
        </div>
      </header>
      <div className="wiki-window">
        <WikiTabs category={category} select={select} />
        <div className="wiki-window-title">
          <InventoryText
            text={`${category} · 知识进度`}
            color="#404040"
            shadow={false}
          />
        </div>
        <WikiTree
          nodes={visible}
          detailOpen={!!detail}
          category={category}
          scale={scale}
          matches={new Set(results.map((r) => r.node.id))}
          query={query.trim()}
          focusId={focusId}
          resetKey={resetKey}
          open={(n) => {
            audioManager.click();
            setDetail(n);
          }}
        />
        {detail && <WikiDetailPanel node={detail} close={closeDetail} />}
      </div>
      {error && (
        <div role="alert">
          <InventoryText text="知识目录加载失败，请返回重试" />
        </div>
      )}
      <footer className="wiki-controls">
        <MinecraftButton aria-label="返回主菜单" onClick={back}>
          <InventoryText text="返回" />
        </MinecraftButton>
        <MinecraftButton
          aria-label="重置知识树视图"
          onClick={() => {
            setFocus(undefined);
            setReset((k) => k + 1);
          }}
        >
          <InventoryText text="重置视图" />
        </MinecraftButton>
        {query && (
          <MinecraftButton
            aria-label="清空知识搜索"
            onClick={() => setQuery("")}
          >
            <InventoryText text="清空搜索" />
          </MinecraftButton>
        )}
      </footer>
      <div className="wiki-hint">
        <InventoryText
          text="拖动浏览 · 滚轮缩放 · 点击查看 · 状态未记录"
          color="#aaa"
        />
      </div>
    </main>
  );
}

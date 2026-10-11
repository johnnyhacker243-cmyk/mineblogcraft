import { useEffect, useState, type CSSProperties } from "react";
import type { RSSServer } from "../models/RSSServer";
import { rssService } from "../services/RSSRepository";
import { RSSServerRow } from "../components/rss/RSSServerRow";
import { InventoryText } from "../components/InventoryText";
import { MinecraftButton } from "../components/MinecraftButton";
import { assets } from "../config/assets-config";
import "../styles/rss.css";
export function MineRSSScreen({ back }: { back: () => void }) {
  const [sources, setSources] = useState<RSSServer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState(false);
  const [message, setMessage] = useState("加载信息服务器...");
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  useEffect(() => {
    const resize = () => setSize({ width: innerWidth, height: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    rssService
      .getSources({}, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setSources(result);
          setMessage(result.length ? "" : "暂无信息服务器");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setMessage("信息源加载失败，请返回后重试");
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        if (notice) setNotice(false);
        else back();
      }
    };
    window.addEventListener("keydown", escape, true);
    return () => window.removeEventListener("keydown", escape, true);
  }, [notice, back]);
  const scale = Math.max(
    1,
    Math.min(4, Math.floor(Math.min(size.width / 440, size.height / 320))),
  );
  return (
    <main
      className="rss-screen"
      data-rss-scale={scale}
      style={
        {
          "--rss-scale": scale,
          "--blog-scale": scale,
          "--inventory-scale": scale,
          "--gui-scale-x": scale,
          "--gui-scale-y": scale,
          "--button-width": `${150 * scale}px`,
          "--button-height": `${20 * scale}px`,
        } as CSSProperties
      }
      aria-label="MineRSS 信息服务器"
    >
      <div className="rss-brand">
        <img src={assets.logo} alt="Mineblogcraft" />
      </div>
      <header>
        <h1>
          <InventoryText text="MineRSS" shadowColor="#000" />
        </h1>
        <InventoryText text="连接更广阔的知识世界" />
        <small>
          <InventoryText text="静态预览 · 状态与日期为示例" color="#aaa" />
        </small>
      </header>
      <div className="rss-list-band">
        <div
          className="rss-server-list"
          role="listbox"
          aria-label="信息服务器列表"
        >
          {sources.map((server) => (
            <RSSServerRow
              key={server.id}
              server={server}
              selected={server.id === selected}
              onSelect={() => setSelected(server.id)}
            />
          ))}
        </div>
        {message && (
          <div className="rss-message" role="status">
            <InventoryText text={message} />
          </div>
        )}
      </div>
      <footer>
        {notice && (
          <div className="rss-notice" role="status">
            <InventoryText text="RSS管理功能将在未来版本开放" />
          </div>
        )}
        <div className="rss-actions">
          <MinecraftButton
            aria-label="连接信息源"
            onClick={() => setNotice(true)}
          >
            <InventoryText text="连接信息源" />
          </MinecraftButton>
          <MinecraftButton aria-label="返回主菜单" onClick={back}>
            <InventoryText text="返回" />
          </MinecraftButton>
        </div>
      </footer>
    </main>
  );
}

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { RSSServer, RSSArticle } from "../models/RSSServer";
import { rssService } from "../services/RSSRepository";
import { RSSServerRow } from "../components/rss/RSSServerRow";
import { InventoryText } from "../components/InventoryText";
import { BlogText } from "../components/blog/BlogText";
import { MinecraftButton } from "../components/MinecraftButton";
import { assets } from "../config/assets-config";
import "../styles/rss.css";
const domainNames: Record<string, string> = {
  ai: "AI",
  security: "Security",
  software: "Software",
};
const safeUrl = (s: string) => {
  try {
    return ["http:", "https:"].includes(new URL(s).protocol);
  } catch {
    return false;
  }
};
export function MineRSSScreen({ back }: { back: () => void }) {
  const [sources, setSources] = useState<RSSServer[]>([]),
    [items, setItems] = useState<RSSArticle[]>([]);
  const [selected, setSelected] = useState<string | null>(null),
    [reading, setReading] = useState<string | null>(null);
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState(""),
    [message, setMessage] = useState("加载信息服务器...");
  const [limit, setLimit] = useState(40);
  useEffect(() => setLimit(40), [query, reading, category]);
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const ids = JSON.parse(
        localStorage.getItem("mineblogcraft.rss.read") ?? "[]",
      );
      return Array.isArray(ids) ? ids.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    const resize = () => setSize({ width: innerWidth, height: innerHeight });
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      rssService.getSources({}, controller.signal),
      rssService.getLatest(controller.signal),
    ])
      .then(([s, i]) => {
        if (!controller.signal.aborted) {
          setSources(s);
          setItems(i);
          if (location.hash.startsWith("#rss/")) {
            try {
              const id = decodeURIComponent(location.hash.slice(5));
              if (s.some((source) => source.id === id)) setReading(id);
            } catch {
              /* Invalid fragment: keep the source list usable. */
            }
          }
          setMessage("");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setMessage("快照读取失败，请返回后重试");
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        if (reading) {
          setReading(null);
          setQuery("");
          history.replaceState(null, "", location.pathname + location.search);
        } else back();
      }
    };
    addEventListener("keydown", escape, true);
    return () => removeEventListener("keydown", escape, true);
  }, [reading, back]);
  const matches = (text: string) =>
    query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .every((q) => text.toLowerCase().includes(q));
  const shownSources = sources.filter(
    (s) =>
      (!category || s.domainId === category) &&
      matches([s.name, s.description, ...s.tags].join(" ")),
  );
  const selectionVisible = shownSources.some(
    (source) => source.id === selected,
  );
  const shownItems = useMemo(
    () =>
      items
        .filter(
          (i) =>
            (reading === "all" || i.sourceId === reading) &&
            (!category || i.domainId === category) &&
            matches(
              [
                i.title,
                i.description,
                i.author,
                sources.find((s) => s.id === i.sourceId)?.name,
              ].join(" "),
            ),
        )
        .sort((a, b) =>
          (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
        ),
    [items, reading, category, query, sources],
  );
  const activeSource = sources.find((s) => s.id === reading);
  const scale = Math.max(
    1,
    Math.min(4, Math.floor(Math.min(size.width / 440, size.height / 320))),
  );
  const openSource = (id: string) => {
    setReading(id);
    setQuery("");
  };
  const returnSources = () => {
    setReading(null);
    setQuery("");
    history.replaceState(null, "", location.pathname + location.search);
  };
  const markRead = (id: string) => {
    const next = [...new Set([...readIds, id])].slice(-1000);
    setReadIds(next);
    try {
      localStorage.setItem("mineblogcraft.rss.read", JSON.stringify(next));
    } catch {
      /* Storage may be unavailable in privacy mode. */
    }
  };
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
        <InventoryText text={activeSource?.name ?? "连接更广阔的知识世界"} />
        <small>
          <InventoryText
            text="构建快照 · ONLINE 表示上次抓取成功"
            color="#aaa"
          />
        </small>
        <div className="rss-controls">
          <input
            aria-label="搜索订阅源或文章"
            placeholder="搜索知识世界..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="RSS 分类"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">全部方向</option>
            {Object.entries(domainNames).map(([id, name]) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <nav className="rss-links">
          <button
            onClick={() => {
              returnSources();
            }}
          >
            信息源
          </button>
          <button onClick={() => openSource("all")}>最新文章</button>
          <a href="/feed.xml" target="_blank" rel="noopener noreferrer">
            订阅本站
          </a>
          <a href="/data/rss/subscriptions.opml" download>
            导出 OPML
          </a>
        </nav>
      </header>
      <div className="rss-list-band">
        {reading ? (
          <div className="rss-article-list" aria-label="RSS 文章列表">
            {activeSource && (
              <div className="rss-source-note">
                <BlogText
                  text={`${activeSource.status.toUpperCase()} · 最近检查 ${activeSource.lastCheckedAt?.slice(0, 10) ?? "尚未检查"}`}
                  width={420}
                  color="#aaa"
                />
                {activeSource.error && (
                  <BlogText
                    text="本次抓取未成功，保留上次可用条目；详细原因见验证报告。"
                    width={420}
                    color="#ffaa00"
                  />
                )}
                <div>
                  <a
                    href={activeSource.feedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Feed
                  </a>{" "}
                  ·{" "}
                  <a
                    href={activeSource.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    原站
                  </a>
                </div>
              </div>
            )}
            {shownItems.slice(0, limit).map((item) => (
              <article
                key={item.id}
                className={`rss-article ${readIds.includes(item.id) ? "is-read" : ""}`}
              >
                <a
                  href={safeUrl(item.link) ? item.link : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markRead(item.id)}
                >
                  <BlogText
                    text={item.title}
                    width={420}
                    color={readIds.includes(item.id) ? "#aaa" : "#fff"}
                  />
                </a>
                <BlogText
                  text={`${item.publishedAt?.slice(0, 10) ?? "日期未提供"} · ${sources.find((s) => s.id === item.sourceId)?.name ?? item.sourceId}${item.author ? " · " + item.author : ""}`}
                  width={420}
                  color="#ffaa00"
                />
                <BlogText
                  text={item.description || "来源未提供摘要；请打开原文阅读。"}
                  width={420}
                  color="#aaa"
                />
              </article>
            ))}
            {shownItems.length > limit && (
              <div className="rss-source-note">
                <button
                  className="rss-load-more"
                  onClick={() => setLimit((n) => n + 40)}
                >
                  继续读取 · {limit} / {shownItems.length}
                </button>
              </div>
            )}
            {!shownItems.length && (
              <div className="rss-message">
                <BlogText
                  text="没有可用条目。该来源可能尚未验证，或搜索没有匹配；请查看原站或清空搜索。"
                  width={320}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            className="rss-server-list"
            role="listbox"
            aria-label="信息服务器列表"
          >
            {shownSources.map((server) => (
              <div key={server.id} onDoubleClick={() => openSource(server.id)}>
                <RSSServerRow
                  server={server}
                  selected={server.id === selected}
                  onSelect={() => setSelected(server.id)}
                />
              </div>
            ))}
          </div>
        )}
        {message && (
          <div className="rss-message" role="status">
            <InventoryText text={message} />
          </div>
        )}
        {!reading && !message && !shownSources.length && (
          <div className="rss-message" role="status">
            <InventoryText text="没有找到信息源" />
          </div>
        )}
      </div>
      <footer>
        <div className="rss-actions">
          <MinecraftButton
            disabled={!reading && !selectionVisible}
            aria-label="连接信息源"
            onClick={() =>
              reading
                ? openSource("all")
                : selected && selectionVisible && openSource(selected)
            }
          >
            <InventoryText text={reading ? "最新文章" : "连接信息源"} />
          </MinecraftButton>
          <MinecraftButton
            aria-label={reading ? "返回信息源" : "返回主菜单"}
            onClick={() => (reading ? returnSources() : back())}
          >
            <InventoryText text="返回" />
          </MinecraftButton>
        </div>
      </footer>
    </main>
  );
}

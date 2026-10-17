import { useEffect, useState, type CSSProperties } from "react";
import { blogService } from "../services/BlogService";
import type { BlogWorld } from "../models/BlogWorld";
import { WorldSearch } from "../components/blog/WorldSearch";
import { WorldList } from "../components/blog/WorldList";
import { BlogReader } from "../components/blog/BlogReader";
import { BlogSubscription } from "../components/blog/BlogSubscription";
import { MinecraftButton } from "../components/MinecraftButton";
import { InventoryText } from "../components/InventoryText";
import "../styles/blog.css";

export function BlogWorldSelect({ back }: { back: () => void }) {
  const [query, setQuery] = useState("");
  const [worlds, setWorlds] = useState<BlogWorld[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [article, setArticle] = useState<BlogWorld | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [state, setState] = useState("加载世界...");
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  useEffect(() => {
    const resize = () => setSize({ width: innerWidth, height: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setState("加载世界...");
    blogService
      .search(query, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setWorlds(result);
        setSelected((prev) =>
          result.some((w) => w.id === prev) ? prev : null,
        );
        setState(result.length ? "" : "没有找到世界");
        if (location.hash.startsWith("#blog/")) {
          try {
            const id = decodeURIComponent(location.hash.slice(6));
            setArticle(result.find((w) => w.id === id) ?? null);
          } catch {
            setArticle(null);
          }
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("世界加载失败，请返回后重试");
      });
    return () => controller.abort();
  }, [query]);
  const returnToList = () => {
    setArticle(null);
    history.replaceState(null, "", location.pathname + location.search);
  };
  useEffect(() => {
    const followLink = () => {
      if (!location.hash.startsWith("#blog/")) {
        setArticle(null);
        return;
      }
      try {
        const id = decodeURIComponent(location.hash.slice(6));
        setArticle(worlds.find((world) => world.id === id) ?? null);
      } catch {
        setArticle(null);
      }
    };
    window.addEventListener("hashchange", followLink);
    return () => window.removeEventListener("hashchange", followLink);
  }, [worlds]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        if (subscribing) setSubscribing(false);
        else if (article) returnToList();
        else back();
      }
    };
    window.addEventListener("keydown", escape, true);
    return () => window.removeEventListener("keydown", escape, true);
  }, [article, back, subscribing]);
  const enter = (world: BlogWorld) => {
    setArticle(world);
    history.replaceState(null, "", `#blog/${encodeURIComponent(world.id)}`);
  };
  const scale = Math.max(
    1,
    Math.min(4, Math.floor(Math.min(size.width / 380, size.height / 250))),
  );
  return (
    <main
      className="blog-screen"
      data-blog-scale={scale}
      style={
        {
          "--blog-scale": scale,
          "--inventory-scale": scale,
          "--gui-scale-x": scale,
          "--gui-scale-y": scale,
          "--button-width": `${200 * scale}px`,
          "--button-height": `${20 * scale}px`,
        } as CSSProperties
      }
    >
      {article ? (
        <BlogReader world={article} back={returnToList} />
      ) : (
        <section className="world-select" aria-label="MineBlog 世界选择">
          <header>
            <h1>
              <InventoryText text="MineBlog" />
            </h1>
            <WorldSearch value={query} onChange={setQuery} />
          </header>
          <div className="world-list-band">
            <WorldList
              worlds={worlds}
              selected={selected}
              select={setSelected}
              enter={enter}
            />
            {state && (
              <div className="world-message" role="status">
                <InventoryText text={state} />
              </div>
            )}
          </div>
          <footer>
            <MinecraftButton
              disabled={!selected}
              aria-label="进入选中的 Blog"
              onClick={() => {
                const world = worlds.find((w) => w.id === selected);
                if (world) enter(world);
              }}
            >
              <InventoryText text="进入选中的 Blog" />
            </MinecraftButton>
            <div className="blog-footer-row">
              <MinecraftButton
                aria-label="订阅博客"
                onClick={() => setSubscribing(true)}
              >
                <InventoryText text="订阅博客" />
              </MinecraftButton>
              <MinecraftButton aria-label="返回主菜单" onClick={back}>
                <InventoryText text="返回" />
              </MinecraftButton>
            </div>
          </footer>
        </section>
      )}
      {subscribing && <BlogSubscription close={() => setSubscribing(false)} />}
    </main>
  );
}

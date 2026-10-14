import type { BlogWorld } from "../../models/BlogWorld";
import { WorldCover } from "./WorldCover";
import { InventoryText } from "../InventoryText";
import { MinecraftButton } from "../MinecraftButton";
import { BlogText } from "./BlogText";
import { useEffect, useState } from "react";
import { blogRepository } from "../../services/BlogRepository";
import { MarkdownText } from "./MarkdownText";
export function BlogReader({
  world,
  back,
}: {
  world: BlogWorld;
  back: () => void;
}) {
  const [body, setBody] = useState(world.content);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setBody(world.content);
    setError(false);
    blogRepository
      .getContent(world, controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) setBody(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [world]);
  return (
    <section className="blog-reader" aria-label="博客文章">
      <header>
        <div className="reader-cover">
          <WorldCover image={world.image} />
        </div>
        <h1>
          <BlogText text={world.title} />
        </h1>
        <BlogText
          text={`${world.createTime} · ${world.category}`}
          color="#aaa"
        />
        {world.status === "draft" && (
          <BlogText
            text="编辑草稿 · AI 辅助整理 · 待作者审阅"
            color="#ffff55"
          />
        )}
      </header>
      <article tabIndex={0} aria-label={world.title}>
        {error ? (
          <BlogText text="正文读取失败，请返回后重试" color="#ff5555" />
        ) : (
          <MarkdownText text={body} />
        )}
        {!!world.sources?.length && (
          <section aria-label="参考来源">
            <h2>
              <BlogText text="参考来源" color="#ffff55" />
            </h2>
            {world.sources.map((source) => (
              <p key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  <BlogText text={source.title} width={310} color="#55ffff" />
                </a>
              </p>
            ))}
          </section>
        )}
      </article>
      <footer>
        <MinecraftButton aria-label="返回世界列表" onClick={back}>
          <InventoryText text="返回" />
        </MinecraftButton>
      </footer>
    </section>
  );
}

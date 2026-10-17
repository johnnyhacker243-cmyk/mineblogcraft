import type { WikiNodeData } from "../../models/WikiNode";
import { InventoryText } from "../InventoryText";
import { BlogText } from "../blog/BlogText";
import { MinecraftButton } from "../MinecraftButton";
import { useEffect, useRef } from "react";
export function WikiDetailPanel({
  node,
  close,
  navigate,
}: {
  node: WikiNodeData;
  close: () => void;
  navigate: (id: string) => void;
}) {
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0;
  }, [node.id]);
  return (
    <aside
      className="wiki-detail"
      role="dialog"
      aria-label={`${node.title} 详情`}
    >
      <header>
        <img src={node.icon} alt="" />
        <BlogText text={node.title} width={210} color="#ffff55" />
      </header>
      <div className="wiki-detail-scroll" ref={scroll}>
        <div className="wiki-provenance">
          更新 {node.updated} ·{" "}
          {node.provenance === "legacy-concept-note"
            ? "既有概念说明 · 待补充直接证据"
            : "Agent 基于站内资料整理 · 非作者原话"}
        </div>
        <p className="wiki-icon-reason">
          图标：{node.iconLabel} · {node.iconReason}
        </p>
        <nav className="wiki-toc" aria-label="本页目录">
          {node.sections.map((section, i) => (
            <a
              key={i}
              href={`#wiki-section-${node.id}-${i}`}
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById(`wiki-section-${node.id}-${i}`)
                  ?.scrollIntoView({ block: "start" });
              }}
            >
              {section.title}
            </a>
          ))}
        </nav>
        <article className="wiki-prose" aria-label={`${node.title} 正文`}>
          {node.sections.map((section, i) => (
            <section key={i} id={`wiki-section-${node.id}-${i}`}>
              <h2>{section.title}</h2>
              {section.text.split(/\n\n+/).map((text, j) => (
                <p key={j}>{text}</p>
              ))}
            </section>
          ))}
        </article>
        <InventoryText text="学习要点" color="#55ffff" />
        {node.learningPoints.map((p, i) => (
          <BlogText key={i} text={`${i + 1}. ${p}`} width={240} />
        ))}
        <div className="wiki-concept-links">
          <h2>相关知识 · 双向链接</h2>
          {node.relatedNodes.map((r) => (
            <button key={r.id} onClick={() => navigate(r.id)}>
              {r.title}
            </button>
          ))}
          <h2>反向链接</h2>
          {node.backlinks.length ? (
            node.backlinks.map((r) => (
              <button key={r.id} onClick={() => navigate(r.id)}>
                {r.title}
              </button>
            ))
          ) : (
            <p>暂无其他页面引用</p>
          )}
        </div>
        <section className="wiki-evidence" aria-label="来源与证据">
          <h2>来源与证据 · {node.sources.length}</h2>
          {node.sources.map((source) => (
            <details key={source.id}>
              <summary>
                {source.kind === "rss"
                  ? "RSS 摘要"
                  : source.kind === "paper"
                    ? "外部论文"
                    : source.kind === "blog"
                      ? "站内博客"
                      : "引用资料"}{" "}
                · {source.title}
              </summary>
              <p>{source.locator}</p>
              <blockquote>{source.excerpt}</blockquote>
              <a
                href={source.url}
                target={source.url.startsWith("https:") ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                打开来源 ↗
              </a>
            </details>
          ))}
          {!node.sources.length && (
            <p>当前没有足够直接资料；不据此生成个人观点或实验结论。</p>
          )}
        </section>
        <InventoryText text="相关 Blog" color="#55ffff" />
        {node.relatedBlogs.length ? (
          node.relatedBlogs.map((r) => (
            <a key={r.id} href={`#blog/${encodeURIComponent(r.id)}`}>
              <BlogText text={r.title} width={240} color="#55ffff" />
            </a>
          ))
        ) : (
          <InventoryText text="暂无关联" color="#aaa" />
        )}
        <InventoryText text="相关 Paper" color="#55ffff" />
        {node.relatedPapers.length ? (
          node.relatedPapers.map((r) => (
            <a key={r.id} href={`#paper/${encodeURIComponent(r.id)}`}>
              <BlogText text={r.title} width={240} color="#55ffff" />
            </a>
          ))
        ) : (
          <InventoryText text="暂无关联" color="#aaa" />
        )}
        {!!node.relatedSources?.length && (
          <>
            <InventoryText text="相关 RSS" color="#55ffff" />
            {node.relatedSources.map((r) => (
              <a key={r.id} href={`#rss/${encodeURIComponent(r.id)}`}>
                <BlogText text={r.title} width={240} color="#55ffff" />
              </a>
            ))}
          </>
        )}
        <BlogText text={node.tags.join(" · ")} width={240} color="#aaa" />
        <BlogText
          text={`文件：${node.file} · 学习进度未记录`}
          width={240}
          color="#aaa"
        />
      </div>
      <MinecraftButton autoFocus aria-label="关闭知识详情" onClick={close}>
        <InventoryText text="关闭" />
      </MinecraftButton>
    </aside>
  );
}

import type { WikiNodeData } from "../../models/WikiNode";
import { InventoryText } from "../InventoryText";
import { BlogText } from "../blog/BlogText";
import { MinecraftButton } from "../MinecraftButton";
export function WikiDetailPanel({
  node,
  close,
}: {
  node: WikiNodeData;
  close: () => void;
}) {
  return (
    <aside
      className="wiki-detail"
      role="dialog"
      aria-label={`${node.title} 详情`}
    >
      <header>
        <img src={node.icon} alt="" />
        <BlogText text={node.title} width={160} color="#ffff55" />
      </header>
      <div className="wiki-detail-scroll">
        <BlogText text={node.details} width={170} />
        <InventoryText text="学习要点" color="#55ffff" />
        {node.learningPoints.map((p, i) => (
          <BlogText key={i} text={`${i + 1}. ${p}`} width={170} />
        ))}
        <InventoryText text="相关 Blog" color="#55ffff" />
        {node.relatedBlogs.length ? (
          node.relatedBlogs.map((r) => (
            <BlogText key={r.id} text={r.title} width={170} />
          ))
        ) : (
          <InventoryText text="暂无关联" color="#aaa" />
        )}
        <InventoryText text="相关 Paper" color="#55ffff" />
        {node.relatedPapers.length ? (
          node.relatedPapers.map((r) => (
            <BlogText key={r.id} text={r.title} width={170} />
          ))
        ) : (
          <InventoryText text="暂无关联" color="#aaa" />
        )}
        <BlogText text={node.tags.join(" · ")} width={170} color="#aaa" />
        <InventoryText text="示例目录 · 非个人学习记录" color="#aaa" />
      </div>
      <MinecraftButton autoFocus aria-label="关闭知识详情" onClick={close}>
        <InventoryText text="关闭" />
      </MinecraftButton>
    </aside>
  );
}

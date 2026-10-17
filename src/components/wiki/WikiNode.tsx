import type { WikiNodeData } from "../../models/WikiNode";
import { InventoryText } from "../InventoryText";
import { BlogText } from "../blog/BlogText";
export function WikiNode({
  node,
  matched,
  dimmed,
  open,
  hover,
}: {
  node: WikiNodeData;
  matched: boolean;
  dimmed: boolean;
  open: (n: WikiNodeData) => void;
  hover: (n: WikiNodeData | null, element: HTMLElement) => void;
}) {
  return (
    <button
      className={`wiki-node ${matched ? "wiki-matched" : ""} ${dimmed ? "wiki-dimmed" : ""}`}
      aria-label={`知识点：${node.title}`}
      data-node-id={node.id}
      style={{
        left: node.x,
        top: node.y,
        backgroundImage: `url(/assets/inventory/wiki-${node.frame}-${node.status === "completed" ? "obtained" : "unobtained"}.png)`,
      }}
      onClick={() => open(node)}
      onPointerEnter={(e) => hover(node, e.currentTarget)}
      onPointerLeave={(e) => hover(null, e.currentTarget)}
      onFocus={(e) => hover(node, e.currentTarget)}
      onBlur={(e) => hover(null, e.currentTarget)}
    >
      <img src={node.icon} alt="" />
      <span className="wiki-node-label">
        <BlogText text={node.title} width={96} />
      </span>
    </button>
  );
}
export function WikiTooltip({
  node,
  x,
  y,
}: {
  node: WikiNodeData;
  x: number;
  y: number;
}) {
  return (
    <aside role="tooltip" className="wiki-tooltip" style={{ left: x, top: y }}>
      <BlogText text={node.title} width={190} color="#ffff55" />
      <BlogText text={node.description} width={190} />
      <InventoryText
        text={`${node.category} · ${node.status === "completed" ? "已完成" : node.status === "planned" ? "待学习" : "知识条目"}`}
        color="#aaa"
      />
      <InventoryText
        text={`Blog ${node.relatedBlogs.length} · Paper ${node.relatedPapers.length}`}
        color="#55ffff"
      />
    </aside>
  );
}

import { useEffect, useRef, useState } from "react";
import type { WikiCategory, WikiNodeData } from "../../models/WikiNode";
import { WikiNode, WikiTooltip } from "./WikiNode";
import { wikiBranches } from "./WikiTabs";
export function WikiTree({
  nodes,
  category,
  scale,
  matches,
  query,
  focusId,
  resetKey,
  open,
  detailOpen,
}: {
  detailOpen: boolean;
  nodes: WikiNodeData[];
  category: WikiCategory;
  scale: number;
  matches: Set<string>;
  query: string;
  focusId?: string;
  resetKey: number;
  open: (n: WikiNodeData) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 16, y: 0, zoom: 0.85 });
  const [tip, setTip] = useState<{
    node: WikiNodeData;
    x: number;
    y: number;
  } | null>(null);
  const drag = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const mapWidth = Math.max(700, ...nodes.map((n) => n.x + 130));
  const mapHeight = Math.max(330, ...nodes.map((n) => n.y + 110));
  useEffect(() => {
    setView({ x: 16, y: 0, zoom: 0.85 });
    setTip(null);
  }, [category, resetKey]);
  useEffect(() => {
    const n = nodes.find((n) => n.id === focusId);
    if (n && host.current) {
      const r = host.current.getBoundingClientRect();
      setView((v) => ({
        ...v,
        x: r.width / scale / 2 - (n.x + 13) * v.zoom,
        y: r.height / scale / 2 - (n.y + 13) * v.zoom,
      }));
      setTip(null);
    }
  }, [focusId, nodes, scale, resetKey]);
  useEffect(() => {
    const el = host.current!;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setTip(null);
      const r = el.getBoundingClientRect(),
        px = (e.clientX - r.left) / scale,
        py = (e.clientY - r.top) / scale;
      setView((v) => {
        const zoom = Math.max(
          0.55,
          Math.min(1.6, v.zoom * Math.exp(-e.deltaY * 0.001)),
        );
        return {
          zoom,
          x: px - ((px - v.x) * zoom) / v.zoom,
          y: py - ((py - v.y) * zoom) / v.zoom,
        };
      });
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [scale]);
  useEffect(() => {
    if (detailOpen) setTip(null);
  }, [detailOpen]);
  const hover = (node: WikiNodeData | null, element: HTMLElement) => {
    if (!node || detailOpen) {
      setTip(null);
      return;
    }
    const r = element.getBoundingClientRect(),
      v = host.current!.getBoundingClientRect();
    if (
      document.activeElement === element &&
      (r.left < v.left ||
        r.right > v.right ||
        r.top < v.top ||
        r.bottom > v.bottom)
    ) {
      setView((current) => ({
        ...current,
        x: v.width / scale / 2 - (node.x + 13) * current.zoom,
        y: v.height / scale / 2 - (node.y + 13) * current.zoom,
      }));
      setTip(null);
      return;
    }
    setTip({
      node,
      x: Math.max(4, Math.min(r.right - v.left + 6, v.width - 160 * scale)),
      y: Math.max(4, Math.min(r.top - v.top, v.height - 116 * scale)),
    });
  };
  const paths = nodes.flatMap((n) =>
    n.parentIds.map((id) => {
      const p = nodes.find((n) => n.id === id);
      if (!p) return null;
      const x = p.x + 26,
        y = p.y + 13,
        endX = n.x,
        endY = n.y + 13,
        middle = (x + endX) / 2;
      return (
        <path
          key={`${id}-${n.id}`}
          d={`M ${x} ${y} H ${middle} V ${endY} H ${endX}`}
        />
      );
    }),
  );
  return (
    <div
      id="wiki-tree"
      role="tabpanel"
      aria-label={`${category} 知识树`}
      className="wiki-tree"
      ref={host}
      tabIndex={0}
      style={{
        backgroundImage: `url(/assets/inventory/${wikiBranches.find((b) => b.id === category)!.background}.png)`,
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        const delta: { [k: string]: [number, number] } = {
          ArrowLeft: [20, 0],
          ArrowRight: [-20, 0],
          ArrowUp: [0, 20],
          ArrowDown: [0, -20],
        };
        if (delta[e.key]) {
          e.preventDefault();
          setView((v) => ({
            ...v,
            x: v.x + delta[e.key][0],
            y: v.y + delta[e.key][1],
          }));
        }
      }}
      onPointerDown={(e) => {
        if (e.button !== 0 || (e.target as Element).closest("button")) return;
        drag.current = {
          x: e.clientX,
          y: e.clientY,
          panX: view.x,
          panY: view.y,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        setTip(null);
      }}
      onPointerMove={(e) => {
        // React can evaluate queued state updates after pointerup/cancel has
        // cleared the ref. Capture the event's drag record before enqueueing.
        const activeDrag = drag.current;
        const { clientX, clientY } = e;
        if (activeDrag)
          setView((v) => ({
            ...v,
            x: Math.max(
              -mapWidth * v.zoom,
              Math.min(450, activeDrag.panX + (clientX - activeDrag.x) / scale),
            ),
            y: Math.max(
              -mapHeight * v.zoom,
              Math.min(250, activeDrag.panY + (clientY - activeDrag.y) / scale),
            ),
          }));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onLostPointerCapture={() => {
        drag.current = null;
      }}
    >
      <div
        className="wiki-map"
        data-view={`${view.x},${view.y},${view.zoom}`}
        style={{
          width: mapWidth,
          height: mapHeight,
          transform: `translate(${view.x * scale}px,${view.y * scale}px) scale(${view.zoom * scale})`,
        }}
      >
        <svg
          width={mapWidth}
          height={mapHeight}
          className="wiki-connections"
          aria-hidden="true"
        >
          <g className="wiki-line-outline">{paths}</g>
          <g className="wiki-line-inner">{paths}</g>
        </svg>
        {nodes.map((n) => (
          <WikiNode
            key={n.id}
            node={n}
            matched={!!query && matches.has(n.id)}
            dimmed={!!query && !matches.has(n.id)}
            open={open}
            hover={hover}
          />
        ))}
      </div>
      {tip && <WikiTooltip {...tip} />}
    </div>
  );
}

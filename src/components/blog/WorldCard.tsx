import type { BlogWorld } from "../../models/BlogWorld";
import { WorldCover } from "./WorldCover";
import { audioManager } from "../../managers/AudioManager";
import { BlogText } from "./BlogText";
export function WorldCard({
  world,
  selected,
  select,
  enter,
}: {
  world: BlogWorld;
  selected: boolean;
  select: () => void;
  enter: () => void;
}) {
  const open = () => {
    audioManager.click();
    enter();
  };
  return (
    <div
      role="option"
      aria-label={world.title}
      aria-selected={selected}
      tabIndex={0}
      className={`world-card ${selected ? "selected" : ""}`}
      onClick={select}
      onDoubleClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          open();
        }
        if (e.key === " ") {
          e.preventDefault();
          select();
        }
      }}
    >
      <div className="world-cover">
        <WorldCover image={world.image} label={world.iconLabel} />
        <button
          type="button"
          className="world-enter"
          aria-label={`进入世界：${world.title}`}
          onClick={(event) => {
            event.stopPropagation();
            open();
          }}
          onDoubleClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ")
              event.stopPropagation();
          }}
        >
          <span className="world-enter-glyph" aria-hidden="true" />
        </button>
      </div>
      <div className="world-summary">
        <BlogText text={world.title} width={265} />
        <BlogText
          text={`${world.createTime.replaceAll("-", "/")} · ${world.category}${world.seriesIndex ? ` · ${String(world.seriesIndex).padStart(2, "0")}/21` : ""}`}
          width={265}
          color="#808080"
        />
        <BlogText
          text={
            world.status === "draft"
              ? "创造模式 · 学习笔记草稿 · 待审阅"
              : "创造模式 · 版本: Mineblogcraft 1.0"
          }
          width={265}
          color="#808080"
        />
        <BlogText text={world.description} width={265} color="#aaa" />
      </div>
    </div>
  );
}

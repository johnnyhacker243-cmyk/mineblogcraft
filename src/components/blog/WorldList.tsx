import type { BlogWorld } from "../../models/BlogWorld";
import { WorldCard } from "./WorldCard";
export function WorldList({
  worlds,
  selected,
  select,
  enter,
}: {
  worlds: BlogWorld[];
  selected: string | null;
  select: (id: string) => void;
  enter: (world: BlogWorld) => void;
}) {
  return (
    <div className="world-list" role="listbox" aria-label="博客世界列表">
      {worlds.map((world) => (
        <WorldCard
          key={world.id}
          world={world}
          selected={world.id === selected}
          select={() => select(world.id)}
          enter={() => enter(world)}
        />
      ))}
    </div>
  );
}

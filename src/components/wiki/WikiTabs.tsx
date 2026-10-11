import type { WikiCategory } from "../../models/WikiNode";
import { InventoryText } from "../InventoryText";
import { audioManager } from "../../managers/AudioManager";
export const wikiBranches: {
  id: WikiCategory;
  label: string;
  icon: string;
  background: string;
}[] = [
  { id: "AI", label: "AI", icon: "enchanted-book", background: "wiki-stone" },
  {
    id: "Security",
    label: "Security",
    icon: "compass",
    background: "wiki-nether",
  },
  {
    id: "Software",
    label: "Software",
    icon: "crafting-top",
    background: "wiki-stone",
  },
  {
    id: "Modeling",
    label: "Modeling",
    icon: "clock",
    background: "wiki-husbandry",
  },
];
export function WikiTabs({
  category,
  select,
}: {
  category: WikiCategory;
  select: (c: WikiCategory) => void;
}) {
  return (
    <div className="wiki-tabs" role="tablist" aria-label="知识分支">
      {wikiBranches.map((b) => (
        <button
          key={b.id}
          role="tab"
          aria-selected={category === b.id}
          aria-controls="wiki-tree"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const index = wikiBranches.findIndex(
                (branch) => branch.id === b.id,
              );
              const next =
                (index +
                  (e.key === "ArrowRight" ? 1 : -1) +
                  wikiBranches.length) %
                wikiBranches.length;
              select(wikiBranches[next].id);
              const buttons =
                e.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>(
                  "button",
                );
              buttons[next].focus();
            }
          }}
          onClick={() => {
            audioManager.click();
            select(b.id);
          }}
        >
          <img src={`/assets/inventory/${b.icon}.png`} alt="" />
          <InventoryText
            text={b.label}
            color={category === b.id ? "#ffff55" : "#fff"}
          />
        </button>
      ))}
    </div>
  );
}

import { InventoryText } from "../InventoryText";
import { StatusTooltip } from "./StatusTooltip";
import { audioManager } from "../../managers/AudioManager";
export function StatusItem({
  title,
  summary,
  index,
  selected,
  onClick,
}: {
  title: string;
  summary: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="status-item"
      aria-label={title}
      aria-pressed={selected}
      onClick={() => {
        audioManager.click();
        onClick();
      }}
    >
      <span className="status-level">
        <img src={`/assets/inventory/enchant-level-${index}.png`} alt="" />
      </span>
      <span className="status-item-copy">
        <InventoryText shadow={false} text={title} color="#fff4cf" />
        <InventoryText shadow={false} text={summary} color="#dcce9e" />
      </span>
      <span className="status-rune">
        <InventoryText shadow={false} text="III" color="#8bfa44" />
      </span>
      <StatusTooltip title={title} description="点击查看构建与内容信息" />
    </button>
  );
}

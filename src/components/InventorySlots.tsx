import { useId } from "react";
import { inventoryAssets, profile } from "../config/profile-config";
import { InventoryText } from "./InventoryText";
import { DragonEggIcon } from "./DragonEggIcon";
export function BlockIcon({
  top,
  side,
  grass = false,
}: {
  top: string;
  side: string;
  grass?: boolean;
}) {
  const tintId = useId();
  return (
    <svg className="block-icon" viewBox="0 0 16 18" aria-hidden="true">
      <defs>
        <filter id={tintId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.486 0 0 0 0  0 0.682 0 0 0  0 0 0.271 0 0  0 0 0 1 0"
          />
        </filter>
      </defs>
      {/* Each face shares exact vertices; independent CSS skew offsets left gaps. */}
      <path d="M8 1 16 5 16 13 8 17 0 13 0 5Z" fill="#54432b" />
      <image
        href={inventoryAssets + top}
        width="16"
        height="16"
        transform="matrix(.5 .25 -.5 .25 8 1)"
        filter={grass ? `url(#${tintId})` : undefined}
      />
      <image
        href={inventoryAssets + side}
        width="16"
        height="16"
        transform="matrix(.5 .25 0 .5 0 5)"
        style={{ filter: "brightness(0.7)" }}
      />
      <image
        href={inventoryAssets + side}
        width="16"
        height="16"
        transform="matrix(.5 -.25 0 .5 8 9)"
        style={{ filter: "brightness(0.85)" }}
      />
    </svg>
  );
}
export function ItemIcon({ index }: { index: number }) {
  if (index === 0)
    return <BlockIcon top="grass.png" side="grass-side.png" grass />;
  if (index === 3) return <BlockIcon top="tnt-top.png" side="tnt-side.png" />;
  if (index === 6)
    return <BlockIcon top="crafting-top.png" side="crafting-side.png" />;
  if (index === 9) return <DragonEggIcon />;
  if (index === 7 || index === 8)
    return (
      <img
        className="item-icon"
        src={inventoryAssets + (index === 7 ? "torch.png" : "redstone.png")}
        alt=""
      />
    );
  return (
    <img
      className="item-icon"
      src={
        inventoryAssets +
        [
          "",
          "pickaxe.png",
          "sword.png",
          "",
          "golden-apple.png",
          "ender-pearl.png",
        ][index]
      }
      alt=""
    />
  );
}
export function InventorySlots() {
  return (
    <div className="item-slots" role="list" aria-label="玩家技能栏">
      {profile.skills.map((skill) => (
        <div
          className="inventory-slot"
          key={skill}
          role="listitem"
          tabIndex={0}
          aria-label={skill}
        >
          <InventoryText text={skill} />
        </div>
      ))}
    </div>
  );
}

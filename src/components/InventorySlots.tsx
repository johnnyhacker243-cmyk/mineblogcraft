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
  return (
    <span className="block-icon" aria-hidden="true">
      <i
        className={grass ? "grass-tint" : ""}
        style={{ backgroundImage: `url(${inventoryAssets + top})` }}
      />
      <i style={{ backgroundImage: `url(${inventoryAssets + side})` }} />
      <i style={{ backgroundImage: `url(${inventoryAssets + side})` }} />
    </span>
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

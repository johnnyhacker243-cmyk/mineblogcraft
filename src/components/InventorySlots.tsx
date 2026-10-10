import { inventoryAssets, profile } from "../config/profile-config";
import { InventoryText } from "./InventoryText";
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
  if (index === 1) return <BlockIcon top="blue-ice.png" side="blue-ice.png" />;
  if (index === 2)
    return <BlockIcon top="crafting-top.png" side="crafting-side.png" />;
  return (
    <img
      className="item-icon"
      src={
        inventoryAssets +
        [
          "book.png",
          "redstone.png",
          "compass.png",
          "pickaxe.png",
          "book.png",
          "redstone.png",
        ][index - 3]
      }
      alt=""
    />
  );
}
export function InventorySlots() {
  return (
    <>
      <div className="item-slots" aria-label="物品栏">
        {profile.modules.map((label, index) => (
          <div className="inventory-slot" key={label}>
            <ItemIcon index={index} />
          </div>
        ))}
      </div>
      <div className="text-slots" aria-label="技术与内容方向">
        {profile.modules.map((label) => (
          <div className="inventory-slot text-slot" key={label}>
            <InventoryText text={label} color="#303030" shadow={false} />
          </div>
        ))}
      </div>
    </>
  );
}

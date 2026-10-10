import { inventoryAssets } from "../config/profile-config";
import { PixelText } from "./PixelText";
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
  if (index === 7)
    return (
      <img
        className="item-icon"
        src={inventoryAssets + "nether-star.png"}
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
    <div className="item-slots" aria-label="快捷物品栏">
      {Array.from({ length: 9 }, (_, index) => (
        <div
          className="inventory-slot"
          key={index}
          aria-label={index === 0 ? "钻石镐" : "钻石 × 64"}
        >
          <img
            className="item-icon"
            src={
              inventoryAssets + (index === 0 ? "pickaxe.png" : "diamond.png")
            }
            alt=""
          />
          {index > 0 && (
            <span className="item-count">
              <PixelText text="64" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

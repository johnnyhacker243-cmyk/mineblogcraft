import { BlockIcon } from "../InventorySlots";
import { inventoryAssets } from "../../config/profile-config";
export function RSSServerIcon({ icon }: { icon: string }) {
  if (icon === "grass")
    return <BlockIcon top="grass.png" side="grass-side.png" grass />;
  if (icon === "crafting-table")
    return <BlockIcon top="crafting-top.png" side="crafting-side.png" />;
  const textures: Record<string, string> = {
    "ender-pearl": "ender-pearl.png",
    shield: "shield-slot.png",
    redstone: "redstone.png",
    "enchanted-book": "enchanted-book.png",
    compass: "compass.png",
    repeater: "repeater.png",
    torch: "torch.png",
    pickaxe: "pickaxe.png",
  };
  return <img src={inventoryAssets + (textures[icon] ?? "book.png")} alt="" />;
}

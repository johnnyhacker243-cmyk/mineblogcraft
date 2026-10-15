import { BlockIcon } from "../InventorySlots";
export function WorldCover({
  image,
  label = "",
}: {
  image: string;
  label?: string;
}) {
  return image === "/assets/inventory/grass-border.png" ? (
    <BlockIcon top="grass.png" side="grass-side.png" grass />
  ) : (
    <img
      src={image}
      alt={label}
      onError={(e) => {
        if (e.currentTarget.src.endsWith("/assets/inventory/grass-border.png"))
          return;
        e.currentTarget.src = "/assets/inventory/grass-border.png";
        e.currentTarget.onerror = null;
      }}
    />
  );
}

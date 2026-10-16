import { inventoryAssets } from "../../config/profile-config";
import registry from "../../../config/rssIcons.json";
export function RSSServerIcon({ icon }: { icon: string }) {
  const item = (registry as Record<string, { label: string; reason: string }>)[
    icon
  ];
  return (
    <img
      src={
        inventoryAssets +
        (item ? `rss-icons/${icon}.png` : "rss-icons/writable_book.png")
      }
      alt={item?.label ?? "书与笔"}
      title={item ? `${item.label} · ${item.reason}` : "原版书与笔"}
      onError={(event) => {
        const image = event.currentTarget;
        if (image.src.endsWith("/book.png")) return;
        image.onerror = null;
        image.src = inventoryAssets + "book.png";
        image.alt = "原版书本（备用图标）";
      }}
    />
  );
}

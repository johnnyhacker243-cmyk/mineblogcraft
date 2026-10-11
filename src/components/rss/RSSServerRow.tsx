import type { RSSServer } from "../../models/RSSServer";
import { RSSServerIcon } from "./RSSServerIcon";
import { BlogText } from "../blog/BlogText";
import { InventoryText } from "../InventoryText";
import { inventoryAssets } from "../../config/profile-config";
export function RSSServerRow({
  server,
  selected,
  onSelect,
}: {
  server: RSSServer;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`rss-server ${selected ? "selected" : ""}`}
      role="option"
      aria-label={server.name}
      aria-selected={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="rss-server-icon">
        <RSSServerIcon icon={server.icon} />
      </div>
      <div className="rss-server-copy">
        <BlogText text={server.name} width={215} />
        <BlogText text={server.description} width={215} color="#aaa" />
        <BlogText text={server.tags.join(" · ")} width={215} color="#808080" />
      </div>
      <div className="rss-server-status">
        <InventoryText
          text={server.status.toUpperCase()}
          color={server.status === "online" ? "#55ff55" : "#ff5555"}
        />
        <InventoryText
          text={server.lastUpdate.replaceAll("-", "/")}
          color="#aaa"
        />
        <img
          className="rss-ping"
          src={
            inventoryAssets +
            (server.status === "online" ? "ping-5.png" : "ping-1.png")
          }
          alt={server.status === "online" ? "示例信号：强" : "示例信号：弱"}
        />
      </div>
    </div>
  );
}

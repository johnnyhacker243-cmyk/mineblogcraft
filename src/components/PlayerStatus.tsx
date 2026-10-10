import { inventoryAssets } from "../config/profile-config";
export function PlayerStatus() {
  return (
    <div className="player-status" aria-label="玩家状态">
      <div className="status-hearts" role="img" aria-label="血量：20 / 20">
        {Array.from({ length: 10 }, (_, i) => (
          <span className="status-icon" key={i}>
            <img src={inventoryAssets + "heart-container.png"} alt="" />
            <img src={inventoryAssets + "heart-full.png"} alt="" />
          </span>
        ))}
      </div>
      <div className="status-food" role="img" aria-label="饱食度：20 / 20">
        {Array.from({ length: 10 }, (_, i) => (
          <span className="status-icon" key={i}>
            <img src={inventoryAssets + "food-empty.png"} alt="" />
            <img src={inventoryAssets + "food-full.png"} alt="" />
          </span>
        ))}
      </div>
    </div>
  );
}

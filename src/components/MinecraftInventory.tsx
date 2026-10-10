import { useEffect, useState, type CSSProperties } from "react";
import { inventoryAssets, profile } from "../config/profile-config";
import { assets } from "../config/assets-config";
import { ItemIcon, InventorySlots } from "./InventorySlots";
import { InventoryText } from "./InventoryText";
import { ProfilePanel } from "./ProfilePanel";
import { SignBoard } from "./SignBoard";
import { PlayerModel } from "./PlayerModel";
import "../styles/inventory.css";
export function MinecraftInventory() {
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  useEffect(() => {
    const resize = () => setSize({ width: innerWidth, height: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const scale = Math.max(
    1,
    Math.min(
      profile.layout.maxScale,
      Math.floor(
        Math.min(
          size.width / (profile.layout.width + 20),
          size.height / (profile.layout.height + 16),
        ),
      ),
    ),
  );
  return (
    <main
      className="inventory-screen"
      aria-label="Mineblogcraft 作者介绍"
      style={{ "--inventory-scale": scale } as CSSProperties}
    >
      <div className="inventory-scene" data-inventory-scale={scale}>
        <header className="inventory-brand">
          <img src={assets.logo} alt="Mineblogcraft" />
        </header>
        <div className="inventory-tabs" aria-label="创造模式分类装饰">
          {["自然方块", "建筑方块", "功能方块", "书与知识", "红石", "工具"].map(
            (name, index) => (
              <div
                key={name}
                className="inventory-tab"
                title={name}
                style={{
                  backgroundImage: `url(${inventoryAssets}tab-${index + 1}.png)`,
                }}
              >
                <ItemIcon index={index} />
              </div>
            ),
          )}
        </div>
        <section className="inventory-frame">
          <div className="player-panel">
            <div className="player-viewport">
              <PlayerModel />
            </div>
            <div className="player-caption">
              <InventoryText text="STEVE" />
              <InventoryText text="DIAMOND ARMOR" color="#55ffff" />
            </div>
          </div>
          <ProfilePanel />
          <InventorySlots />
        </section>
        <SignBoard />
      </div>
    </main>
  );
}

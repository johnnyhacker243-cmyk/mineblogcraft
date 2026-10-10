import { useEffect, useState, type CSSProperties } from "react";
import { inventoryAssets, profile } from "../config/profile-config";
import { assets } from "../config/assets-config";
import { ItemIcon, InventorySlots } from "./InventorySlots";
import { InventoryText } from "./InventoryText";
import { ProfilePanel } from "./ProfilePanel";
import { PlayerModel } from "./PlayerModel";
import { PlayerStatus } from "./PlayerStatus";
import { MinecraftButton } from "./MinecraftButton";
import "../styles/inventory.css";
export function MinecraftInventory({ back }: { back: () => void }) {
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
          (size.width - 2 * profile.layout.borderTile) / profile.layout.width,
          (size.height - 2 * profile.layout.borderTile) / profile.layout.height,
        ),
      ),
    ),
  );
  return (
    <main
      className="inventory-screen"
      aria-label="Mineblogcraft 作者介绍"
      style={
        {
          "--inventory-scale": scale,
          "--hud-scale": scale + 1,
          "--scene-width": `${Math.max(390, size.width - 2 * profile.layout.borderTile)}px`,
          "--scene-height": `${Math.max(238, size.height - 2 * profile.layout.borderTile)}px`,
        } as CSSProperties
      }
    >
      <div className="inventory-scene" data-inventory-scale={scale}>
        <header className="inventory-brand">
          <img src={assets.logo} alt="Mineblogcraft" />
        </header>
        <div className="inventory-tabs" aria-label="创造模式分类装饰">
          {profile.tabs.map((name, index) => (
            <div
              key={name}
              className="inventory-tab"
              title={name}
              style={{
                backgroundImage: `url(${inventoryAssets}tab-${index === 0 ? 1 : 2}.png)`,
              }}
            >
              <ItemIcon index={index} />
            </div>
          ))}
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
          <section className="website-introduction" aria-label="网站介绍">
            <div className="website-copy">
              {profile.introduction.map((line) => (
                <InventoryText
                  key={line}
                  text={line}
                  color="#404040"
                  shadow={false}
                />
              ))}
            </div>
          </section>
          <PlayerStatus />
          <InventorySlots />
        </section>
        <MinecraftButton
          className="inventory-back"
          aria-label="返回目录"
          onClick={back}
        >
          <InventoryText text="返回" />
        </MinecraftButton>
      </div>
    </main>
  );
}

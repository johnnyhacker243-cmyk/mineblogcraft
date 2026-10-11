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
  const margin =
    size.height < 800 || size.width < 1200 ? 24 : profile.layout.borderTile;
  const sceneWidth = Math.max(360, size.width - 2 * margin);
  const sceneHeight = Math.max(520, size.height - 2 * margin);
  const scale = Math.max(
    size.width >= 720 ? 2 : 1,
    Math.min(
      profile.layout.maxScale,
      Math.floor(
        Math.min(
          sceneWidth / profile.layout.width,
          sceneHeight / profile.layout.height,
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
          "--header-scale": scale,
          "--hud-scale": scale,
          "--tab-scale": Math.max(
            1,
            Math.min(scale, Math.floor((sceneWidth - 200 * scale - 16) / 270)),
          ),
          "--scene-width": `${sceneWidth}px`,
          "--scene-height": `${sceneHeight}px`,
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
          <div className="inventory-details">
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
          </div>
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
          <div className="inventory-hud">
            <PlayerStatus />
            <InventorySlots />
          </div>
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

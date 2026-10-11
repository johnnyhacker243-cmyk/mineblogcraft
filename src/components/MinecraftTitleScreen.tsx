import { useEffect, useState } from "react";
import { PanoramaRenderer } from "./PanoramaRenderer";
import { MainMenuScreen } from "../screens/MainMenuScreen";
import { SecondaryScreen, type Settings } from "../screens/SecondaryScreens";
import { guiMetrics } from "../utils/gui-scale";
import { guiStyle } from "../utils/gui-style";
import { type ScreenId } from "../config/ui-config";
import { audioManager } from "../managers/AudioManager";
import { MinecraftInventory } from "./MinecraftInventory";
import { BlogWorldSelect } from "../screens/BlogWorldSelect";
import { MineRSSScreen } from "../screens/MineRSSScreen";
import { MineResearchPage } from "../screens/MineResearchPage";
export function MinecraftTitleScreen() {
  const [screen, setScreen] = useState<ScreenId>(
    location.hash.startsWith("#blog/") ? "worlds" : "main",
  );
  const [settings, setSettings] = useState<Settings>({
    volume: 0.5,
    dynamic: true,
    guiScale: 0,
    muted: false,
    reducedMotion: false,
  });
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  useEffect(() => {
    const resize = () => setSize({ width: innerWidth, height: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setScreen("main");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    audioManager.setVolume(settings.volume);
    audioManager.muted = settings.muted;
  }, [settings.volume, settings.muted]);
  useEffect(() => () => audioManager.dispose(), []);
  const m = guiMetrics(size.width, size.height, settings.guiScale);
  return (
    <div
      className={`game ${settings.reducedMotion ? "reduced-motion" : ""}`}
      style={guiStyle(m, size)}
      data-gui-scale={m.scale}
      data-screen={screen}
    >
      <PanoramaRenderer
        dynamic={
          screen !== "profile" &&
          screen !== "multiplayer" &&
          settings.dynamic &&
          !settings.reducedMotion
        }
      />
      <div className="gui">
        {screen === "main" ? (
          <MainMenuScreen navigate={setScreen} />
        ) : screen === "profile" ? (
          <MinecraftInventory back={() => setScreen("main")} />
        ) : screen === "worlds" ? (
          <BlogWorldSelect back={() => setScreen("main")} />
        ) : screen === "multiplayer" ? (
          <MineRSSScreen back={() => setScreen("main")} />
        ) : screen === "realms" ? (
          <MineResearchPage back={() => setScreen("main")} />
        ) : (
          <SecondaryScreen
            screen={screen}
            settings={settings}
            update={(s) => setSettings((prev) => ({ ...prev, ...s }))}
            back={() => setScreen("main")}
          />
        )}
      </div>
    </div>
  );
}

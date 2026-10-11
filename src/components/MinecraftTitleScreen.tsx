import { useEffect, useState, useRef } from "react";
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
import { MineWikiPage } from "../screens/MineWikiPage";
import { MineResearchPage } from "../screens/MineResearchPage";
import { MineStatusPage } from "../screens/MineStatusPage";
import { MineWorldPage } from "../screens/MineWorldPage";
import { worldConfig, type WorldPose } from "../config/world-config";
export function MinecraftTitleScreen({
  onBackgroundReady,
}: {
  onBackgroundReady?: () => void;
}) {
  const [screen, setScreen] = useState<ScreenId>(
    location.hash.startsWith("#blog/") ? "worlds" : "main",
  );
  const worldPose = useRef<WorldPose>({ ...worldConfig.spawn });
  const [fromWorld, setFromWorld] = useState(false);
  const moduleBack = () => setScreen(fromWorld ? "mineworld" : "main");
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
      if (e.key === "Escape") setScreen(fromWorld ? "mineworld" : "main");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [fromWorld]);
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
        onSettled={onBackgroundReady}
        suspended={screen === "mineworld"}
        dynamic={
          screen !== "profile" &&
          screen !== "mineworld" &&
          settings.dynamic &&
          !settings.reducedMotion
        }
      />
      <div className="gui">
        {screen === "main" ? (
          <MainMenuScreen
            navigate={(id) => {
              setFromWorld(false);
              setScreen(id);
            }}
          />
        ) : screen === "mineworld" ? (
          <MineWorldPage
            back={() => {
              setFromWorld(false);
              setScreen("main");
            }}
            navigate={(id) => {
              setFromWorld(true);
              setScreen(id);
            }}
            pose={worldPose.current}
            savePose={(pose) => {
              worldPose.current = pose;
            }}
          />
        ) : screen === "profile" ? (
          <MinecraftInventory back={moduleBack} />
        ) : screen === "worlds" ? (
          <BlogWorldSelect back={moduleBack} />
        ) : screen === "multiplayer" ? (
          <MineRSSScreen back={moduleBack} />
        ) : screen === "wiki" ? (
          <MineWikiPage back={moduleBack} />
        ) : screen === "status" ? (
          <MineStatusPage back={moduleBack} />
        ) : screen === "realms" ? (
          <MineResearchPage back={moduleBack} />
        ) : (
          <SecondaryScreen
            screen={screen}
            settings={settings}
            update={(s) => setSettings((prev) => ({ ...prev, ...s }))}
            back={moduleBack}
          />
        )}
      </div>
    </div>
  );
}

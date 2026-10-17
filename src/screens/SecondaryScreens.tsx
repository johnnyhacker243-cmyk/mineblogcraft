import { MinecraftButton } from "../components/MinecraftButton";
import type { ScreenId } from "../config/ui-config";
export type Settings = {
  volume: number;
  dynamic: boolean;
  guiScale: number;
  muted: boolean;
  reducedMotion: boolean;
};
const titles = {
  worlds: "Select World",
  multiplayer: "Play Multiplayer",
  realms: "Minecraft Realms",
  options: "Options",
  exit: "Game closed",
  language: "Language",
  accessibility: "Accessibility Settings",
};
export function SecondaryScreen({
  screen,
  settings,
  update,
  back,
}: {
  screen: Exclude<
    ScreenId,
    "main" | "profile" | "wiki" | "status" | "mineworld"
  >;
  settings: Settings;
  update: (s: Partial<Settings>) => void;
  back: () => void;
}) {
  return (
    <section className="secondary" aria-label={titles[screen]}>
      <h1>{titles[screen]}</h1>
      <div className="secondary-content">
        {screen === "options" ? (
          <>
            <label className="volume">
              Sound volume: {Math.round(settings.volume * 100)}%
              <input
                aria-label="Sound volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.volume}
                onChange={(e) => update({ volume: Number(e.target.value) })}
              />
            </label>
            <MinecraftButton onClick={() => update({ muted: !settings.muted })}>
              Sound: {settings.muted ? "OFF" : "ON"}
            </MinecraftButton>
            <MinecraftButton
              onClick={() => update({ dynamic: !settings.dynamic })}
            >
              Panorama: {settings.dynamic ? "ON" : "OFF"}
            </MinecraftButton>
            <MinecraftButton
              onClick={() => update({ guiScale: (settings.guiScale + 1) % 5 })}
            >
              GUI Scale: {settings.guiScale || "Auto"}
            </MinecraftButton>
          </>
        ) : screen === "accessibility" ? (
          <MinecraftButton
            onClick={() => update({ reducedMotion: !settings.reducedMotion })}
          >
            Reduced Motion: {settings.reducedMotion ? "ON" : "OFF"}
          </MinecraftButton>
        ) : screen === "language" ? (
          <>
            <MinecraftButton disabled>English (US)</MinecraftButton>
            <p>界面使用中文与英文技术名称。</p>
          </>
        ) : (
          <>
            <p>
              {screen === "worlds"
                ? "请从 MineWorld 进入单机世界。"
                : screen === "multiplayer"
                  ? "请从 MineRSS 浏览订阅内容。"
                  : screen === "realms"
                    ? "请从 MineResearch 阅读论文。"
                    : "You can return to the title screen."}
            </p>
            {screen === "worlds" && (
              <MinecraftButton disabled>Create New World</MinecraftButton>
            )}
            {screen === "multiplayer" && (
              <MinecraftButton disabled>Add Server</MinecraftButton>
            )}
          </>
        )}
      </div>
      <MinecraftButton className="back-button" onClick={back}>
        Back
      </MinecraftButton>
    </section>
  );
}

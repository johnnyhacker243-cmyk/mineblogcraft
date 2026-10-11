import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  WorldViewport,
  type WorldControls,
} from "../components/world/WorldViewport";
import { InventoryText } from "../components/InventoryText";
import { MinecraftButton } from "../components/MinecraftButton";
import {
  worldConfig,
  type WorldPose,
  type WorldEntrance,
} from "../config/world-config";
import type { ScreenId } from "../config/ui-config";
import { audioManager } from "../managers/AudioManager";
import "../styles/world.css";
export function MineWorldPage({
  back,
  navigate,
  pose = worldConfig.spawn,
  savePose,
}: {
  back: () => void;
  navigate: (target: ScreenId) => void;
  pose?: WorldPose;
  savePose: (pose: WorldPose) => void;
}) {
  const [ready, setReady] = useState(false),
    [paused, setPaused] = useState(true),
    [error, setError] = useState(""),
    [nearby, setNearby] = useState<WorldEntrance | null>(null),
    [workshop, setWorkshop] = useState(false),
    [size, setSize] = useState({ w: innerWidth, h: innerHeight });
  const controls = useRef<WorldControls | null>(null);
  useEffect(() => {
    const resize = () => setSize({ w: innerWidth, h: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const start = () => {
    setPaused(false);
    controls.current?.enter();
  };
  const activate = () => {
    if (!nearby) return;
    audioManager.click();
    if (nearby.target) {
      if (document.pointerLockElement) document.exitPointerLock();
      navigate(nearby.target);
    } else {
      setWorkshop(true);
      setPaused(true);
      if (document.pointerLockElement) document.exitPointerLock();
    }
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        if (workshop) setWorkshop(false);
        else if (!paused) {
          setPaused(true);
          if (document.pointerLockElement) document.exitPointerLock();
        } else back();
      } else if (e.code === "KeyE" && !e.repeat && !paused) {
        e.preventDefault();
        activate();
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [paused, workshop, nearby, back, navigate]);
  const scale = Math.max(
    1,
    Math.min(4, Math.floor(Math.min(size.w / 480, size.h / 270))),
  );
  return (
    <main
      className="world-screen"
      aria-label="MineWorld 数字博物馆"
      style={
        {
          "--world-scale": scale,
          "--inventory-scale": scale,
          "--gui-scale-x": scale,
          "--gui-scale-y": scale,
          "--button-width": `${150 * scale}px`,
          "--button-height": `${20 * scale}px`,
        } as CSSProperties
      }
    >
      <WorldViewport
        active={ready && !paused && !workshop}
        pose={pose}
        onReady={(c) => {
          controls.current = c;
          setReady(true);
        }}
        onError={(message) => {
          setError(message);
          setPaused(true);
        }}
        onPause={() => setPaused(true)}
        onNearby={setNearby}
        onSave={savePose}
      />
      <header className="world-hud">
        <InventoryText text="MineWorld" />
        <InventoryText text="Mineblogcraft Digital Museum" color="#ffffaa" />
      </header>
      {!paused && (
        <>
          <span className="world-crosshair" aria-hidden="true" />
          <div className="world-controls">
            <InventoryText text="WASD 移动 · 鼠标观察 · E 交互 · Esc 暂停" />
            <InventoryText text="鼠标未锁定时，按住画面拖动观察" color="#aaa" />
          </div>
          {nearby && (
            <button
              className="world-interact"
              onClick={activate}
              aria-label={`进入 ${nearby.name}`}
            >
              <InventoryText text={nearby.name} color="#ffff55" />
              <InventoryText text={nearby.subtitle} />
              <InventoryText text="E / 点击 · 进入展区" color="#55ffff" />
            </button>
          )}
        </>
      )}
      {(paused || error) && (
        <div className="world-pause">
          <div className="world-menu">
            <h1>
              <InventoryText
                text={workshop ? "Project Workshop" : "MineWorld"}
              />
            </h1>
            {workshop ? (
              <>
                <InventoryText text="项目展示尚未开放" color="#ffff55" />
                <InventoryText text="本阶段先开放工作室建筑与参观。" />
                <MinecraftButton
                  aria-label="关闭工作室介绍"
                  onClick={() => setWorkshop(false)}
                >
                  <InventoryText text="关闭" />
                </MinecraftButton>
              </>
            ) : (
              <>
                <InventoryText
                  text={
                    error ||
                    (!ready
                      ? "正在构建你的数字博物馆..."
                      : "探索 Mineblogcraft 的知识世界")
                  }
                />
                <InventoryText
                  text="WASD 移动 · Shift 快走 · 鼠标观察"
                  color="#aaa"
                />
                <InventoryText
                  text="靠近展示台后按 E，打开对应模块。"
                  color="#aaa"
                />
                <MinecraftButton
                  disabled={!ready || !!error}
                  aria-label="开始探索"
                  onClick={start}
                >
                  <InventoryText text="开始 / 继续探索" />
                </MinecraftButton>
                <MinecraftButton
                  disabled={!ready || !!error}
                  aria-label="回到入口"
                  onClick={() => {
                    controls.current?.reset();
                  }}
                >
                  <InventoryText text="回到入口" />
                </MinecraftButton>
                <MinecraftButton aria-label="返回主菜单" onClick={back}>
                  <InventoryText text="返回主菜单" />
                </MinecraftButton>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

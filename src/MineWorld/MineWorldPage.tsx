import { useRef, useState } from "react";
import { MinecraftButton } from "../components/MinecraftButton";
import { InventoryText } from "../components/InventoryText";
import { GameContainer } from "./GameContainer";
import { LoadingScreen } from "./LoadingScreen";
import { useClassiCubeLoader } from "./ClassiCubeLoader";
import "./mineworld.css";
export function MineWorldPage({ back }: { back: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const container = useRef<HTMLElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [fullscreenError, setFullscreenError] = useState("");
  const { state, detail, notice } = useClassiCubeLoader(frame, attempt);
  return (
    <main
      ref={container}
      className="mineworld-game"
      aria-label="MineWorld Minecraft Classic"
      data-state={state}
    >
      <header className="mineworld-toolbar">
        <span>
          MineWorld <small>· ClassiCube</small>
        </span>
        <span className="mineworld-controls">
          WASD 移动 · 鼠标观察 · 空格跳跃 · 左键删除 · 右键放置 · Esc 释放鼠标
        </span>
        <MinecraftButton
          aria-label="游戏全屏"
          onClick={async () => {
            try {
              if (document.fullscreenElement) await document.exitFullscreen();
              else await container.current?.requestFullscreen();
            } catch {
              setFullscreenError("浏览器未允许全屏，可继续在窗口中游玩。");
            }
          }}
        >
          <InventoryText text="全屏" />
        </MinecraftButton>
        <MinecraftButton aria-label="返回主菜单" onClick={back}>
          <InventoryText text="返回" />
        </MinecraftButton>
      </header>
      <div className="mineworld-game-area">
        <GameContainer frame={frame} attempt={attempt} />
        {state !== "running" && (
          <LoadingScreen
            error={state === "error"}
            detail={detail}
            retry={() => setAttempt((value) => value + 1)}
          />
        )}
      </div>
      {(fullscreenError || notice) && (
        <p className="mineworld-notice" role="status">
          {fullscreenError || notice}
        </p>
      )}
    </main>
  );
}

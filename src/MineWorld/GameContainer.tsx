import type { RefObject } from "react";
import { gameConfig } from "./GameConfig";
export function GameContainer({
  frame,
  attempt,
}: {
  frame: RefObject<HTMLIFrameElement | null>;
  attempt: number;
}) {
  return (
    <iframe
      key={attempt}
      ref={frame}
      className="classicube-frame"
      src={`${gameConfig.clientUrl}?username=${encodeURIComponent(gameConfig.username)}`}
      title="ClassiCube · Minecraft Classic 单机世界"
      allow="fullscreen; autoplay"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads"
      allowFullScreen
    />
  );
}

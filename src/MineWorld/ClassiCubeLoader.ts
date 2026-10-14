import { useEffect, useState, type RefObject } from "react";
import { gameConfig, readGameMessage, type GameState } from "./GameConfig";
export function useClassiCubeLoader(
  frame: RefObject<HTMLIFrameElement | null>,
  attempt: number,
) {
  const [state, setState] = useState<GameState>("loading");
  const [detail, setDetail] = useState("Loading Minecraft...");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    setState("loading");
    setDetail("Loading Minecraft...");
    setNotice("");
    const started = performance.now();
    let readyTimer: ReturnType<typeof setTimeout> | undefined;
    let terminal = false;
    const timeout = setTimeout(() => {
      terminal = true;
      setState("error");
      setDetail("加载超时，请重试。");
    }, gameConfig.loadTimeoutMs);
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      if (
        event.data?.type === "mineworld:notice" &&
        typeof event.data.detail === "string"
      ) {
        setNotice(event.data.detail.slice(0, 300));
        return;
      }
      const message = readGameMessage(event.data);
      if (!message) return;
      if (message.state === "error") {
        terminal = true;
        clearTimeout(timeout);
        clearTimeout(readyTimer);
        setState("error");
        setDetail("游戏未能加载，请检查资源或重试。");
      } else if (terminal) return;
      else if (message.state === "running") {
        terminal = true;
        clearTimeout(timeout);
        readyTimer = setTimeout(
          () => setState("running"),
          Math.max(
            0,
            gameConfig.minimumLoadingMs - (performance.now() - started),
          ),
        );
      } else
        setDetail(
          message.detail.includes("filesystem")
            ? "Preparing Game..."
            : "Loading Minecraft...",
        );
    };
    window.addEventListener("message", receive);
    return () => {
      clearTimeout(timeout);
      clearTimeout(readyTimer);
      window.removeEventListener("message", receive);
    };
  }, [frame, attempt]);
  return { state, detail, notice };
}

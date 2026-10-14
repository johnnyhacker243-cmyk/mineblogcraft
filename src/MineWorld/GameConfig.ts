export const gameConfig = {
  clientUrl: "/vendor/classicube/index.html",
  username: "MineWorldPlayer",
  loadTimeoutMs: 90000,
  minimumLoadingMs: 650,
} as const;
export type GameState = "loading" | "running" | "error";
export function readGameMessage(
  data: unknown,
): { state: GameState; detail: string } | null {
  if (!data || typeof data !== "object") return null;
  const message = data as Record<string, unknown>;
  if (
    message.type !== "mineworld:state" ||
    !["loading", "running", "error"].includes(String(message.state))
  )
    return null;
  return {
    state: message.state as GameState,
    detail:
      typeof message.detail === "string" ? message.detail.slice(0, 300) : "",
  };
}

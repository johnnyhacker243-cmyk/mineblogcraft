export const bookAnimationConfig = {
  dim: 180,
  spawn: 320,
  hold: 200,
  opening: 900,
  settle: 140,
  perspective: 700,
} as const;
export type BookPhase =
  "idle" | "spawning" | "holding" | "opening" | "opened" | "reading";

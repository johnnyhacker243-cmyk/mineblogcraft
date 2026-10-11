export type ScreenId =
  | "main"
  | "mineworld"
  | "worlds"
  | "multiplayer"
  | "realms"
  | "wiki"
  | "options"
  | "status"
  | "exit"
  | "language"
  | "profile"
  | "accessibility";
export const ui = {
  brand: "Mineblogcraft — Personal Blog Edition",
  editionLabel: "Java Edition",
  logo: {
    width: 256,
    // Full 2172×724 transparent image, rather than a cropped game atlas.
    height: 256 / 3,
    textureHeight: 256 / 3,
    // Its visible lettering begins about 17 GUI units into the image.
    y: 13,
    subtitleWidth: 128,
    subtitleHeight: 14,
    subtitleTextureHeight: 16,
    subtitleY: 67,
  },
  button: { width: 200, height: 20, gap: 4, border: 3 },
  font: 8,
  shadow: 1,
  menuOffset: 48,
  lowerRowOffset: 84,
  fadeMs: 1000,
  splash: {
    x: 123,
    y: 69,
    angle: -20,
    periodMs: 1000,
    text: "Created by BingWang" as string | null,
  },
  version: "Mineblogcraft 1.22.1",
  copyright: "Copyright BingWang YTC. Do not distribute!",
} as const;
export const menu: { label: string; target: ScreenId }[] = [
  { label: "MineBlog", target: "worlds" },
  { label: "MineRSS", target: "multiplayer" },
  { label: "MineResearch", target: "realms" },
  { label: "MineWiki", target: "wiki" },
  { label: "MineStatus", target: "status" },
];
// Original replacement text, selected once per application session.
export const splashes = [
  "Built block by block!",
  "A local UI experiment!",
  "Six sides, one world!",
  "Keep on crafting!",
];

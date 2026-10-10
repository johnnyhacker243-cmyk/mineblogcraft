export const inventoryAssets = "/assets/inventory/";
export const profile = {
  name: "Mineblogcraft",
  identity: "个人开发者 / 技术探索者",
  interests: "AI · 网络安全 · 软件工程 · 数据分析",
  purpose: "一个 Minecraft 风格个人技术博客",
  biography: ["记录学习、实践、", "项目开发与技术探索"],
  tabs: [
    "草方块",
    "钻石镐",
    "钻石剑",
    "TNT",
    "金苹果",
    "末影珍珠",
    "工作台",
    "下界之星",
  ],
  introduction: [
    "这是一个 Minecraft 风格的个人技术博客。",
    "记录学习、研究、项目开发与技术探索。",
  ],
  // These are the placeholders supplied by the user, not verified biographical facts.
  placeholder: true,
  layout: { width: 390, height: 238, maxScale: 5, borderTile: 64 },
} as const;

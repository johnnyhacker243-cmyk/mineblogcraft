import { InventoryText } from "./InventoryText";
export function SignBoard() {
  return (
    <section className="sign-board" aria-label="网站介绍告示牌">
      {[
        "Mineblogcraft",
        "这是一个 Minecraft 风格的",
        "个人技术博客",
        "记录：学习 · 研究 · 项目",
        "技术探索",
      ].map((line) => (
        <InventoryText key={line} text={line} color="#17100a" shadow={false} />
      ))}
    </section>
  );
}

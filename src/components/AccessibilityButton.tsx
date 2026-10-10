import { MinecraftButton } from "./MinecraftButton";
import { assets } from "../config/assets-config";
export function AccessibilityButton({ onClick }: { onClick: () => void }) {
  return (
    <MinecraftButton
      className="icon-button"
      aria-label="作者介绍"
      title="作者介绍"
      onClick={onClick}
    >
      <img src={assets.icons.accessibility} alt="" />
    </MinecraftButton>
  );
}

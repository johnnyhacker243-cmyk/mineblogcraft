import { MinecraftButton } from "./MinecraftButton";
import { assets } from "../config/assets-config";
export function LanguageButton({ onClick }: { onClick: () => void }) {
  return (
    <MinecraftButton
      className="icon-button"
      aria-label="Language"
      onClick={onClick}
    >
      <img src={assets.icons.language} alt="" />
    </MinecraftButton>
  );
}

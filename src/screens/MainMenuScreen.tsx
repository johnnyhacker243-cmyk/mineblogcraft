import { MinecraftLogo } from "../components/MinecraftLogo";
import { SplashText } from "../components/SplashText";
import { MinecraftButton } from "../components/MinecraftButton";
import { LanguageButton } from "../components/LanguageButton";
import { AccessibilityButton } from "../components/AccessibilityButton";
import { FooterInfo } from "../components/FooterInfo";
import { menu, type ScreenId } from "../config/ui-config";
export function MainMenuScreen({
  navigate,
}: {
  navigate: (id: ScreenId) => void;
}) {
  return (
    <>
      <MinecraftLogo />
      <SplashText />
      <main className="main-menu" aria-label="Main menu">
        <div className="primary-buttons">
          {menu.slice(0, 3).map((item) => (
            <MinecraftButton
              key={item.target}
              onClick={() => navigate(item.target)}
            >
              {item.label}
            </MinecraftButton>
          ))}
        </div>
        <div className="lower-buttons">
          <LanguageButton onClick={() => navigate("mineworld")} />
          {menu.slice(3).map((item) => (
            <MinecraftButton
              key={item.target}
              onClick={() => navigate(item.target)}
            >
              {item.label}
            </MinecraftButton>
          ))}
          <AccessibilityButton onClick={() => navigate("profile")} />
        </div>
      </main>
      <FooterInfo />
    </>
  );
}

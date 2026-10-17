import { useEffect, useRef } from "react";
import { menu, type ScreenId } from "../config/ui-config";
export function SiteNavigation({
  screen,
  navigate,
}: {
  screen: ScreenId;
  navigate: (id: ScreenId) => void;
}) {
  const root = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (root.current) root.current.open = false;
  }, [screen]);
  if (screen === "main" || screen === "mineworld") return null;
  return (
    <nav className="site-navigation" aria-label="网站导航">
      <details ref={root}>
        <summary aria-label="打开网站导航">导航</summary>
        <div>
          {[
            { label: "首页", target: "main" as ScreenId },
            ...menu,
            { label: "作者介绍", target: "profile" as ScreenId },
          ].map((item) => (
            <button
              key={item.target}
              aria-current={screen === item.target ? "page" : undefined}
              onClick={() => navigate(item.target)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </details>
    </nav>
  );
}

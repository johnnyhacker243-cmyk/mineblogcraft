import { assets } from "../config/assets-config";
import { ui } from "../config/ui-config";
export function MinecraftLogo() {
  return (
    <div className="logo-group">
      <div className="logo">
        <img src={assets.logo} alt={ui.brand} />
      </div>
      {assets.subtitle && (
        <div className="edition">
          <img src={assets.subtitle} alt={ui.editionLabel} />
        </div>
      )}
    </div>
  );
}

import { ui } from "../config/ui-config";
import { PixelText } from "./PixelText";
export function FooterInfo() {
  return (
    <footer className="main-footer">
      <PixelText text={ui.version} />
      <PixelText text={ui.copyright} />
    </footer>
  );
}

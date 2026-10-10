import type { CSSProperties } from "react";
import { ui } from "../config/ui-config";
import type { guiMetrics } from "./gui-scale";
export function guiStyle(
  m: ReturnType<typeof guiMetrics>,
  size: { width: number; height: number },
): CSSProperties {
  const sx = size.width / m.width,
    sy = size.height / m.height;
  return {
    "--gui-scale": m.scale,
    "--gui-scale-x": sx,
    "--gui-scale-y": sy,
    "--gui-center-x": `${Math.floor(m.width / 2) * sx}px`,
    "--font-size": `${ui.font * sy}px`,
    "--shadow": `${ui.shadow * m.scale}px`,
    "--menu-y": `${(Math.floor(m.height / 4) + ui.menuOffset) * sy}px`,
    "--logo-width": `${ui.logo.width * sx}px`,
    "--logo-height": `${ui.logo.height * sy}px`,
    "--logo-texture-height": `${ui.logo.textureHeight * sy}px`,
    "--logo-y": `${ui.logo.y * sy}px`,
    "--subtitle-width": `${ui.logo.subtitleWidth * sx}px`,
    "--subtitle-height": `${ui.logo.subtitleHeight * sy}px`,
    "--subtitle-texture-height": `${ui.logo.subtitleTextureHeight * sy}px`,
    "--subtitle-y": `${ui.logo.subtitleY * sy}px`,
    "--button-width": `${ui.button.width * sx}px`,
    "--button-height": `${ui.button.height * sy}px`,
    "--gap-x": `${ui.button.gap * sx}px`,
    "--gap-y": `${ui.button.gap * sy}px`,
    "--splash-x": `${ui.splash.x * sx}px`,
    "--splash-y": `${ui.splash.y * sy}px`,
    "--splash-angle": `${ui.splash.angle}deg`,
    "--splash-period": `${ui.splash.periodMs}ms`,
    "--fade-duration": `${ui.fadeMs}ms`,
  } as CSSProperties;
}

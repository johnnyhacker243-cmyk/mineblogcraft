import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Children } from "react";
import { audioManager } from "../managers/AudioManager";
import { PixelText } from "./PixelText";
import { assets } from "../config/assets-config";
export function MinecraftButton({
  children,
  onClick,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const parts = Children.toArray(children);
  const label = parts.every(
    (p) => typeof p === "string" || typeof p === "number",
  )
    ? parts.join("")
    : undefined;
  return (
    <button
      className={`mc-button ${className}`}
      aria-label={label}
      {...rest}
      style={
        {
          "--button-normal": `url(${assets.buttons.normal})`,
          "--button-highlight": `url(${assets.buttons.highlight})`,
          "--button-disabled": `url(${assets.buttons.disabled})`,
          ...rest.style,
        } as React.CSSProperties
      }
      onClick={(e) => {
        audioManager.click();
        onClick?.(e);
      }}
    >
      <span>
        {label !== undefined ? (
          <PixelText
            text={label}
            color={rest.disabled ? "#a0a0a0" : "#ffffff"}
          />
        ) : (
          children
        )}
      </span>
    </button>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { loadBitmapFont, textWidth } from "../utils/bitmap-font";
export function PixelText({
  text,
  color = "#ffffff",
  shadow = true,
}: {
  text: string;
  color?: string;
  shadow?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let active = true;
    void loadBitmapFont()
      .then((font) => {
        if (!active) return;
        const w = textWidth(font, text);
        setWidth(w);
        const canvas = ref.current!;
        canvas.width = w + (shadow ? 1 : 0);
        canvas.height = 15;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        const layer = document.createElement("canvas");
        layer.width = canvas.width;
        layer.height = canvas.height;
        const l = layer.getContext("2d")!;
        l.imageSmoothingEnabled = false;
        let x = 0;
        for (const ch of text) {
          const g = font.glyphs.get(ch);
          if (g && g.width)
            l.drawImage(
              g.image,
              g.x,
              g.y,
              g.width,
              g.cellHeight,
              x,
              g.offsetY + 3,
              g.width * g.ratio,
              g.cellHeight * g.ratio,
            );
          x += g?.advance ?? 6;
        }
        l.globalCompositeOperation = "source-in";
        l.fillStyle = shadow
          ? color === "#ffff00"
            ? "#3f3f00"
            : "#3f3f3f"
          : color;
        l.fillRect(0, 0, layer.width, layer.height);
        if (shadow) ctx.drawImage(layer, 1, 1);
        l.fillStyle = color;
        l.fillRect(0, 0, layer.width, layer.height);
        ctx.drawImage(layer, 0, 0);
      })
      .catch(() => {
        if (active) setWidth(-1);
      });
    return () => {
      active = false;
    };
  }, [text, color, shadow]);
  if (width === -1) return <span>{text}</span>;
  return (
    <span
      className="pixel-text-box"
      style={
        {
          width: `calc(${width + (shadow ? 1 : 0)}px * var(--gui-scale-x))`,
          "--center-shift": `${(1 + (width % 2)) * 0.5}px`,
        } as CSSProperties
      }
    >
      <canvas
        ref={ref}
        className="pixel-text"
        aria-label={text}
        role="img"
        style={{
          width: `calc(${width + (shadow ? 1 : 0)}px * var(--gui-scale-x))`,
          height: "calc(15px * var(--gui-scale-y))",
        }}
      />
    </span>
  );
}

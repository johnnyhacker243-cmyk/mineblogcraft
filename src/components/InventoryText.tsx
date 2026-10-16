import { useEffect, useRef, useState } from "react";
import { inventoryAssets } from "../config/profile-config";
import { revision } from "../config/inventory-font-version.json";
type Font = {
  image: HTMLImageElement;
  glyphs: Record<string, [number, number, number]>;
};
let font: Promise<Font> | undefined;
function loadFont() {
  return (font ??= Promise.all([
    fetch(inventoryAssets + `font.json?v=${revision}`).then((r) => {
      if (!r.ok) throw Error("Missing inventory font");
      return r.json();
    }),
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = inventoryAssets + `unifont.png?v=${revision}`;
    }),
  ]).then(([glyphs, image]) => ({ glyphs, image })));
}
export function InventoryText({
  text,
  color = "#fff",
  shadow = true,
  shadowColor = "#3f3f3f",
}: {
  text: string;
  color?: string;
  shadow?: boolean;
  shadowColor?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const width = [...text].reduce(
    (n, c) => n + (c.charCodeAt(0) < 128 ? 4 : 8),
    0,
  );
  useEffect(() => {
    let active = true;
    setFailed(false);
    loadFont()
      .then(({ image, glyphs }) => {
        if (!active || !canvas.current) return;
        const ctx = canvas.current.getContext("2d")!;
        const layer = document.createElement("canvas");
        layer.width = width * 2;
        layer.height = 16;
        const l = layer.getContext("2d")!;
        let x = 0;
        for (const c of text) {
          const g = glyphs[c];
          if (g) l.drawImage(image, g[0], g[1], g[2], 16, x, 0, g[2], 16);
          // Feeds and new content can contain characters absent from the local
          // atlas. Keep every character readable instead of silently dropping it.
          else if (c.trim()) {
            l.fillStyle = "#fff";
            l.font = "16px monospace";
            l.textBaseline = "top";
            l.fillText(c, x, 0, c.charCodeAt(0) < 128 ? 8 : 16);
          }
          x += c.charCodeAt(0) < 128 ? 8 : 16;
        }
        l.globalCompositeOperation = "source-in";
        l.fillStyle = shadowColor;
        l.fillRect(0, 0, layer.width, 16);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (shadow) ctx.drawImage(layer, 2, 2);
        l.fillStyle = color;
        l.fillRect(0, 0, layer.width, 16);
        ctx.drawImage(layer, 0, 0);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [text, color, shadow, shadowColor, width]);
  return failed ? (
    <span className="inventory-font-error">字体资源未导入</span>
  ) : (
    <canvas
      ref={canvas}
      className="inventory-text"
      aria-label={text}
      role="img"
      width={width * 2 + 2}
      height={18}
      style={{ width: width + 1, height: 9 }}
    />
  );
}

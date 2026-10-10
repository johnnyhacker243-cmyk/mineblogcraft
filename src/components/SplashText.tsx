import { useEffect, useRef, useState } from "react";
import { splashes, ui } from "../config/ui-config";
import { assets } from "../config/assets-config";
import { PixelText } from "./PixelText";
import { loadBitmapFont, textWidth } from "../utils/bitmap-font";
let chosen: Promise<string> | undefined;
function choose() {
  if (ui.splash.text !== null) return Promise.resolve(ui.splash.text);
  return (chosen ??= fetch(assets.splashes)
    .then((r) => {
      if (!r.ok) throw Error();
      return r.text();
    })
    .then(async (raw) => {
      const font = await loadBitmapFont();
      const list = raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s && [...s].every((ch) => font.glyphs.has(ch)));
      return list[Math.floor(Math.random() * list.length)] ?? splashes[0];
    })
    .catch(() => splashes[0]));
}
export function SplashText() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [scale, setScale] = useState(1);
  useEffect(() => {
    let active = true;
    void choose()
      .then(async (value) => {
        const font = await loadBitmapFont();
        if (active) {
          setScale(100 / (textWidth(font, value) + 32));
          setText(value);
        }
      })
      .catch(() => {
        if (active) setText(splashes[0]);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let frame = 0;
    const draw = () => {
      if (ref.current)
        ref.current.style.transform = `scale(${scale * (1.8 - Math.abs(Math.sin(((Date.now() % 1000) / 1000) * Math.PI * 2) * 0.1))})`;
      frame = requestAnimationFrame(draw);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [scale]);
  return (
    <div className="splash-anchor">
      <div className="splash-tilt">
        <div ref={ref} className="splash-size">
          <span className="splash-text">
            <PixelText text={text} color="#ffff00" />
          </span>
        </div>
      </div>
    </div>
  );
}

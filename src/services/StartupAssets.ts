import { assets } from "../config/assets-config";
import { panorama } from "../config/panorama-config";
import { startup } from "../config/startup-config";
import { loadBitmapFont } from "../utils/bitmap-font";
function image(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const finish = (error?: Error) => {
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      error ? reject(error) : resolve();
    };
    const timer = setTimeout(
      () => finish(Error(`Resource timed out: ${url}`)),
      startup.imageTimeoutMs,
    );
    img.onload = () => finish();
    img.onerror = () => finish(Error(`Resource unavailable: ${url}`));
    img.src = url;
  });
}
// Track settled startup tasks, including failures; existing renderer/font fallbacks remain usable.
export async function preloadStartupAssets(
  onProgress: (value: number) => void,
): Promise<void> {
  const urls = [
    ...new Set([
      assets.logo,
      ...Object.values(assets.buttons),
      ...Object.values(assets.icons),
      ...panorama.faces,
      panorama.overlay,
      panorama.fallback,
      "/assets/inventory/mojang-studios-logo.png",
    ]),
  ];
  const tasks = [...urls.map(image), loadBitmapFont()];
  let completed = 0;
  await Promise.allSettled(
    tasks.map((task) =>
      task.finally(() => onProgress(++completed / tasks.length)),
    ),
  );
}

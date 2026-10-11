import { useEffect, useState } from "react";
import { preloadStartupAssets } from "../services/StartupAssets";
import { startup } from "../config/startup-config";
// Own the first-paint HTML overlay; keep it outside the React root so it covers bundle startup too.
export function StartupLoader({
  backgroundReady,
}: {
  backgroundReady: boolean;
}) {
  const [assetsReady, setAssetsReady] = useState(false),
    [minimumElapsed, setMinimumElapsed] = useState(false),
    [deadline, setDeadline] = useState(false);
  useEffect(() => {
    let active = true;
    const overlay = document.getElementById("startup-loader");
    const progress = overlay?.querySelector("[role=progressbar]");
    const minimum = setTimeout(
      () => setMinimumElapsed(true),
      startup.minimumVisibleMs,
    );
    const limit = setTimeout(() => setDeadline(true), startup.maximumWaitMs);
    void preloadStartupAssets((value) => {
      if (!active || !overlay) return;
      overlay.style.setProperty("--startup-progress", String(value * 0.9));
      progress?.setAttribute("aria-valuenow", String(Math.round(value * 90)));
    }).then(() => {
      if (active) setAssetsReady(true);
    });
    return () => {
      active = false;
      clearTimeout(minimum);
      clearTimeout(limit);
    };
  }, []);
  useEffect(() => {
    if (!minimumElapsed || (!(assetsReady && backgroundReady) && !deadline))
      return;
    const overlay = document.getElementById("startup-loader");
    if (!overlay) return;
    const root = document.getElementById("root");
    overlay.style.setProperty("--startup-progress", "1");
    overlay
      .querySelector("[role=progressbar]")
      ?.setAttribute("aria-valuenow", "100");
    // Let the completed bar become visible before the original-style fade.
    const fade = setTimeout(() => {
      overlay.dataset.phase = "fading";
    }, 120);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = setTimeout(
      () => {
        overlay.remove();
        root?.removeAttribute("inert");
      },
      120 + (reduced ? startup.reducedFadeMs : startup.fadeMs),
    );
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [assetsReady, backgroundReady, minimumElapsed, deadline]);
  return null;
}

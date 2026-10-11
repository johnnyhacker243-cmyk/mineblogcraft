import { useCallback, useState } from "react";
import { MinecraftTitleScreen } from "./MinecraftTitleScreen";
import { StartupLoader } from "./StartupLoader";
export function StartupApplication() {
  const [backgroundReady, setBackgroundReady] = useState(false);
  const ready = useCallback(() => setBackgroundReady(true), []);
  return (
    <>
      <StartupLoader backgroundReady={backgroundReady} />
      <MinecraftTitleScreen onBackgroundReady={ready} />
    </>
  );
}

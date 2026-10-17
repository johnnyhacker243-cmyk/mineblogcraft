import { useEffect, useRef, useState } from "react";

const tracks = ["beginning_2", "floating_trees", "moog_city_2", "mutation"];
export function MenuMusic({
  visible,
  volume,
  muted,
}: {
  visible: boolean;
  volume: number;
  muted: boolean;
}) {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem("mineblogcraft-menu-music") !== "off";
    } catch {
      return true;
    }
  });
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const index = useRef(0);
  const wanted = useRef({ enabled, muted, volume });
  wanted.current = { enabled, muted, volume };
  const start = () => {
    if (!wanted.current.enabled || wanted.current.muted || document.hidden)
      return;
    if (!audio.current) {
      const player = new Audio();
      player.preload = "none";
      player.src = `/assets/sounds/menu-${tracks[index.current]}.ogg`;
      player.onplaying = () => {
        setPlaying(true);
        setFailed(false);
      };
      player.onpause = () => setPlaying(false);
      player.onerror = () => {
        setFailed(true);
        setPlaying(false);
      };
      player.onended = () => {
        index.current = (index.current + 1) % tracks.length;
        player.src = `/assets/sounds/menu-${tracks[index.current]}.ogg`;
        start();
      };
      audio.current = player;
    }
    audio.current.volume = wanted.current.volume * 0.35;
    void audio.current.play().catch((error: DOMException) => {
      setPlaying(false);
      // Browser autoplay policy is a pending gesture, not a broken resource.
      if (error.name !== "NotAllowedError" && error.name !== "AbortError")
        setFailed(true);
    });
  };
  useEffect(() => {
    const gesture = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".menu-music-toggle")
      )
        return;
      start();
    };
    const visibility = () => {
      if (document.hidden) audio.current?.pause();
      else if (audio.current) start();
    };
    document.addEventListener("pointerdown", gesture);
    document.addEventListener("keydown", gesture);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("pointerdown", gesture);
      document.removeEventListener("keydown", gesture);
      document.removeEventListener("visibilitychange", visibility);
      if (audio.current) {
        audio.current.onended =
          audio.current.onplaying =
          audio.current.onpause =
          audio.current.onerror =
            null;
        audio.current.pause();
        audio.current.removeAttribute("src");
        audio.current.load();
        audio.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume * 0.35;
    if (!enabled || muted) audio.current?.pause();
    else if (audio.current) start();
  }, [volume, muted, enabled]);
  if (!visible) return null;
  const label = enabled ? "关闭背景音乐" : "开启背景音乐";
  const hint = failed
    ? "音乐加载失败，点击关闭后可重试"
    : playing
      ? "原版菜单音乐正在播放"
      : enabled
        ? "首次点击或按键后播放原版菜单音乐"
        : "背景音乐已关闭";
  return (
    <button
      className="menu-music-toggle"
      type="button"
      aria-label={label}
      aria-pressed={enabled}
      title={`${label} · ${hint}`}
      data-playing={playing}
      onClick={() => {
        const next = !enabled;
        wanted.current.enabled = next;
        setEnabled(next);
        setFailed(false);
        try {
          localStorage.setItem("mineblogcraft-menu-music", next ? "on" : "off");
        } catch {
          /* Storage is optional. */
        }
        if (next) {
          if (audio.current?.error) audio.current.load();
          start();
        } else audio.current?.pause();
      }}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" shapeRendering="crispEdges">
        <path d="M2 7h4l5-4v14l-5-4H2z" fill="currentColor" />
        {enabled && !muted ? (
          <path
            d="M13 6h2v2h1v4h-1v2h-2v-2h1V8h-1zM16 3h2v3h1v8h-1v3h-2v-3h1V6h-1z"
            fill="currentColor"
          />
        ) : (
          <path
            d="m13 7 2-2 3 3 2-2v3l-2 2 2 2v3l-4-4-3 3-2-2 3-3z"
            fill="currentColor"
          />
        )}
      </svg>
    </button>
  );
}

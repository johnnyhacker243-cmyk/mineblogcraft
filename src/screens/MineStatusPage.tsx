import { useEffect, useState, type CSSProperties } from "react";
import type { SiteStatus } from "../models/SiteStatus";
import { statusRepository } from "../services/StatusRepository";
import { EnchantBook } from "../components/status/EnchantBook";
import { StatusItem } from "../components/status/StatusItem";
import {
  StatusPanel,
  type StatusSection,
} from "../components/status/StatusPanel";
import { StatusTooltip } from "../components/status/StatusTooltip";
import { InventoryText } from "../components/InventoryText";
import { MinecraftButton } from "../components/MinecraftButton";
import "../styles/status.css";
export function MineStatusPage({ back }: { back: () => void }) {
  const [data, setData] = useState<SiteStatus | null>(null),
    [error, setError] = useState(false),
    [section, setSection] = useState<StatusSection | null>(null);
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight });
  useEffect(() => {
    const resize = () => setSize({ w: innerWidth, h: innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const c = new AbortController();
    statusRepository
      .getStatus(c.signal)
      .then((d) => {
        if (!c.signal.aborted) setData(d);
      })
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      });
    return () => c.abort();
  }, []);
  const close = () => {
    const title =
      section === "website"
        ? "Build Report"
        : section === "modules"
          ? "Content Index"
          : "Build Time";
    setSection(null);
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLButtonElement>(`.status-item[aria-label="${title}"]`)
        ?.focus(),
    );
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        if (section) close();
        else back();
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [section, back]);
  const scale = Math.max(
    0.5,
    Math.floor(Math.min((size.w * 0.92) / 460, (size.h * 0.92) / 340) * 4) / 4,
  );
  const entries: [StatusSection, string, string][] = [
    ["website", "Build Report", data ? "CHECKED" : "..."],
    [
      "modules",
      "Content Index",
      `${data?.counts.pages ?? 0} pages · ${data?.counts.blogs ?? 0} blogs`,
    ],
    [
      "update",
      "Build Time",
      data
        ? new Date(data.builtAt).toLocaleDateString("zh-CN", {
            timeZone: "Asia/Shanghai",
          })
        : "...",
    ],
  ];
  return (
    <main
      className="status-screen"
      style={
        {
          "--status-scale": scale,
          "--inventory-scale": scale * 0.8,
          "--gui-scale-x": scale,
          "--gui-scale-y": scale,
          "--button-width": `${150 * scale}px`,
          "--button-height": `${20 * scale}px`,
        } as CSSProperties
      }
    >
      <header className="status-heading">
        <h1>
          <InventoryText shadow={false} text="MineStatus" />
        </h1>
        <InventoryText
          shadow={false}
          text="网站状态 · 系统附魔台"
          color="#ddd"
        />
      </header>
      <div className="status-window">
        <div className="status-window-label">
          <InventoryText shadow={false} text="系统附魔" color="#404040" />
          <InventoryText
            shadow={false}
            text="构建记录 · 内容统计"
            color="#666"
          />
        </div>
        <div className="status-enchant-area">
          <div className="status-left">
            <EnchantBook />
            <div className="status-inputs">
              <button
                className="status-input enchanted"
                aria-label="Mineblogcraft Core"
              >
                <img src="/assets/inventory/sword.png" alt="钻石剑" />
                <StatusTooltip
                  title="Mineblogcraft Core"
                  description="网站核心系统状态"
                />
              </button>
              <button className="status-input" aria-label="System Resource">
                <img src="/assets/inventory/lapis.png" alt="青金石" />
                <StatusTooltip
                  title="System Resource"
                  description="运行环境信息"
                />
              </button>
            </div>
            <InventoryText shadow={false} text="Core + Resource" color="#666" />
          </div>
          <div className="status-options">
            {error ? (
              <InventoryText
                shadow={false}
                text="状态数据加载失败"
                color="#aa0000"
              />
            ) : (
              entries.map(([key, title, summary], i) => (
                <StatusItem
                  key={key}
                  title={title}
                  summary={summary}
                  index={i + 1}
                  selected={section === key}
                  onClick={() => setSection(key)}
                />
              ))
            )}
          </div>
        </div>
        {data && <StatusPanel data={data} section={section} close={close} />}
      </div>
      <MinecraftButton aria-label="返回" onClick={back}>
        <InventoryText shadow={false} text="返回" />
      </MinecraftButton>
    </main>
  );
}

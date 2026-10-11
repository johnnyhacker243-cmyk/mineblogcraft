import { useEffect, useRef } from "react";
import type { SiteStatus } from "../../models/SiteStatus";
import { InventoryText } from "../InventoryText";
export type StatusSection = "website" | "modules" | "update";
export function StatusPanel({
  data,
  section,
  close,
}: {
  data: SiteStatus;
  section: StatusSection | null;
  close: () => void;
}) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (section) button.current?.focus();
  }, [section]);
  const rows =
    section === "website"
      ? [
          ["Status", data.website.status.toUpperCase()],
          ["Domain", data.website.name],
          ["Response", `${data.website.response} (示例)`],
          ["Frontend", data.environment.frontend],
          ["Backend", data.environment.backend],
        ]
      : section === "modules"
        ? data.modules.map((m) => [m.name, m.status.toUpperCase()])
        : section === "update"
          ? [
              ["Version", data.website.version],
              ["Last Update", data.website.lastUpdate],
              ["Monitoring", data.environment.monitoring],
            ]
          : [];
  return (
    <section className="status-panel" aria-label="状态详情" aria-live="polite">
      <header>
        <InventoryText
          text={
            section === "website"
              ? "Website Status"
              : section === "modules"
                ? "Module Status"
                : section === "update"
                  ? "World Version"
                  : "系统附魔台"
          }
          color="#404040"
        />
        {section && (
          <button ref={button} aria-label="关闭状态详情" onClick={close}>
            <InventoryText text="×" color="#404040" />
          </button>
        )}
      </header>
      {section ? (
        <div className="status-detail-rows">
          {rows.map(([key, value]) => (
            <div key={key}>
              <InventoryText text={key} color="#666" />
              <InventoryText
                text={value}
                color={value === "ONLINE" ? "#26762b" : "#333"}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="status-guide">
          <InventoryText
            text="选择右侧词条，查看数字世界的状态。"
            color="#444"
          />
          <InventoryText
            text="当前为静态示例，尚未连接真实监控。"
            color="#666"
          />
        </div>
      )}
    </section>
  );
}

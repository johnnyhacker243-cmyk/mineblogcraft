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
          ["Pages", String(data.counts.pages)],
          ["Checks", `${data.checks.length} PASSED`],
          ["Delivery", "Static website"],
          ...data.checks.map((c) => [c.name, "PASSED"]),
        ]
      : section === "modules"
        ? [
            ...data.modules.map((m) => [m.name, String(m.count)]),
            ["RSS sources", String(data.counts.feeds)],
          ]
        : section === "update"
          ? [
              ["Version", data.version],
              [
                "Built (UTC+8)",
                new Date(data.builtAt).toLocaleString("zh-CN", {
                  timeZone: "Asia/Shanghai",
                  hour12: false,
                }),
              ],
              ["Commit", data.commit.slice(0, 7)],
              ["Run", data.runId],
            ]
          : [];
  return (
    <section className="status-panel" aria-label="状态详情" aria-live="polite">
      <header>
        <InventoryText
          shadow={false}
          text={
            section === "website"
              ? "Build Checks"
              : section === "modules"
                ? "Content Index"
                : section === "update"
                  ? "Build Record"
                  : "系统附魔台"
          }
          color="#404040"
        />
        {section && (
          <button ref={button} aria-label="关闭状态详情" onClick={close}>
            <InventoryText shadow={false} text="×" color="#404040" />
          </button>
        )}
      </header>
      {section ? (
        <div className="status-detail-rows">
          {rows.map(([key, value]) => (
            <div key={key}>
              <InventoryText shadow={false} text={key} color="#666" />
              <InventoryText
                shadow={false}
                text={value}
                color={value === "ONLINE" ? "#26762b" : "#333"}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="status-guide">
          <InventoryText
            shadow={false}
            text="选择右侧词条，查看数字世界的状态。"
            color="#444"
          />
          <InventoryText
            shadow={false}
            text="显示本次构建检查结果与内容数量。"
            color="#666"
          />
        </div>
      )}
    </section>
  );
}

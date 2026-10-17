import { MinecraftButton } from "../components/MinecraftButton";
import { InventoryText } from "../components/InventoryText";
export function LoadingScreen({
  error,
  detail,
  retry,
}: {
  error: boolean;
  detail: string;
  retry: () => void;
}) {
  return (
    <div className="mineworld-loading" role={error ? "alert" : "status"}>
      <p>
        <InventoryText text={error ? "世界加载失败" : "加载地形中…"} />
      </p>
      {!error && (
        <>
          <div
            className="mineworld-terrain-progress"
            role="progressbar"
            aria-label="加载地形中"
            aria-valuetext={detail}
          >
            <span />
          </div>
          <div className="mineworld-terrain-map" aria-hidden="true">
            <div className="mineworld-terrain-region">
              <div className="mineworld-terrain-generated">
                <div className="mineworld-terrain-center" />
              </div>
            </div>
          </div>
        </>
      )}
      {error && (
        <>
          <p>
            <InventoryText text={detail} />
          </p>
          <MinecraftButton aria-label="重新加载游戏" onClick={retry}>
            <InventoryText text="重新加载" />
          </MinecraftButton>
        </>
      )}
    </div>
  );
}

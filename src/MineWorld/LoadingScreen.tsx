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
      <h1>
        <InventoryText text="MineWorld" />
      </h1>
      <p>
        <InventoryText
          text={error ? "World loading failed" : "Generating World..."}
          color="#ffff55"
        />
      </p>
      <p>
        <InventoryText text={detail} />
      </p>
      {!error && (
        <span className="mineworld-loading-dots" aria-hidden="true">
          ▪ ▪ ▪
        </span>
      )}
      {error && (
        <MinecraftButton aria-label="重新加载游戏" onClick={retry}>
          <InventoryText text="重新加载" />
        </MinecraftButton>
      )}
      <p className="mineworld-loading-caption">
        ClassiCube · Minecraft Classic
      </p>
    </div>
  );
}

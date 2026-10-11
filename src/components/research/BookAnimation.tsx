import { InventoryText } from "../InventoryText";
export function BookAnimation({
  opened,
  onOpened,
}: {
  opened: boolean;
  onOpened: () => void;
}) {
  return (
    <div
      className={`book-cover ${opened ? "cover-opened" : ""}`}
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === "book-open") onOpened();
      }}
    >
      <div>
        <InventoryText text="MineResearch" color="#fff4c7" />
        <InventoryText text="Research Paper" color="#fff4c7" />
        <InventoryText text="Collection" color="#fff4c7" />
        <InventoryText text="YTC" color="#fff4c7" />
      </div>
    </div>
  );
}

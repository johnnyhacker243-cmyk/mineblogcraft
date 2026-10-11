import { InventoryText } from "../InventoryText";
export function BookAnimation() {
  return (
    <div className="book-transition-shell" aria-hidden="true">
      <div className="book-ground-shadow" />
      <div className="book-spine" />
      <div className="book-cover-wing cover-left" />
      <div className="book-cover-wing cover-right" />
      <div className="book-closed-volume">
        <div className="book-paper-edge" />
        <div className="book-closed-cover">
          <InventoryText text="MineResearch" color="#fff4c7" />
          <InventoryText text="YTC" color="#fff4c7" />
        </div>
      </div>
    </div>
  );
}

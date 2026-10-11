import { InventoryText } from "../InventoryText";
export function WorldSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="world-search">
      <input
        aria-label="搜索世界"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索世界"
        autoComplete="off"
        maxLength={100}
      />
      <span aria-hidden="true">
        <InventoryText
          text={value || "搜索世界"}
          color={value ? "#fff" : "#808080"}
        />
      </span>
    </label>
  );
}

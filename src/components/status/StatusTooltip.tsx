import { InventoryText } from "../InventoryText";
export function StatusTooltip({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <span className="status-tooltip" role="tooltip">
      <InventoryText text={title} color="#55ffff" />
      <InventoryText text={description} />
    </span>
  );
}

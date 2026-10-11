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
      <InventoryText shadow={false} text={title} color="#55ffff" />
      <InventoryText shadow={false} text={description} />
    </span>
  );
}

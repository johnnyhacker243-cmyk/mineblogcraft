import { InventoryText } from "../InventoryText";

// Wrap by bitmap glyph width, keeping Chinese and English pixels on the same grid.
export function BlogText({
  text,
  width = 270,
  color = "#fff",
}: {
  text: string;
  width?: number;
  color?: string;
}) {
  const lines: string[] = [];
  let line = "",
    size = 0;
  for (const char of text) {
    const advance = char.charCodeAt(0) < 128 ? 4 : 8;
    if (size + advance > width && line) {
      lines.push(line);
      line = "";
      size = 0;
    }
    line += char;
    size += advance;
  }
  if (line) lines.push(line);
  return (
    <span className="blog-text">
      {lines.map((value, index) => (
        <InventoryText key={index} text={value} color={color} />
      ))}
    </span>
  );
}

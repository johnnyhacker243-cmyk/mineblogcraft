import type { PaperDocument } from "../models/ResearchPaper";
// External documents are data only: render typed text/image runs, never HTML.
export function parsePaperDocument(text: string): PaperDocument {
  const value = JSON.parse(text);
  const image = (item: Record<string, unknown>) =>
    typeof item.src === "string" &&
    item.src.startsWith("/papers/") &&
    !item.src.includes("..") &&
    typeof item.width === "number" &&
    Number.isFinite(item.width) &&
    item.width > 0 &&
    typeof item.height === "number" &&
    Number.isFinite(item.height) &&
    item.height > 0 &&
    typeof item.alt === "string";
  if (value?.version !== 1 || !Array.isArray(value.blocks))
    throw Error("Unsupported paper document");
  for (const block of value.blocks) {
    if (block?.kind === "paragraph") {
      if (
        !Array.isArray(block.runs) ||
        !block.runs.every(
          (run: Record<string, unknown>) =>
            run && (typeof run.text === "string" || image(run)),
        )
      )
        throw Error("Invalid paper paragraph");
    } else if (block?.kind === "image") {
      if (
        !image(block) ||
        (block.caption !== undefined && typeof block.caption !== "string")
      )
        throw Error("Invalid paper image");
    } else throw Error("Unsupported paper block");
  }
  return value as PaperDocument;
}

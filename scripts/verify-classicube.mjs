import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const root = new URL("../public/", import.meta.url);
const provenance = JSON.parse(
  await readFile(new URL("vendor/classicube/PROVENANCE.json", root), "utf8"),
);
for (const file of provenance.files) {
  const bytes = await readFile(new URL(file.path, root));
  if (
    bytes.length !== file.size ||
    createHash("sha256").update(bytes).digest("hex") !== file.sha256
  )
    throw new Error(`ClassiCube integrity check failed: ${file.path}`);
}
console.log("ClassiCube official client and texture pack verified.");

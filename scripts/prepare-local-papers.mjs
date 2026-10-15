import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
const root = new URL("../", import.meta.url);
const directory = new URL(".local-reference/paper-pdfs/", root);
await mkdir(directory, { recursive: true });
const catalog = JSON.parse(
  await readFile(new URL("public/papers/fulltext-catalog.json", root), "utf8"),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
let ready = 0;
for (const paper of catalog) {
  const target = new URL(paper.sha256 + ".pdf", directory);
  let bytes;
  for (const file of [
    target,
    join(tmpdir(), "Mineblogcraft-paper-audit", paper.id + ".pdf"),
  ]) {
    try {
      const candidate = await readFile(file);
      if (hash(candidate) === paper.sha256) {
        bytes = candidate;
        break;
      }
    } catch {}
  }
  if (!bytes && process.argv.includes("--download")) {
    for (const url of [
      ...new Set([paper.canonicalPDFUrl, paper.url].filter(Boolean)),
    ]) {
      try {
        const result = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (!result.ok) throw Error("HTTP " + result.status);
        const reader = result.body.getReader(),
          chunks = [];
        let size = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > 30_000_000) {
            await reader.cancel();
            throw Error("PDF too large");
          }
          chunks.push(value);
        }
        const candidate = Buffer.concat(chunks);
        if (hash(candidate) !== paper.sha256)
          throw Error("Original PDF changed; run papers:verify");
        bytes = candidate;
        break;
      } catch {}
    }
  }
  if (bytes) {
    await writeFile(target, bytes);
    ready++;
  } else if (process.argv.includes("--download"))
    console.warn(
      `Local PDF unavailable: ${paper.id}; source fallback remains available`,
    );
}
console.log(
  `Verified local paper cache: ${ready}/${catalog.length}. Private development files only.`,
);
if (ready !== catalog.length && !process.argv.includes("--download"))
  console.warn(
    "Use npm run papers:cache to download missing original PDFs; startup continues without waiting for external hosts.",
  );
if (ready !== catalog.length && process.argv.includes("--strict"))
  process.exitCode = 1;

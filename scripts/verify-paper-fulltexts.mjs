import { readFile, writeFile, mkdir, stat, rename } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
const root = new URL("../", import.meta.url);
const registry = JSON.parse(
  await readFile(new URL("config/paperFulltextSources.json", root), "utf8"),
);
const cache = join(tmpdir(), "Mineblogcraft-paper-audit");
await mkdir(cache, { recursive: true });
const catalogPath = new URL("public/papers/fulltext-catalog.json", root);
let previous = [];
try {
  previous = JSON.parse(await readFile(catalogPath, "utf8"));
} catch {
  /* First audit. */
}
const records = [];
for (const source of registry) {
  const file = join(cache, source.id + ".pdf");
  let data,
    cached = true;
  try {
    if (
      process.argv.includes("--refresh") ||
      previous.find((record) => record.id === source.id)?.url !== source.url
    )
      throw Error("Recheck changed source");
    data = await readFile(file);
  } catch {
    cached = false;
    const response = await fetch(source.url, {
      signal: AbortSignal.timeout(45000),
      headers: {
        "User-Agent": "Mineblogcraft paper reader source verification/1.0",
      },
    });
    if (
      !response.ok ||
      !/pdf|octet-stream/.test(response.headers.get("content-type") ?? "")
    )
      throw Error(source.id + ": not an accessible PDF");
    const reader = response.body.getReader(),
      chunks = [];
    let size = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 30_000_000) {
        await reader.cancel();
        throw Error("PDF exceeds 30 MB limit");
      }
      chunks.push(value);
    }
    data = Buffer.concat(chunks);
    if (!data.subarray(0, 1024).toString("latin1").includes("%PDF-"))
      throw Error(source.id + ": invalid PDF signature");
    await writeFile(file, data);
  }
  const hash = createHash("sha256").update(data).digest("hex");
  if (source.canonicalSHA256 && source.canonicalSHA256 !== hash)
    throw Error(source.id + ": archive differs from canonical original");
  const task = getDocument({
    data: new Uint8Array(data),
    disableFontFace: true,
    useSystemFonts: false,
    standardFontDataUrl: fileURLToPath(
      new URL("node_modules/pdfjs-dist/standard_fonts/", root),
    ).replaceAll("\\", "/"),
  });
  const pdf = await task.promise;
  const first = await (await pdf.getPage(1)).getTextContent();
  const last = await (await pdf.getPage(pdf.numPages)).getTextContent();
  const text = first.items
    .map((x) => x.str ?? "")
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
  const words =
    source.title
      .toLowerCase()
      .match(/[a-z0-9]{4,}/g)
      ?.slice(0, 8) ?? [];
  const hits = words.filter((w) => text.includes(w));
  if (hits.length < Math.ceil(words.length * 0.6))
    throw Error(source.id + ": title does not match original first page");
  const { mtime } = await stat(file);
  records.push({
    ...source,
    pageCount: pdf.numPages,
    sha256: hash,
    verifiedAt: new Date().toISOString(),
    sourceFetchedAt: mtime.toISOString(),
    bytes: data.length,
    firstPageTextCharacters: text.length,
    lastPageTextCharacters: last.items.map((x) => x.str ?? "").join("").length,
  });
  console.log(
    source.id +
      ": " +
      pdf.numPages +
      " pages, " +
      data.length +
      " bytes, title verified",
  );
  await task.destroy();
  if (!cached && source.url.startsWith("https://arxiv.org/"))
    await new Promise((r) => setTimeout(r, 3100));
}
// A failed audit must leave the previous complete catalog intact.
const staged = new URL("public/papers/fulltext-catalog.json.tmp", root);
await writeFile(staged, JSON.stringify(records, null, 2) + "\n");
await rename(staged, catalogPath);
console.log(
  "Verified " +
    records.length +
    " complete original PDFs; licensed publication copies are prepared separately with attribution.",
);

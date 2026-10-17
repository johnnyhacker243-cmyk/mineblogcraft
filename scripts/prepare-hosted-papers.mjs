import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
const root = new URL("../", import.meta.url);
const catalog = JSON.parse(
  await readFile(new URL("public/papers/fulltext-catalog.json", root), "utf8"),
);
const host =
  "https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com";
const attribution = [];
for (const entry of catalog) {
  if (!entry.hostedUrl) continue;
  if (
    !/^https:\/\/creativecommons.org\/licenses\/(by|by-sa)\/4\.0\/$/.test(
      entry.licenseUrl,
    ) ||
    !/^\/papers\/fulltext\/\d{4}\.\d{4,5}v\d+\.pdf$/.test(entry.hostedUrl)
  )
    throw Error("Unapproved publication license or path: " + entry.id);
  const valid = (data) =>
    data.length === entry.bytes &&
    createHash("sha256").update(data).digest("hex") === entry.sha256 &&
    data.subarray(0, 1024).includes(Buffer.from("%PDF-"));
  const target = new URL("public" + entry.hostedUrl, root);
  let bytes;
  for (const path of [
    target,
    join(tmpdir(), "Mineblogcraft-paper-audit", entry.id + ".pdf"),
  ]) {
    try {
      const data = await readFile(path);
      if (valid(data)) {
        bytes = data;
        break;
      }
    } catch {
      /* Try next verified source. */
    }
  }
  if (!bytes)
    for (const url of [host + entry.hostedUrl, entry.url]) {
      try {
        if (
          !url.startsWith(host + "/papers/fulltext/") &&
          !/^https:\/\/arxiv.org\/pdf\/\d{4}\.\d{4,5}v\d+$/.test(url)
        )
          throw Error("Unexpected source");
        const response = await fetch(url, {
          signal: AbortSignal.timeout(60000),
        });
        if (!response.ok) continue;
        const reader = response.body.getReader(),
          chunks = [];
        let size = 0;
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > 30_000_000) {
            await reader.cancel();
            throw Error("Oversized PDF");
          }
          chunks.push(value);
        }
        const data = Buffer.concat(chunks);
        if (valid(data)) {
          bytes = data;
          break;
        }
      } catch {
        /* Only the audited byte-identical original is accepted. */
      }
    }
  if (!bytes) throw Error("Cannot restore audited original PDF: " + entry.id);
  await mkdir(new URL("./", target), { recursive: true });
  await writeFile(target, bytes);
  attribution.push({
    id: entry.id,
    title: entry.title,
    authors: entry.authors,
    sourceUrl: entry.sourceUrl,
    originalPDF: entry.url,
    licenseUrl: entry.licenseUrl,
    file: entry.hostedUrl,
    sha256: entry.sha256,
    changes: "None; complete byte-identical original PDF.",
  });
}
await mkdir(new URL("public/papers/fulltext/", root), { recursive: true });
await writeFile(
  new URL("public/papers/fulltext/ATTRIBUTION.json", root),
  JSON.stringify(attribution, null, 2) + "\n",
);
console.log(`Prepared ${attribution.length} licensed complete original PDFs.`);

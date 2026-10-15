import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

test("Official compatibility build reads embedded-font PDFs without recent browser APIs", () => {
  const code = `
    import {fontPDF} from './tests/pdf-compat-fixture.mjs';
    Uint8Array.prototype.toHex=undefined;
    Map.prototype.getOrInsertComputed=undefined;
    const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task=pdfjs.getDocument({data:new Uint8Array(await fontPDF()),useSystemFonts:true});
    const document=await task.promise;
    const page=await document.getPage(1);
    const content=await page.getTextContent();
    if(document.numPages!==1 || !content.items.map(item=>item.str).join('').includes('Offline PDF'))throw Error('PDF content missing');
    await task.destroy();
    console.log('COMPATIBILITY_PASSED');
  `;
  const output = execFileSync(
    process.execPath,
    ["--input-type=module", "-e", code],
    { cwd: new URL("../", import.meta.url), encoding: "utf8", timeout: 30000 },
  );
  assert.match(output, /COMPATIBILITY_PASSED/);
});

test("Browser reader and worker consistently use the compatibility build", async () => {
  const reader = await readFile(
    new URL("../src/services/PDFRepository.ts", import.meta.url),
    "utf8",
  );
  const assets = await readFile(
    new URL("../scripts/prepare-pdf-assets.mjs", import.meta.url),
    "utf8",
  );
  assert.ok(reader.includes("pdfjs-dist/legacy/build/pdf.mjs"));
  assert.ok(assets.includes("pdfjs-dist/legacy/build/pdf.worker.min.mjs"));
});

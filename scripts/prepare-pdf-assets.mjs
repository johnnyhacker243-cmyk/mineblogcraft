import { cp, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const target = new URL("public/pdfjs/", root);
await mkdir(target, { recursive: true });
for (const folder of ["standard_fonts", "cmaps", "wasm"])
  await cp(
    new URL("node_modules/pdfjs-dist/" + folder, root),
    new URL(folder, target),
    { recursive: true },
  );
await cp(
  new URL("node_modules/pdfjs-dist/build/pdf.worker.min.mjs", root),
  new URL("pdf.worker.min.mjs", target),
);
await cp(
  new URL("node_modules/pdfjs-dist/LICENSE", root),
  new URL("LICENSE", target),
);
console.log("Prepared local PDF.js worker, fonts, CMaps and image codecs");

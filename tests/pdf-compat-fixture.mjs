import { readFile } from "node:fs/promises";

// A synthetic one-page PDF with a bundled, licensed test font. No research
// text or private cache is needed for the browser compatibility regression.
export async function fontPDF() {
  const font = await readFile(
    new URL(
      "../node_modules/pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf",
      import.meta.url,
    ),
  );
  const text = Buffer.from(
    "BT /F1 12 Tf 40 350 Td (Offline PDF compatibility) Tj ET",
  );
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 400] /Resources << /Font << /F1 4 0 R >> >> /Contents 7 0 R >>",
    `<< /Type /Font /Subtype /TrueType /BaseFont /LiberationSans /FirstChar 32 /LastChar 122 /Widths [${Array(91).fill(600).join(" ")}] /Encoding /WinAnsiEncoding /FontDescriptor 5 0 R >>`,
    "<< /Type /FontDescriptor /FontName /LiberationSans /Flags 32 /FontBBox [-100 -200 1100 900] /ItalicAngle 0 /Ascent 800 /Descent -200 /CapHeight 700 /StemV 80 /FontFile2 6 0 R >>",
    Buffer.concat([
      Buffer.from(
        `<< /Length ${font.length} /Length1 ${font.length} >>\nstream\n`,
      ),
      font,
      Buffer.from("\nendstream"),
    ]),
    Buffer.concat([
      Buffer.from(`<< /Length ${text.length} >>\nstream\n`),
      text,
      Buffer.from("\nendstream"),
    ]),
  ];
  const chunks = [Buffer.from("%PDF-1.7\n")],
    offsets = [0];
  let length = chunks[0].length;
  for (let i = 0; i < objects.length; i++) {
    offsets.push(length);
    const chunk = Buffer.concat([
      Buffer.from(`${i + 1} 0 obj\n`),
      Buffer.from(objects[i]),
      Buffer.from("\nendobj\n"),
    ]);
    chunks.push(chunk);
    length += chunk.length;
  }
  chunks.push(
    Buffer.from(
      `xref\n0 8\n0000000000 65535 f \n${offsets
        .slice(1)
        .map((n) => String(n).padStart(10, "0") + " 00000 n \n")
        .join(
          "",
        )}trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n${length}\n%%EOF\n`,
    ),
  );
  return Buffer.concat(chunks);
}

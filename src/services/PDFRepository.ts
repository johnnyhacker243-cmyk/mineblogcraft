import type { PDFDocumentProxy } from "pdfjs-dist";

const trustedHosts = new Set([
  "arxiv.org",
  "raft.github.io",
  "static.googleusercontent.com",
  "www.microsoft.com",
  "lamport.azurewebsites.net",
  "web.stanford.edu",
]);
export function trustedPDFUrl(input: string, origin = location.origin): string {
  const url = new URL(input, origin);
  if (url.username || url.password || url.hash)
    throw Error("Invalid original PDF URL");
  if (
    url.origin === origin &&
    url.pathname.startsWith("/papers/") &&
    !url.pathname.includes("..")
  )
    return url.href;
  const academicArchive =
    url.hostname === "raw.githubusercontent.com" &&
    /^\/(papers-we-love\/papers-we-love|greyhillman\/lamport-clock-paper|skyrain\/LogStructuredFileSystem|glamrock\/anonbib)\/[a-f0-9]{40}\/.+\.pdf$/.test(
      url.pathname,
    );
  if (
    url.protocol !== "https:" ||
    (!trustedHosts.has(url.hostname) && !academicArchive) ||
    url.port
  )
    throw Error("Untrusted PDF source");
  return url.href;
}
export interface PDFLoadHandle {
  document: Promise<PDFDocumentProxy>;
  destroy: () => Promise<void>;
}
export async function loadOriginalPDF(url: string): Promise<PDFLoadHandle> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  // Only page graphics are rendered; PDF actions, scripts, XFA and form logic
  // are never requested or executed by this reader.
  const task = pdfjs.getDocument({
    url: trustedPDFUrl(url),
    enableXfa: false,
    standardFontDataUrl: "/pdfjs/standard_fonts/",
    cMapUrl: "/pdfjs/cmaps/",
    cMapPacked: true,
    wasmUrl: "/pdfjs/wasm/",
    disableAutoFetch: true,
    disableStream: true,
  });
  return { document: task.promise, destroy: () => task.destroy() };
}

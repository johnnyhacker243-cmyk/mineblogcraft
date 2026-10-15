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
  readonly source?: string;
}
type PDFTask = {
  promise: Promise<PDFDocumentProxy>;
  destroy: () => Promise<void>;
};
export function openPDFSources(
  urls: string[],
  open: (url: string) => PDFTask,
): PDFLoadHandle {
  let active: PDFTask | undefined;
  let currentSource: string | undefined;
  let cancelled = false;
  const document = (async () => {
    let failure: unknown = Error("No PDF source");
    for (const url of urls) {
      if (cancelled) throw Error("PDF loading cancelled");
      try {
        currentSource = url;
        active = open(url);
        return await active.promise;
      } catch (error) {
        failure = error;
        const failed = active;
        active = undefined;
        await failed?.destroy().catch(() => {});
      }
    }
    throw failure;
  })();
  return {
    document,
    get source() {
      return currentSource;
    },
    destroy: async () => {
      cancelled = true;
      await active?.destroy();
    },
  };
}
export async function loadOriginalPDF(
  url: string,
  sha256?: string,
): Promise<PDFLoadHandle> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  // Only page graphics are rendered; PDF actions, scripts, XFA and form logic
  // are never requested or executed by this reader.
  const sources = [trustedPDFUrl(url)];
  if (import.meta.env.DEV && sha256 && /^[a-f0-9]{64}$/.test(sha256))
    sources.unshift(`/papers/local-fulltext/${sha256}.pdf`);
  return openPDFSources(sources, (source) =>
    pdfjs.getDocument({
      url: source,
      enableXfa: false,
      standardFontDataUrl: "/pdfjs/standard_fonts/",
      cMapUrl: "/pdfjs/cmaps/",
      cMapPacked: true,
      wasmUrl: "/pdfjs/wasm/",
      disableAutoFetch: true,
      disableStream: true,
    }),
  );
}

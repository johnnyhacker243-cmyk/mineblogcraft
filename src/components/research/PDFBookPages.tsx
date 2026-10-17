import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import type { ResearchPaper } from "../../models/ResearchPaper";
import {
  loadOriginalPDF,
  type PDFLoadHandle,
} from "../../services/PDFRepository";
import { InventoryText } from "../InventoryText";

function PDFCanvasPage({
  doc,
  number,
  onZoom,
}: {
  doc: PDFDocumentProxy;
  number: number;
  onZoom: (image: { src: string; alt: string }) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    host = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [zooming, setZooming] = useState(false);
  const zoomTask = useRef<RenderTask | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      zoomTask.current?.cancel();
    };
  }, [doc, number]);
  const zoom = async () => {
    if (!ready || zooming) return;
    setZooming(true);
    try {
      const page = await doc.getPage(number);
      if (!mounted.current) return;
      const base = page.getViewport({ scale: 1 });
      // Render from the original vector page again instead of enlarging a
      // small book preview; this keeps two-column text and formulas legible.
      const viewport = page.getViewport({ scale: 2400 / base.width });
      const surface = document.createElement("canvas");
      surface.width = Math.ceil(viewport.width);
      surface.height = Math.ceil(viewport.height);
      zoomTask.current = page.render({ canvas: surface, viewport });
      await zoomTask.current.promise;
      if (mounted.current)
        onZoom({
          src: surface.toDataURL("image/png"),
          alt: `原文第 ${number} 页`,
        });
    } catch (error) {
      if (
        mounted.current &&
        (error as Error).name !== "RenderingCancelledException"
      )
        setFailed(true);
    } finally {
      if (mounted.current) setZooming(false);
    }
  };
  useEffect(() => {
    let disposed = false,
      task: RenderTask | undefined;
    let queued = Promise.resolve();
    const draw = () => {
      task?.cancel();
      queued = queued
        .catch(() => {})
        .then(async () => {
          if (disposed || !canvas.current || !host.current) return;
          const page = await doc.getPage(number);
          if (disposed) return;
          const box = {
              width: host.current.clientWidth,
              height: host.current.clientHeight,
            },
            base = page.getViewport({ scale: 1 });
          const scale =
            Math.min(box.width / base.width, box.height / base.height) *
            Math.min(devicePixelRatio || 1, 2);
          const viewport = page.getViewport({ scale: Math.max(0.2, scale) });
          const surface = canvas.current;
          surface.width = Math.ceil(viewport.width);
          surface.height = Math.ceil(viewport.height);
          setReady(false);
          task = page.render({
            canvas: surface,
            viewport,
          });
          await task.promise;
          if (!disposed) {
            setReady(true);
            setFailed(false);
          }
        })
        .catch((e) => {
          if (!disposed && e?.name !== "RenderingCancelledException")
            setFailed(true);
        });
    };
    draw();
    const observer = new ResizeObserver(draw);
    if (host.current) observer.observe(host.current);
    return () => {
      disposed = true;
      observer.disconnect();
      task?.cancel();
    };
  }, [doc, number]);
  return (
    <section
      className="book-page book-pdf-page"
      aria-label={`原文第 ${number} 页`}
    >
      <button
        ref={host}
        className="pdf-page-surface"
        aria-label={`放大原文第 ${number} 页`}
        onClick={zoom}
        disabled={zooming}
      >
        <canvas
          ref={canvas}
          role="img"
          aria-label={`完整 PDF 原文第 ${number} 页`}
          data-pdf-rendered={ready}
        />
        {(!ready || failed || zooming) && (
          <span className="pdf-page-message">
            <InventoryText
              text={
                failed
                  ? "本页读取失败，请返回后重试"
                  : zooming
                    ? "正在放大原文..."
                    : "正在呈现原文..."
              }
              color="#292019"
              shadow={false}
            />
          </span>
        )}
      </button>
    </section>
  );
}
export function PDFBookPages({
  paper,
  spread,
  onCount,
  onZoom,
}: {
  paper: ResearchPaper;
  spread: number;
  onCount: (n: number) => void;
  onZoom: (image: { src: string; alt: string }) => void;
}) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  const [loadedFrom, setLoadedFrom] = useState<string>();
  const info = paper.pdf!;
  useEffect(() => {
    let disposed = false,
      handle: PDFLoadHandle | undefined;
    setDoc(null);
    setError(false);
    setLoadedFrom(undefined);
    loadOriginalPDF(info.url, info.sha256)
      .then(async (result) => {
        handle = result;
        if (disposed) {
          await handle.destroy();
          return;
        }
        const pdf = await handle.document;
        if (!disposed) {
          setDoc(pdf);
          setLoadedFrom(result.source);
          onCount(pdf.numPages);
        }
      })
      .catch((failure) => {
        if (!disposed) {
          setError(true);
          console.error("[MineResearch] PDF load failed", paper.id, failure);
        }
      });
    return () => {
      disposed = true;
      void handle?.destroy().catch(() => {});
    };
  }, [info.url, info.delivery, info.pageCount, onCount, attempt]);
  const count = doc?.numPages ?? info.pageCount;
  return (
    <>
      {[spread * 2 + 1, spread * 2 + 2].map((number) => (
        <div
          className="book-page-wing"
          data-pdf-source={loadedFrom}
          key={number}
        >
          {number > count ? (
            <section className="book-page" aria-label="书末留白" />
          ) : doc ? (
            <PDFCanvasPage doc={doc} number={number} onZoom={onZoom} />
          ) : (
            <section className="book-page book-pdf-page">
              <div className="pdf-page-message">
                <InventoryText
                  text={
                    error
                      ? "完整原文暂时无法读取，请重试"
                      : "正在读取完整原文..."
                  }
                  color="#292019"
                  shadow={false}
                />
                {error && (
                  <button onClick={() => setAttempt((n) => n + 1)}>重试</button>
                )}
              </div>
            </section>
          )}
        </div>
      ))}
    </>
  );
}

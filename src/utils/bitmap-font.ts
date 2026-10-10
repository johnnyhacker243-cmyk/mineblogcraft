type Glyph = {
  x: number;
  y: number;
  width: number;
  advance: number;
  cellWidth: number;
  cellHeight: number;
  ratio: number;
  offsetY: number;
  image: HTMLImageElement;
};
export type BitmapFont = { glyphs: Map<string, Glyph> };
let cached: Promise<BitmapFont> | undefined;
function image(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
export function loadBitmapFont() {
  return (cached ??= fetch("/assets/fonts/default.json")
    .then((r) => {
      if (!r.ok) throw Error("Font metadata unavailable");
      return r.json();
    })
    .then(async (meta) => {
      const glyphs = new Map<string, Glyph>();
      for (const provider of meta.providers) {
        const img = await image(
          "/assets/fonts/" + provider.file.split("/").at(-1),
        );
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0);
        const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
        const cellWidth = img.width / [...provider.chars[0]].length,
          cellHeight = img.height / provider.chars.length;
        const ratio = (provider.height ?? 8) / cellHeight;
        provider.chars.forEach((row: string, yy: number) =>
          [...row].forEach((ch, xx) => {
            if (ch === "\0" || glyphs.has(ch)) return;
            let ink = 0;
            for (let x = 0; x < cellWidth; x++)
              for (let y = 0; y < cellHeight; y++)
                if (
                  pixels[
                    ((yy * cellHeight + y) * img.width + xx * cellWidth + x) *
                      4 +
                      3
                  ] > 0
                )
                  ink = Math.max(ink, x + 1);
            glyphs.set(ch, {
              x: xx * cellWidth,
              y: yy * cellHeight,
              width: ink,
              advance: ch === " " ? 4 : Math.floor(ink * ratio + 0.5) + 1,
              cellWidth,
              cellHeight,
              ratio,
              offsetY: 7 - provider.ascent,
              image: img,
            });
          }),
        );
      }
      return { glyphs };
    }));
}
export function textWidth(font: BitmapFont, text: string) {
  return [...text].reduce(
    (n, ch) => n + (font.glyphs.get(ch)?.advance ?? 6),
    0,
  );
}

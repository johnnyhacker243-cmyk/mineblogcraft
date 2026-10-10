export function calculateGuiScale(
  width: number,
  height: number,
  requested = 0,
) {
  let scale = 1;
  while (
    (requested === 0 || scale < requested) &&
    width / (scale + 1) >= 320 &&
    height / (scale + 1) >= 240
  )
    scale++;
  return scale;
}
export function guiMetrics(width: number, height: number, requested = 0) {
  const scale = calculateGuiScale(width, height, requested);
  return {
    scale,
    width: Math.ceil(width / scale),
    height: Math.ceil(height / scale),
  };
}

import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
await mkdir("tests/screenshots/panorama", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
await page.goto("http://127.0.0.1:5173");
await page.locator('.panorama[data-status="ready"]').waitFor();
const result = await page.evaluate(async () => {
  const THREE = await import("/node_modules/three/build/three.module.js");
  const { loadPanoramaCube, disposePanorama } =
    await import("/src/utils/panorama-cube.ts");
  const { loadBitmapFont } = await import("/src/utils/bitmap-font.ts");
  const cube = await loadPanoramaCube();
  const scene = new THREE.Scene();
  const parent = new THREE.Group();
  parent.rotation.x = Math.PI;
  scene.add(parent);
  parent.add(cube);
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(960, 540);
  const camera = new THREE.PerspectiveCamera(85, 960 / 540, 0.05, 10);
  const images = [];
  for (const yaw of [0, 45, 90, 135, 180, 225, 270, 315]) {
    cube.rotation.set((10 * Math.PI) / 180, (-yaw * Math.PI) / 180, 0);
    renderer.render(scene, camera);
    images.push({ yaw, data: renderer.domElement.toDataURL("image/png") });
  }
  const before = {
    textures: renderer.info.memory.textures,
    geometries: renderer.info.memory.geometries,
  };
  disposePanorama(cube);
  const after = {
    textures: renderer.info.memory.textures,
    geometries: renderer.info.memory.geometries,
  };
  renderer.dispose();
  renderer.forceContextLoss();
  const font = await loadBitmapFont();
  const raw = await fetch("/assets/gui/splashes.txt").then((r) => r.text());
  const all = raw.split(/\r?\n/).filter((s) => s.trim());
  const supported = all.filter((s) =>
    [...s].every((ch) => font.glyphs.has(ch)),
  );
  return {
    images,
    before,
    after,
    glyphs: font.glyphs.size,
    splashCount: all.length,
    supportedSplashCount: supported.length,
  };
});
for (const { yaw, data } of result.images)
  await writeFile(
    `tests/screenshots/panorama/yaw-${yaw}.png`,
    Buffer.from(data.split(",")[1], "base64"),
  );
delete result.images;
assert.equal(result.after.textures, 0);
assert.equal(result.after.geometries, 0);
await writeFile("tests/panorama-results.json", JSON.stringify(result, null, 2));
await browser.close();
console.log(result);

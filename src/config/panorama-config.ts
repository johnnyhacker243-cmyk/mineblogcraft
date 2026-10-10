// Minecraft face order before its X=180° transform: +Z, +X, -Z, -X, -Y, +Y.
// Explicit per-face vertex/UV geometry avoids CubeTextureLoader mirror conventions.
export const panorama = {
  faces: [0, 1, 2, 3, 4, 5].map((n) => `/assets/panorama/panorama_${n}.png`),
  fallback: "/assets/panorama/fallback.png",
  overlay: "/assets/panorama/overlay.png",
  fov: 85,
  pitchDegrees: 10,
  yawDegreesPerSecond: 2,
  pixelRatioCap: 1.5,
  blurLogicalPixels: 0,
  brightness: 1,
};

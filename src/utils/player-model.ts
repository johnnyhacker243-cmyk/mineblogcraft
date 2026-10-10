import * as THREE from "three";

// Vanilla wide-player dimensions in model pixels. Minecraft's downwards Y and
// front-facing -Z are converted to Three's upwards Y and front-facing +Z.
function cube(
  texture: THREE.Texture,
  w: number,
  h: number,
  d: number,
  u: number,
  v: number,
  inflate = 0,
  mirror = false,
) {
  const geometry = new THREE.BoxGeometry(
    w + inflate * 2,
    h + inflate * 2,
    d + inflate * 2,
  );
  const tw = texture.image.width,
    th = texture.image.height;
  const rectangles = [
    [u + d + w, v + d, d, h],
    [u, v + d, d, h],
    [u + d, v, w, d],
    [u + d + w, v, w, d],
    [u + d, v + d, w, h],
    [u + 2 * d + w, v + d, w, h],
  ];
  const uv = geometry.getAttribute("uv");
  rectangles.forEach(([x, y, rw, rh], face) => {
    const points = [
      [x, y],
      [x + rw, y],
      [x, y + rh],
      [x + rw, y + rh],
    ];
    points.forEach(([xx, yy], i) =>
      uv.setXY(
        face * 4 + i,
        (mirror ? x + rw - (xx - x) : xx) / tw,
        1 - yy / th,
      ),
    );
  });
  return new THREE.Mesh(
    geometry,
    new THREE.MeshLambertMaterial({
      map: texture,
      transparent: false,
      alphaTest: 0.1,
    }),
  );
}
export function createPlayer(
  skin: THREE.Texture,
  outer: THREE.Texture,
  inner: THREE.Texture,
  pickaxe: HTMLImageElement,
) {
  const player = new THREE.Group();
  const head = new THREE.Group();
  head.position.y = 24;
  player.add(head);
  const face = cube(skin, 8, 8, 8, 0, 0);
  face.position.y = 4;
  head.add(face);
  const helmet = cube(outer, 8, 8, 8, 0, 0, 1);
  helmet.position.y = 4;
  head.add(helmet);
  const torso = cube(skin, 8, 12, 4, 16, 16);
  torso.position.y = 18;
  player.add(torso);
  const chest = cube(outer, 8, 12, 4, 16, 16, 1);
  chest.position.y = 18;
  player.add(chest);
  const belt = cube(inner, 8, 12, 4, 16, 16, 0.5);
  belt.position.y = 18;
  player.add(belt);
  const rightArm = new THREE.Group();
  rightArm.position.set(-5, 22, 0);
  player.add(rightArm);
  const leftArm = new THREE.Group();
  leftArm.position.set(5, 22, 0);
  player.add(leftArm);
  for (const [arm, left] of [
    [rightArm, false],
    [leftArm, true],
  ] as const) {
    const limb = cube(skin, 4, 12, 4, left ? 32 : 40, left ? 48 : 16);
    limb.position.set(left ? 1 : -1, -4, 0);
    arm.add(limb);
    const armor = cube(outer, 4, 12, 4, 40, 16, 1, left);
    armor.position.copy(limb.position);
    arm.add(armor);
  }
  for (const left of [false, true]) {
    const x = left ? 1.9 : -1.9;
    for (const [map, u, v, inflate, mirror] of [
      [skin, left ? 16 : 0, left ? 48 : 16, 0, false],
      [inner, 0, 16, 0.5, left],
      [outer, 0, 16, 1, left],
    ] as const) {
      const leg = cube(map, 4, 12, 4, u, v, inflate, mirror);
      leg.position.set(x, 6, 0);
      player.add(leg);
    }
  }
  // Vanilla generated-item silhouette: each opaque texel has front, back and
  // solid edge geometry. This remains a real 3D held item at every yaw.
  const canvas = document.createElement("canvas");
  canvas.width = pickaxe.width;
  canvas.height = pickaxe.height;
  const context = canvas.getContext("2d")!;
  context.drawImage(pickaxe, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const tool = new THREE.Group();
  const materials = new Map<string, THREE.MeshLambertMaterial>();
  for (let y = 0; y < canvas.height; y++)
    for (let x = 0; x < canvas.width; x++) {
      const offset = (y * canvas.width + x) * 4;
      if (pixels[offset + 3] < 128) continue;
      const color = `rgb(${pixels[offset]},${pixels[offset + 1]},${pixels[offset + 2]})`;
      let material = materials.get(color);
      if (!material) {
        material = new THREE.MeshLambertMaterial({ color });
        materials.set(color, material);
      }
      const pixel = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.85, 0.85),
        material,
      );
      pixel.position.set((x - 7.5) * 0.85, (7.5 - y) * 0.85, 0);
      tool.add(pixel);
    }
  tool.position.set(-1, -8, 3.5);
  tool.rotation.z = -0.2;
  rightArm.add(tool);
  rightArm.rotation.x = -0.25;
  rightArm.rotation.z = -0.08;
  leftArm.rotation.z = 0.04;
  return { player, head, rightArm, tool };
}

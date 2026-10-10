import * as THREE from "three";
import { panorama } from "../config/panorama-config";
// Vertex/UV convention verified against local 1.21.1 CubeMap. Image v=0 is top.
export async function loadPanoramaCube() {
  const vertices = [
    [-1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1],
    [1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1],
    [1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1],
    [-1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1],
    [-1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1],
  ];
  const group = new THREE.Group();
  const loader = new THREE.TextureLoader();
  const textures: THREE.Texture[] = [];
  try {
    for (let i = 0; i < 6; i++) {
      const texture = await loader.loadAsync(panorama.faces[i]);
      textures.push(texture);
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices[i], 3),
      );
      g.setAttribute(
        "uv",
        new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 1, 1, 0], 2),
      );
      g.setIndex([0, 1, 2, 0, 2, 3]);
      const m = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        toneMapped: false,
      });
      group.add(new THREE.Mesh(g, m));
    }
  } catch (error) {
    disposePanorama(group);
    textures.forEach((t) => t.dispose());
    throw error;
  }
  return group;
}
export function disposePanorama(group: THREE.Group) {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const material = obj.material as THREE.MeshBasicMaterial;
      material.map?.dispose();
      material.dispose();
    }
  });
}

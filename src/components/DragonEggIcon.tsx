import { useEffect, useState } from "react";
import * as THREE from "three";
import { inventoryAssets } from "../config/profile-config";
type EggElement = {
  from: number[];
  to: number[];
  faces: Record<string, { uv: number[] }>;
};
export function DragonEggIcon() {
  const [image, setImage] = useState<string>();
  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();
    let texture: THREE.Texture | undefined;
    const loaded = loader
      .loadAsync(inventoryAssets + "dragon-egg.png")
      .then((t) => {
        texture = t;
        if (!alive) t.dispose();
        return t;
      });
    void Promise.all([
      loaded,
      fetch(inventoryAssets + "dragon-egg-model.json").then((r) => {
        if (!r.ok) throw Error("Missing egg model");
        return r.json();
      }),
    ])
      .then(([texture, model]) => {
        if (!alive) {
          texture.dispose();
          return;
        }
        texture.needsUpdate = true;
        texture.magFilter = texture.minFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
        });
        renderer.setSize(64, 64);
        const scene = new THREE.Scene();
        const material = new THREE.MeshLambertMaterial({ map: texture });
        const geometries: THREE.BoxGeometry[] = [];
        for (const e of model.elements as EggElement[]) {
          const g = new THREE.BoxGeometry(
            e.to[0] - e.from[0],
            e.to[1] - e.from[1],
            e.to[2] - e.from[2],
          );
          geometries.push(g);
          const uv = g.getAttribute("uv");
          ["east", "west", "up", "down", "south", "north"].forEach(
            (face, i) => {
              const [x, y, x2, y2] = e.faces[face].uv;
              [
                [x, y],
                [x2, y],
                [x, y2],
                [x2, y2],
              ].forEach(([u, v], j) => uv.setXY(i * 4 + j, u / 16, 1 - v / 16));
            },
          );
          const mesh = new THREE.Mesh(g, material);
          mesh.position.set(
            (e.from[0] + e.to[0]) / 2 - 8,
            (e.from[1] + e.to[1]) / 2 - 8,
            (e.from[2] + e.to[2]) / 2 - 8,
          );
          scene.add(mesh);
        }
        scene.add(new THREE.AmbientLight(0xffffff, 2));
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(-12, 24, 18);
        scene.add(light);
        const camera = new THREE.OrthographicCamera(-12, 12, 12, -12, 0.1, 100);
        camera.position.set(24, 18, 32);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        if (alive) setImage(renderer.domElement.toDataURL());
        geometries.forEach((g) => g.dispose());
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        texture.dispose();
      })
      .catch(() => {
        alive = false;
        texture?.dispose();
      });
    return () => {
      alive = false;
      texture?.dispose();
    };
  }, []);
  return <img className="item-icon" src={image} alt="" />;
}

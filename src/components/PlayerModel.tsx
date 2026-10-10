import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { inventoryAssets } from "../config/profile-config";
import { createPlayer } from "../utils/player-model";

export function PlayerModel() {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.append(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-20, 20, 36, -4, 0.1, 200);
    camera.position.set(0, 16, 100);
    camera.lookAt(0, 16, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const light = new THREE.DirectionalLight(0xffffff, 1.9);
    light.position.set(-20, 40, 60);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(20, 0, -30);
    scene.add(fill);
    let alive = true,
      dirty = true,
      frame = 0;
    let model: ReturnType<typeof createPlayer> | undefined;
    const textures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    const load = (name: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        const texture = loader.load(
          inventoryAssets + name,
          (loaded) => {
            if (!alive) {
              loaded.dispose();
              reject(Error("disposed"));
              return;
            }
            loaded.colorSpace = THREE.SRGBColorSpace;
            loaded.magFilter = THREE.NearestFilter;
            loaded.minFilter = THREE.NearestFilter;
            loaded.generateMipmaps = false;
            resolve(loaded);
          },
          undefined,
          reject,
        );
        textures.push(texture);
      });
    Promise.all([
      load("steve.png"),
      load("diamond-1.png"),
      load("diamond-2.png"),
      load("pickaxe.png"),
    ])
      .then(([skin, outer, inner, item]) => {
        if (!alive) return;
        model = createPlayer(skin, outer, inner, item.image);
        scene.add(model.player);
        dirty = true;
        element.dataset.ready = "true";
        element.dataset.modelParts =
          "head,body,right_arm,left_arm,right_leg,left_leg";
        element.dataset.equipment =
          "diamond_helmet,diamond_chestplate,diamond_leggings,diamond_boots,diamond_pickaxe";
        schedule();
      })
      .catch(() => {
        if (alive) setError(true);
      });
    const resize = () => {
      const w = element.clientWidth,
        h = element.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.left = (-20 * w) / h;
      camera.right = (20 * w) / h;
      camera.top = 20;
      camera.bottom = -20;
      camera.updateProjectionMatrix();
      dirty = true;
      schedule();
    };
    const move = (event: PointerEvent) => {
      if (!model) return;
      const rect = element.getBoundingClientRect(),
        scale = rect.height / 100;
      const horizontal = Math.atan(
        (rect.left + rect.width / 2 - event.clientX) / scale / 40,
      );
      const vertical = Math.atan(
        (rect.top + rect.height / 2 - event.clientY) / scale / 40,
      );
      const degree = Math.PI / 180;
      model.player.rotation.y = -horizontal * 20 * degree;
      model.player.rotation.x = vertical * 20 * degree;
      model.head.rotation.y = -horizontal * 20 * degree;
      model.head.rotation.x = -vertical * 20 * degree;
      element.dataset.bodyYaw = String(model.player.rotation.y);
      element.dataset.headYaw = String(
        model.head.rotation.y + model.player.rotation.y,
      );
      element.dataset.headPitch = String(model.head.rotation.x);
      dirty = true;
      schedule();
    };
    function render() {
      frame = 0;
      if (!alive || document.hidden) return;
      if (dirty) {
        renderer.render(scene, camera);
        dirty = false;
        element.dataset.geometries = String(renderer.info.memory.geometries);
      }
    }
    function schedule() {
      if (alive && !frame && !document.hidden)
        frame = requestAnimationFrame(render);
    }
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        dirty = true;
        schedule();
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    window.addEventListener("pointermove", move);
    document.addEventListener("visibilitychange", visibility);
    const lost = (event: Event) => {
      event.preventDefault();
      setError(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((m) => materials.add(m));
        }
      });
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div
      ref={host}
      className="steve-model"
      role="img"
      aria-label="原版 Steve，钻石套装，手持钻石镐，视角跟随鼠标"
    >
      {error && (
        <span className="model-error">
          三维模型不可用，请检查 WebGL 与本地资源。
        </span>
      )}
    </div>
  );
}

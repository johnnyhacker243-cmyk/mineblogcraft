import { useEffect, useRef } from "react";
import * as THREE from "three";
// Original texture faces, a 16×12×16 table and hinged 6×10 book covers.
export function EnchantmentTable({ bookOnly = false }: { bookOnly?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current!;
    const scene = new THREE.Scene();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      node.dataset.fallback = "true";
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    node.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
    camera.position.set(29, 25, 35);
    camera.lookAt(0, 7, 0);
    if (bookOnly) {
      camera.position.set(12, 21, 22);
      camera.lookAt(0, 11, 0);
    }
    const textures: THREE.Texture[] = [];
    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const loader = new THREE.TextureLoader();
    const texture = (name: string) => {
      const t = loader.load(
        `/assets/inventory/${name}`,
        undefined,
        undefined,
        () => {
          node.dataset.fallback = "true";
        },
      );
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      textures.push(t);
      return t;
    };
    const material = (name: string, color = 0xffffff) => {
      const m = new THREE.MeshLambertMaterial({
        map: texture(name),
        color,
        transparent: true,
        side: THREE.DoubleSide,
      });
      materials.push(m);
      return m;
    };
    const side = material("enchanting-side.png"),
      top = material("enchanting-top.png"),
      bottom = material("enchanting-bottom.png");
    const box = new THREE.BoxGeometry(16, 12, 16);
    geometries.push(box);
    const table = new THREE.Mesh(box, [side, side, top, bottom, side, side]);
    table.position.y = 0;
    if (!bookOnly) scene.add(table);
    const book = new THREE.Group();
    book.position.y = 11;
    book.rotation.x = -Math.PI / 2;
    scene.add(book);
    const atlas = texture("book-cover-atlas.png");
    function surface(x: number, y: number, width: number, height: number) {
      const map = atlas.clone();
      map.repeat.set(width / 64, height / 32);
      map.offset.set(x / 64, 1 - (y + height) / 32);
      textures.push(map);
      const m = new THREE.MeshLambertMaterial({ map, side: THREE.DoubleSide });
      materials.push(m);
      return m;
    }
    const cover = surface(0, 0, 6, 10),
      paper = surface(0, 10, 5, 8);
    const wings = [-1, 1].map((sign) => {
      const hinge = new THREE.Group();
      book.add(hinge);
      const coverGeo = new THREE.BoxGeometry(6, 10, 0.35);
      geometries.push(coverGeo);
      const panel = new THREE.Mesh(coverGeo, cover);
      panel.position.x = sign * 3;
      hinge.add(panel);
      const pageGeo = new THREE.BoxGeometry(5.7, 8.8, 0.4);
      geometries.push(pageGeo);
      const pages = new THREE.Mesh(pageGeo, paper);
      pages.position.set(sign * 3, 0, 0.4);
      hinge.add(pages);
      return hinge;
    });
    const leafGeometry = new THREE.PlaneGeometry(5.5, 8.5);
    geometries.push(leafGeometry);
    const leaf = new THREE.Mesh(leafGeometry, paper);
    leaf.position.x = 2.75;
    const leafHinge = new THREE.Group();
    leafHinge.position.z = 0.8;
    leafHinge.add(leaf);
    book.add(leafHinge);
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const light = new THREE.DirectionalLight(0xfff0d7, 2.2);
    light.position.set(-15, 30, 30);
    scene.add(light);
    let pointer = 0,
      current = 0,
      frame = 0;
    const start = performance.now();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => {
      const { width, height } = node.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      pointer = Math.max(
        -0.4,
        Math.min(0.4, (e.clientX - r.left - r.width / 2) / r.width),
      );
    };
    node.addEventListener("pointermove", move);
    let previous = performance.now();
    const render = (now: number) => {
      const t = (now - start) / 1000,
        dt = Math.min(0.1, (now - previous) / 1000);
      previous = now;
      current += (pointer - current) * (1 - Math.exp(-6 * dt));
      const reduced = reduce.matches || !!node.closest(".reduced-motion");
      book.rotation.z = reduced ? 0.15 : current + 0.15;
      book.position.y = 11 + (reduced ? 0 : Math.sin(t * 1.7) * 0.6);
      wings.forEach((wing, i) => {
        wing.rotation.y =
          (i ? -1 : 1) * (0.3 + (reduced ? 0 : Math.sin(t) * 0.05));
      });
      leafHinge.rotation.y = reduced
        ? -0.8
        : -Math.PI * (0.5 + 0.48 * Math.sin(t * 1.3));
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      node.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [bookOnly]);
  return (
    <div className="enchantment-model" ref={host} aria-hidden="true">
      <img
        className="table-fallback"
        src={
          bookOnly
            ? "/assets/inventory/enchanted-book.png"
            : "/assets/inventory/enchanting-top.png"
        }
        alt=""
      />
    </div>
  );
}

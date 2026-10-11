import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { panorama } from "../config/panorama-config";
import { loadPanoramaCube, disposePanorama } from "../utils/panorama-cube";
export function PanoramaRenderer({
  dynamic,
  onSettled,
}: {
  dynamic: boolean;
  onSettled?: () => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("loading");
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;
  const dynamicRef = useRef(dynamic);
  dynamicRef.current = dynamic;
  useEffect(() => {
    let disposed = false,
      frame = 0,
      last = 0,
      elapsed = 0;
    let cube: THREE.Group | undefined;
    let renderer: THREE.WebGLRenderer;
    const host = mount.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(panorama.fov, 1, 0.05, 10);
    const model = new THREE.Group();
    model.rotation.x = Math.PI;
    scene.add(model);
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      renderer.setPixelRatio(
        Math.min(devicePixelRatio, panorama.pixelRatioCap),
      );
      renderer.autoClear = false;
      host.append(renderer.domElement);
    } catch {
      setStatus("fallback");
      settledRef.current?.();
      return;
    }
    const resize = () => {
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = (now: number) => {
      if (disposed || !cube) return;
      const dt = last ? Math.max((now - last) / 1000, 0) : 0;
      last = now;
      if (dynamicRef.current) elapsed += dt;
      const yaw = THREE.MathUtils.degToRad(
        (elapsed * panorama.yawDegreesPerSecond) % 360,
      );
      cube.rotation.order = "XYZ";
      cube.rotation.set(
        THREE.MathUtils.degToRad(panorama.pitchDegrees),
        -yaw,
        0,
      );
      host.dataset.yaw = String(yaw);
      renderer.clear();
      for (let pass = 0; pass < 4; pass++) {
        model.position.set(
          ((pass % 2) / 2 - 0.5) / 256,
          (Math.floor(pass / 2) / 2 - 0.5) / 256,
          0,
        );
        cube.children.forEach((obj) => {
          ((obj as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
            1 / (pass + 1);
        });
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(draw);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden && cube) frame = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", visibility);
    void loadPanoramaCube()
      .then((g) => {
        if (disposed) {
          disposePanorama(g);
          return;
        }
        cube = g;
        model.add(g);
        setStatus("ready");
        settledRef.current?.();
        if (!document.hidden) frame = requestAnimationFrame(draw);
      })
      .catch(() => {
        if (!disposed) {
          setStatus("fallback");
          settledRef.current?.();
        }
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      if (cube) disposePanorama(cube);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div className="panorama-layer">
      <div
        ref={mount}
        className="panorama"
        data-status={status}
        style={{
          backgroundImage: `url(${panorama.fallback})`,
          filter: `blur(calc(${panorama.blurLogicalPixels}px * var(--gui-scale-y))) brightness(${panorama.brightness})`,
        }}
      />
      {status === "ready" && (
        <img className="panorama-overlay" src={panorama.overlay} alt="" />
      )}
      {status === "fallback" && (
        <span className="fallback-note">
          Static background — WebGL or texture loading unavailable
        </span>
      )}
    </div>
  );
}

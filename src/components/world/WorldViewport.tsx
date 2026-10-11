import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createMuseum } from "../../utils/museum-scene";
import {
  worldConfig,
  worldEntrances,
  type WorldPose,
  type WorldEntrance,
} from "../../config/world-config";
export interface WorldControls {
  enter(): void;
  reset(): void;
}
export function WorldViewport({
  active,
  pose,
  onReady,
  onError,
  onPause,
  onNearby,
  onSave,
}: {
  active: boolean;
  pose: WorldPose;
  onReady: (c: WorldControls) => void;
  onError: (message: string) => void;
  onPause: () => void;
  onNearby: (e: WorldEntrance | null) => void;
  onSave: (pose: WorldPose) => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    refs = useRef({ active, onReady, onError, onPause, onNearby, onSave });
  refs.current = { active, onReady, onError, onPause, onNearby, onSave };
  useEffect(() => {
    const node = host.current!,
      scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb9d9e8);
    scene.fog = new THREE.Fog(0xb9d9e8, 60, 115);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch {
      refs.current.onError("WebGL 不可用，无法进入三维展馆。");
      return;
    }
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, worldConfig.pixelRatioCap),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    node.appendChild(renderer.domElement);
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute("aria-label", "MineWorld 第一人称展馆");
    const camera = new THREE.PerspectiveCamera(worldConfig.fov, 1, 0.05, 160);
    camera.rotation.order = "YXZ";
    let current = { ...pose },
      disposed = false,
      frame = 0,
      previous = 0,
      museum: Awaited<ReturnType<typeof createMuseum>> | undefined;
    const keys = new Set<string>();
    let dragging = false,
      lastX = 0,
      lastY = 0,
      wasLocked = false,
      nearby = "",
      ticks = 0;
    scene.add(new THREE.HemisphereLight(0xf4fbff, 0x65704e, 0.9));
    const sun = new THREE.DirectionalLight(0xffedd1, 1.2);
    sun.position.set(-40, 60, 30);
    scene.add(sun);
    const updateCamera = () => {
      camera.position.set(current.x, worldConfig.eyeHeight, current.z);
      camera.rotation.set(current.pitch, current.yaw, 0);
    };
    updateCamera();
    const resize = () => {
      const r = node.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / Math.max(1, r.height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    const look = (dx: number, dy: number) => {
      current.yaw -= dx * worldConfig.sensitivity;
      current.pitch = THREE.MathUtils.clamp(
        current.pitch - dy * worldConfig.sensitivity,
        -1.35,
        1.35,
      );
    };
    const mouse = (e: MouseEvent) => {
      if (!refs.current.active) return;
      if (document.pointerLockElement === renderer.domElement)
        look(e.movementX, e.movementY);
      else if (dragging) {
        look(e.clientX - lastX, e.clientY - lastY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const down = (e: PointerEvent) => {
      if (refs.current.active && e.button === 0) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        renderer.domElement.setPointerCapture(e.pointerId);
      }
    };
    const up = () => {
      dragging = false;
    };
    const keydown = (e: KeyboardEvent) => {
      if (
        refs.current.active &&
        [
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "ShiftLeft",
          "ShiftRight",
        ].includes(e.code)
      ) {
        keys.add(e.code);
        e.preventDefault();
      }
    };
    const keyup = (e: KeyboardEvent) => keys.delete(e.code);
    const clear = () => {
      keys.clear();
      dragging = false;
    };
    const lock = () => {
      const locked = document.pointerLockElement === renderer.domElement;
      if (wasLocked && !locked) {
        clear();
        refs.current.onPause();
      }
      wasLocked = locked;
    };
    const enter = () => {
      renderer.domElement.focus();
      try {
        const pending = renderer.domElement.requestPointerLock();
        pending?.catch(() => {
          /* Drag-to-look remains available. */
        });
      } catch {
        /* Drag-to-look remains available. */
      }
    };
    const reset = () => {
      current = { ...worldConfig.spawn };
      clear();
    };
    const visibility = () => {
      clear();
      cancelAnimationFrame(frame);
      previous = 0;
      if (!document.hidden && !disposed && museum)
        frame = requestAnimationFrame(render);
    };
    const contextLost = (e: Event) => {
      e.preventDefault();
      clear();
      refs.current.onError("三维画面已中断，请返回后重新进入。");
    };
    function render(now: number) {
      if (disposed || !museum) return;
      const dt = previous ? Math.min(0.15, (now - previous) / 1000) : 0;
      previous = now;
      if (!refs.current.active) clear();
      if (refs.current.active) {
        let forward =
            Number(keys.has("KeyW") || keys.has("ArrowUp")) -
            Number(keys.has("KeyS") || keys.has("ArrowDown")),
          side =
            Number(keys.has("KeyD") || keys.has("ArrowRight")) -
            Number(keys.has("KeyA") || keys.has("ArrowLeft"));
        const length = Math.hypot(forward, side);
        if (length) {
          forward /= length;
          side /= length;
          const speed =
            keys.has("ShiftLeft") || keys.has("ShiftRight")
              ? worldConfig.sprintSpeed
              : worldConfig.speed;
          const next = museum.collision.move(
            current.x,
            current.z,
            (-Math.sin(current.yaw) * forward + Math.cos(current.yaw) * side) *
              speed *
              dt,
            (-Math.cos(current.yaw) * forward - Math.sin(current.yaw) * side) *
              speed *
              dt,
          );
          current = { ...current, ...next };
        }
      }
      updateCamera();
      museum.update(
        now / 1000,
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
          !!node.closest(".reduced-motion"),
      );
      renderer.render(scene, camera);
      const e =
        worldEntrances
          .map((e) => ({ e, d: Math.hypot(e.x - current.x, e.z - current.z) }))
          .filter((v) => v.d < 3)
          .sort((a, b) => a.d - b.d)[0]?.e ?? null;
      if ((e?.id ?? "") !== nearby) {
        nearby = e?.id ?? "";
        refs.current.onNearby(e);
      }
      {
        node.dataset.x = current.x.toFixed(3);
        node.dataset.z = current.z.toFixed(3);
        node.dataset.yaw = current.yaw.toFixed(3);
        if (++ticks % 10 === 0)
          node.dataset.drawCalls = String(renderer.info.render.calls);
      }
      frame = requestAnimationFrame(render);
    }
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", clear);
    window.addEventListener("mousemove", mouse);
    document.addEventListener("pointerlockchange", lock);
    document.addEventListener("visibilitychange", visibility);
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    void createMuseum(scene)
      .then((built) => {
        if (disposed) {
          built.dispose();
          return;
        }
        museum = built;
        node.dataset.blocks = String(built.blockCount);
        node.dataset.ready = "true";
        refs.current.onReady({ enter, reset });
        if (!document.hidden) frame = requestAnimationFrame(render);
      })
      .catch(() => {
        if (!disposed)
          refs.current.onError("展馆资源加载失败，请检查本地游戏素材。");
      });
    return () => {
      disposed = true;
      refs.current.onSave({ ...current });
      cancelAnimationFrame(frame);
      clear();
      observer.disconnect();
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", clear);
      window.removeEventListener("mousemove", mouse);
      document.removeEventListener("pointerlockchange", lock);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      if (document.pointerLockElement === renderer.domElement)
        document.exitPointerLock();
      museum?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);
  return <div className="world-viewport" ref={host} />;
}

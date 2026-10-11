import { worldConfig } from "../config/world-config";
export interface Solid {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}
export class WorldCollision {
  private cells = new Map<string, Solid[]>();
  add(s: Solid) {
    for (let x = Math.floor(s.minX); x <= Math.floor(s.maxX); x++)
      for (let z = Math.floor(s.minZ); z <= Math.floor(s.maxZ); z++) {
        const key = `${x},${z}`;
        const list = this.cells.get(key) ?? [];
        list.push(s);
        this.cells.set(key, list);
      }
  }
  blocked(x: number, z: number) {
    const r = worldConfig.radius;
    if (Math.abs(x) > 48 - r || Math.abs(z) > 48 - r) return true;
    for (let xx = Math.floor(x - r); xx <= Math.floor(x + r); xx++)
      for (let zz = Math.floor(z - r); zz <= Math.floor(z + r); zz++)
        for (const s of this.cells.get(`${xx},${zz}`) ?? []) {
          const dx = x - Math.max(s.minX, Math.min(s.maxX, x)),
            dz = z - Math.max(s.minZ, Math.min(s.maxZ, z));
          if (dx * dx + dz * dz < r * r) return true;
        }
    return false;
  }
  move(x: number, z: number, dx: number, dz: number) {
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.12));
    for (let i = 0; i < steps; i++) {
      if (!this.blocked(x + dx / steps, z)) x += dx / steps;
      if (!this.blocked(x, z + dz / steps)) z += dz / steps;
    }
    return { x, z };
  }
}

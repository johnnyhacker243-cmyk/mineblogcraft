import * as THREE from "three";
import { worldEntrances } from "../config/world-config";
import { WorldCollision } from "./world-collision";
import { loadBitmapFont, textWidth } from "./bitmap-font";
export async function createMuseum(scene: THREE.Scene) {
  const collision = new WorldCollision(),
    textures: THREE.Texture[] = [],
    materials: THREE.Material[] = [],
    geometries: THREE.BufferGeometry[] = [];
  const loader = new THREE.TextureLoader();
  const names = [
    "world-stone",
    "world-chiseled",
    "world-wood",
    "world-copper",
    "world-lantern",
    "world-glass",
    "world-obsidian",
    "world-portal",
    "world-anvil",
    "world-redstone",
    "world-quartz",
    "world-leaves",
    "bookshelf",
    "crafting-top",
    "crafting-side",
    "grass",
    "dirt",
    "enchanting-top",
    "enchanting-side",
    "enchanted-book",
    "book-cover-atlas",
  ];
  const maps = new Map<string, THREE.Texture>();
  const group = new THREE.Group();
  try {
    const loaded = await Promise.allSettled(
      names.map(async (name) => {
        const t = await loader.loadAsync(`/assets/inventory/${name}.png`);
        t.magFilter = THREE.NearestFilter;
        t.minFilter = THREE.NearestFilter;
        t.colorSpace = THREE.SRGBColorSpace;
        textures.push(t);
        maps.set(name, t);
      }),
    );
    if (loaded.some((result) => result.status === "rejected"))
      throw Error("Museum texture unavailable");
    const mats = new Map<string, THREE.Material>();
    for (const [name, map] of maps) {
      const m = new THREE.MeshLambertMaterial({
        map,
        transparent: name === "world-glass" || name === "world-leaves",
        depthWrite: name !== "world-glass",
        alphaTest: name === "world-leaves" ? 0.5 : 0,
        side: THREE.DoubleSide,
        color:
          name === "grass"
            ? 0x83ad4d
            : name === "world-leaves"
              ? 0x639444
              : 0xffffff,
        emissive: name === "world-lantern" ? 0x8cbabe : 0x000000,
        emissiveIntensity: 0.5,
      });
      materials.push(m);
      mats.set(name, m);
    }
    const blocks = new Map<string, THREE.Vector3[]>();
    function block(
      name: string,
      x: number,
      y: number,
      z: number,
      solid = true,
    ) {
      const list = blocks.get(name) ?? [];
      list.push(new THREE.Vector3(x, y + 0.5, z));
      blocks.set(name, list);
      if (solid && y < 1.8)
        collision.add({
          minX: x - 0.5,
          maxX: x + 0.5,
          minZ: z - 0.5,
          maxZ: z + 0.5,
        });
    }
    function prism(
      name: string,
      x1: number,
      x2: number,
      y1: number,
      y2: number,
      z1: number,
      z2: number,
      solid = true,
    ) {
      for (let x = x1; x <= x2; x++)
        for (let y = y1; y <= y2; y++)
          for (let z = z1; z <= z2; z++) block(name, x, y, z, solid);
    }
    function floor(
      name: string,
      x1: number,
      x2: number,
      z1: number,
      z2: number,
      y = 0.01,
    ) {
      const map = maps.get(name)!.clone();
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(x2 - x1, z2 - z1);
      textures.push(map);
      const m = new THREE.MeshLambertMaterial({
        map,
        side: THREE.DoubleSide,
        color: name === "grass" ? 0x83ad4d : 0xffffff,
      });
      materials.push(m);
      const g = new THREE.PlaneGeometry(x2 - x1, z2 - z1);
      geometries.push(g);
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
      group.add(mesh);
    }
    floor("grass", -50, 50, -50, 50, -0.025);
    floor("world-stone", -9, 9, 24, 48);
    floor("world-quartz", -12, 12, -24, 25);
    floor("world-wood", -32, -12, -24, 20);
    floor("world-wood", 12, 32, -24, 20);
    floor("world-wood", -12, 12, -41, -24);
    // Copper inlaid promenade; contiguous floor, no steps to snag walking.
    floor("world-copper", -1, 1, -24, 25, 0.025);
    for (const x of [-12, 12])
      for (let z = -23; z <= 24; z++)
        for (let y = 0; y < 9; y++) {
          if ((Math.abs(z + 13) <= 2 || Math.abs(z - 8) <= 2) && y < 4)
            continue;
          block(
            y === 0 || y >= 7
              ? "world-chiseled"
              : y >= 3 && y <= 5 && z % 7 !== 0
                ? "world-glass"
                : "world-stone",
            x,
            y,
            z,
          );
        }
    for (let x = -12; x <= 12; x++)
      for (let y = 0; y < 9; y++)
        if (!(Math.abs(x) <= 3 && y < 5))
          block(y >= 7 ? "world-chiseled" : "world-stone", x, y, 25);
    for (let x = -12; x <= 12; x++)
      for (let y = 0; y < 9; y++)
        if (!(Math.abs(x) <= 3 && y < 4)) block("world-stone", x, y, -24);
    // Five wings: two flanking pairs and one apse, connected by generous doorways.
    for (const sign of [-1, 1]) {
      const outer = sign * 32;
      for (let z = -24; z <= 20; z++)
        for (let y = 0; y < 6; y++)
          block(
            y >= 2 && y <= 4 && z % 6 !== 0 ? "world-glass" : "world-stone",
            outer,
            y,
            z,
          );
      for (const z of [-24, -2, 20])
        prism(
          "world-stone",
          sign < 0 ? -32 : 13,
          sign < 0 ? -13 : 32,
          0,
          5,
          z,
          z,
        );
      floor(
        "world-wood",
        sign < 0 ? -32 : 12,
        sign < 0 ? -12 : 32,
        -24,
        21,
        6.01,
      );
      for (let z = -24; z <= 20; z += 6)
        prism("world-chiseled", outer, outer, 0, 6, z, z);
    }
    prism("world-stone", -12, 12, 0, 5, -41, -41);
    for (const x of [-12, 12]) prism("world-stone", x, x, 0, 5, -40, -25);
    floor("world-wood", -12, 12, -42, -24, 6.01);
    // Glazed nave with repeated dark oak trusses and sea lantern chandeliers.
    for (let z = -24; z <= 25; z++)
      for (let x = -12; x <= 12; x++)
        block(
          x === -12 || x === 12 || z % 8 === 1 ? "world-wood" : "world-glass",
          x,
          9,
          z,
          false,
        );
    for (let z = -19; z <= 21; z += 8) {
      for (const x of [-9, 9]) {
        prism("world-chiseled", x, x, 0, 7, z, z);
        block("world-copper", x, 7, z);
      }
      for (const x of [-4, 4]) {
        prism("world-copper", x, x, 6, 8, z, z, false);
        block("world-lantern", x, 5, z, false);
      }
    }
    // Classical entrance portico and copper pediment.
    for (const x of [-9, -5, 5, 9]) {
      prism("world-chiseled", x, x, 0, 7, 27, 27);
      block("world-copper", x, 7, 27);
    }
    prism("world-stone", -10, 10, 8, 8, 25, 28, false);
    for (let y = 9; y <= 12; y++)
      prism("world-copper", -(12 - y) * 3, (12 - y) * 3, y, y, 26, 26, false);
    for (const x of [-8, 8])
      for (let z = 33; z <= 45; z += 6) {
        block("world-chiseled", x, 0, z);
        block("world-lantern", x, 1, z);
      }
    for (const x of [-39, 39])
      for (const z of [-30, 0, 28]) {
        prism("world-wood", x, x, 0, 3, z, z);
        prism("world-leaves", x - 2, x + 2, 4, 5, z - 2, z + 2);
        block("world-leaves", x, 6, z);
      }
    // Knowledge library: shelves, central reading desk, books on plinths.
    for (const x of [-30, -26]) prism("bookshelf", x, x, 0, 3, -21, -6);
    prism("bookshelf", -24, -15, 0, 3, -22, -22);
    prism("world-wood", -24, -21, 0, 0, -12, -10);
    // Research vitrines; books remain visible through original glass faces.
    for (const x of [20, 27])
      for (const z of [-19, -7]) {
        block("world-quartz", x, 0, z);
        block("world-copper", x, 1, z);
        block("world-glass", x, 3, z, false);
      }
    for (const x of [20, 27])
      for (const z of [-19, -7]) {
        const g = new THREE.BoxGeometry(1.6, 1.6, 1.6);
        geometries.push(g);
        const display = new THREE.Mesh(g, mats.get("world-glass")!);
        display.position.set(x, 2.8, z);
        group.add(display);
      }
    // Workshop benches, redstone apparatus and a block-built anvil.
    for (let x = -29; x <= -23; x++) {
      block("crafting-side", x, 0, 16);
      block("crafting-top", x, 1, 16, false);
    }
    prism("world-redstone", -29, -27, 0, 0, 3, 3);
    block("world-lantern", -28, 1, 3);
    block("world-copper", -26, 0, 3);
    for (const [w, h, d, y] of [
      [1, 0.2, 0.9, 0.1],
      [0.45, 0.6, 0.5, 0.5],
      [1.5, 0.35, 0.65, 0.975],
    ]) {
      const g = new THREE.BoxGeometry(w, h, d);
      geometries.push(g);
      const anvil = new THREE.Mesh(g, mats.get("world-anvil")!);
      anvil.position.set(-23, y, 4);
      group.add(anvil);
    }
    collision.add({ minX: -23.75, maxX: -22.25, minZ: 3.55, maxZ: 4.45 });
    // Portal chamber: obsidian ring and animated native portal atlas.
    prism("world-obsidian", 24, 24, 0, 4, 5, 5);
    prism("world-obsidian", 29, 29, 0, 4, 5, 5);
    prism("world-obsidian", 24, 29, 0, 0, 5, 5);
    prism("world-obsidian", 24, 29, 5, 5, 5, 5, false);
    const portalMap = maps.get("world-portal")!.clone();
    const frames = portalMap.image.height / portalMap.image.width;
    portalMap.repeat.set(1, 1 / frames);
    textures.push(portalMap);
    const pm = new THREE.MeshBasicMaterial({
      map: portalMap,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    materials.push(pm);
    const pg = new THREE.PlaneGeometry(4, 4);
    geometries.push(pg);
    const portal = new THREE.Mesh(pg, pm);
    portal.position.set(26.5, 3, 5.01);
    group.add(portal);
    // Enchantment room, original block faces and floating book exhibit.
    prism("bookshelf", -10, 10, 0, 3, -40, -40);
    for (const x of [-9, 9]) prism("bookshelf", x, x, 0, 3, -38, -33);
    const tableG = new THREE.BoxGeometry(2, 1.5, 2);
    geometries.push(tableG);
    const table = new THREE.Mesh(tableG, [
      mats.get("enchanting-side")!,
      mats.get("enchanting-side")!,
      mats.get("enchanting-top")!,
      mats.get("world-obsidian")!,
      mats.get("enchanting-side")!,
      mats.get("enchanting-side")!,
    ]);
    table.position.set(0, 0.75, -36);
    group.add(table);
    collision.add({ minX: -1, maxX: 1, minZ: -37, maxZ: -35 });
    const purple = new THREE.PointLight(0x9569ff, 15, 12, 2);
    purple.position.set(0, 3, -36);
    group.add(purple);
    const glow = new THREE.PointLight(0xa959ff, 18, 14, 2);
    glow.position.set(26, 3, 7);
    group.add(glow);
    function item(x: number, y: number, z: number) {
      const g = new THREE.PlaneGeometry(1.2, 1.2);
      geometries.push(g);
      const m = new THREE.MeshBasicMaterial({
        map: maps.get("enchanted-book"),
        transparent: true,
        alphaTest: 0.1,
        side: THREE.DoubleSide,
      });
      materials.push(m);
      const book = new THREE.Mesh(g, m);
      book.position.set(x, y, z);
      group.add(book);
      return book;
    }
    const books = [
      item(-22, 1.2, -11),
      item(0, 2.8, -36),
      ...[
        [20, -19],
        [27, -19],
        [20, -7],
        [27, -7],
      ].map(([x, z]) => item(x, 2.8, z)),
    ];
    for (const e of worldEntrances) {
      block("world-copper", e.x, 0, e.z - 2);
      block("world-lantern", e.x, 1, e.z - 2);
    }
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geometries.push(geo);
    const transform = new THREE.Matrix4();
    let blockCount = 0;
    for (const [name, list] of blocks) {
      const mesh = new THREE.InstancedMesh(geo, mats.get(name)!, list.length);
      list.forEach((v, i) => {
        transform.makeTranslation(v.x, v.y, v.z);
        mesh.setMatrixAt(i, transform);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
      group.add(mesh);
      blockCount += list.length;
    }
    const font = await loadBitmapFont();
    function sign(
      text: string,
      x: number,
      y: number,
      z: number,
      rotation = 0,
      width = 5,
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(128, textWidth(font, text) + 12);
      canvas.height = 24;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#30251c";
      ctx.fillRect(0, 0, canvas.width, 24);
      ctx.fillStyle = "#b18e58";
      ctx.fillRect(0, 0, canvas.width, 1);
      ctx.fillRect(0, 23, canvas.width, 1);
      let xx = (canvas.width - textWidth(font, text)) / 2;
      for (const ch of text) {
        const g = font.glyphs.get(ch);
        if (g) {
          ctx.drawImage(
            g.image,
            g.x,
            g.y,
            g.width,
            g.cellHeight,
            xx,
            8 + g.offsetY,
            g.width * g.ratio,
            g.cellHeight * g.ratio,
          );
          xx += g.advance;
        }
      }
      // Retain source bitmap glyphs but tint the sign lettering ivory.
      const ink = ctx.getImageData(0, 2, canvas.width, 20);
      for (let i = 0; i < ink.data.length; i += 4)
        if (
          ink.data[i + 3] &&
          ink.data[i] > 170 &&
          ink.data[i + 1] > 170 &&
          ink.data[i + 2] > 170
        ) {
          ink.data[i] = 255;
          ink.data[i + 1] = 238;
          ink.data[i + 2] = 179;
        }
      ctx.putImageData(ink, 0, 2);
      const t = new THREE.CanvasTexture(canvas);
      t.magFilter = t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      textures.push(t);
      const m = new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide });
      materials.push(m);
      const g = new THREE.PlaneGeometry(width, (width * 24) / canvas.width);
      geometries.push(g);
      const plaque = new THREE.Mesh(g, m);
      plaque.position.set(x, y, z);
      plaque.rotation.y = rotation;
      group.add(plaque);
    }
    sign("MINEBLOGCRAFT", 0, 6, 28.51, 0, 9);
    sign("MAIN HALL", 0, 5.5, 24.4, Math.PI, 5);
    for (const e of worldEntrances) {
      sign(e.name, e.x, 1.3, e.z - 1.45, 0, 3.1);
    }
    sign("KNOWLEDGE HALL", -11.45, 4.7, -13, Math.PI / 2, 6);
    sign("RESEARCH GALLERY", 11.45, 4.7, -13, -Math.PI / 2, 6);
    sign("PROJECT WORKSHOP", -11.45, 4.7, 8, Math.PI / 2, 6);
    sign("PORTAL ROOM", 11.45, 4.7, 8, -Math.PI / 2, 6);
    sign("STATUS CHAMBER", 0, 4.7, -23.4, 0, 6);
    scene.add(group);
    return {
      collision,
      blockCount,
      update: (t: number, reduced: boolean) => {
        if (reduced) return;
        portalMap.offset.y = (Math.floor(t * 8) % frames) / frames;
        books.forEach((b, i) => {
          b.position.y = (i === 0 ? 1.2 : 2.8) + Math.sin(t * 1.5 + i) * 0.08;
          b.rotation.y = Math.sin(t * 0.5 + i) * 0.1;
        });
      },
      dispose: () => {
        scene.remove(group);
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
      },
    };
  } catch (e) {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    throw e;
  }
}

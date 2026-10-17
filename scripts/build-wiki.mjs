import { readdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
export async function compileWiki() {
  const nodes = [];
  for (const name of (await readdir("content/wiki"))
    .filter((n) => n.endsWith(".md"))
    .sort()) {
    const raw = await readFile(`content/wiki/${name}`, "utf8");
    const header = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!header || !header[1].includes('kind: "node"')) continue;
    const meta = Object.fromEntries(
      header[1].split(/\r?\n/).map((line) => {
        const i = line.indexOf(":");
        return [line.slice(0, i), JSON.parse(line.slice(i + 1).trim())];
      }),
    );
    const body = raw.slice(header[0].length).trim();
    const relatedNodeIds = [
      ...new Set(
        [...body.matchAll(/\[\[([a-z0-9-]+)\]\]/g)]
          .map((m) => m[1])
          .filter((id) => id !== "index"),
      ),
    ];
    const sections = body
      .split(/^## /m)
      .slice(1)
      .filter((s) => !s.startsWith("相关知识"))
      .map((s) => {
        const i = s.indexOf("\n");
        return {
          title: s.slice(0, i).trim(),
          text: s
            .slice(i + 1)
            .replace(/\n出处：[^\n]+/g, "")
            .trim(),
        };
      });
    nodes.push({
      ...meta,
      sections,
      relatedNodeIds,
      file: `content/wiki/${name}`,
      body,
    });
  }
  const ids = new Set(nodes.map((n) => n.id));
  assert.equal(ids.size, nodes.length);
  const visiting = new Set(),
    visited = new Set();
  const visit = (n) => {
    assert.ok(!visiting.has(n.id), `Prerequisite cycle: ${n.id}`);
    if (visited.has(n.id)) return;
    visiting.add(n.id);
    for (const id of n.parentIds) {
      assert.ok(ids.has(id), `Missing parent: ${id}`);
      visit(nodes.find((n) => n.id === id));
    }
    visiting.delete(n.id);
    visited.add(n.id);
  };
  for (const n of nodes) {
    assert.match(n.updated, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(n.tags.length);
    assert.ok(n.relatedNodeIds.length, `Isolated node: ${n.id}`);
    for (const id of n.relatedNodeIds)
      assert.ok(ids.has(id), `Dead Wiki link ${n.id} -> ${id}`);
    visit(n);
    n.backlinks = nodes
      .filter((o) => o.relatedNodeIds.includes(n.id))
      .map((o) => ({ id: o.id, title: o.title }));
    n.relatedNodes = n.relatedNodeIds.map((id) => ({
      id,
      title: nodes.find((n) => n.id === id).title,
    }));
  }
  const depths = new Map();
  const depth = (n) => {
    if (!depths.has(n.id))
      depths.set(
        n.id,
        n.parentIds.length
          ? 1 +
              Math.max(
                ...n.parentIds
                  .filter(
                    (id) =>
                      nodes.find((p) => p.id === id).category === n.category,
                  )
                  .map((id) => depth(nodes.find((p) => p.id === id))),
                -1,
              )
          : 0,
      );
    return depths.get(n.id);
  };
  const rows = new Map();
  nodes.sort((a, b) => depth(a) - depth(b) || a.id.localeCompare(b.id));
  for (const n of nodes) {
    const d = depth(n),
      key = `${n.category}:${d}`,
      r = rows.get(key) || 0;
    n.x = 40 + d * 130;
    n.y = 36 + r * 92;
    rows.set(key, r + 1);
  }
  await writeFile("src/data/wiki.json", JSON.stringify(nodes, null, 2) + "\n");
  return nodes;
}
const nodes = await compileWiki();
console.log(
  `Compiled ${nodes.length} Wiki pages with source evidence and backlinks.`,
);

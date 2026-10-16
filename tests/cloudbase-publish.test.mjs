import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  validManifest,
  changedFiles,
  collectManifest,
} from "../scripts/prepare-cloudbase-publish.mjs";
const file = (name, hash = "a".repeat(64)) => ({
  path: name,
  sha256: hash,
  size: 10,
});
const manifest = (...files) => ({ version: 1, files });
test("Unchanged large assets are skipped while entry points are always published", () => {
  const current = manifest(
    file("index.html"),
    file("mineworld/index.html"),
    file("deployment.json"),
    file("game.wasm"),
  );
  assert.deepEqual(
    changedFiles(current, current).map((f) => f.path),
    ["index.html", "mineworld/index.html", "deployment.json"],
  );
});
test("Added and changed files are published; removed remote files are never deleted", () => {
  const previous = manifest(
    file("same.png"),
    file("changed.md"),
    file("old.js"),
  );
  const current = manifest(
    file("same.png"),
    file("changed.md", "b".repeat(64)),
    file("new.js"),
  );
  assert.deepEqual(
    changedFiles(current, previous).map((f) => f.path),
    ["changed.md", "new.js"],
  );
  assert.equal(changedFiles(current, null).length, 3);
});
test("Malformed, duplicate or escaping manifests cannot skip local files", () => {
  const current = manifest(file("safe.png"));
  for (const previous of [
    manifest(null),
    manifest(file("../safe.png")),
    manifest(file("a\\b")),
    manifest(file("safe.png"), file("safe.png")),
    manifest({ ...file("safe.png"), size: -1 }),
  ]) {
    assert.equal(validManifest(previous), false);
    assert.deepEqual(changedFiles(current, previous), current.files);
  }
  assert.throws(() => changedFiles(manifest(file("/etc/passwd")), null));
});
test("Manifest records actual bytes and excludes itself", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "mine-publish-"));
  try {
    await writeFile(path.join(directory, "sample.txt"), "test");
    await writeFile(
      path.join(directory, "deployment-files.json"),
      "old manifest",
    );
    const result = await collectManifest(directory);
    assert.equal(result.files.length, 1);
    assert.equal(result.files[0].size, 4);
    assert.equal(
      result.files[0].sha256,
      "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    );
    assert.equal(validManifest(result), true);
  } finally {
    assert.equal(path.dirname(directory), path.resolve(tmpdir()));
    await rm(directory, { recursive: true, force: true });
  }
});

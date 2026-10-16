import { createHash } from "node:crypto";
import {
  readdir,
  readFile,
  mkdir,
  copyFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const manifestName = "deployment-files.json";
const safePath = (value) =>
  typeof value === "string" &&
  value.length > 0 &&
  !value.startsWith("/") &&
  !/[\\\x00-\x1f?#:]/.test(value) &&
  value.split("/").every((part) => part && part !== "." && part !== "..");

export function validManifest(value) {
  return (
    value?.version === 1 &&
    Array.isArray(value.files) &&
    value.files.length > 0 &&
    value.files.length <= 10000 &&
    value.files.every(
      (file) =>
        file &&
        safePath(file.path) &&
        /^[a-f0-9]{64}$/.test(file.sha256) &&
        Number.isSafeInteger(file.size) &&
        file.size >= 0,
    ) &&
    new Set(value.files.map((file) => file.path)).size === value.files.length
  );
}

export function changedFiles(current, previous) {
  if (!validManifest(current)) throw Error("Invalid local publish manifest");
  const old = new Map(
    validManifest(previous)
      ? previous.files.map((file) => [file.path, file])
      : [],
  );
  return current.files.filter((file) => {
    // Entry points are always published last by the CLI. No remote files are deleted.
    if (/(^|\/)index\.html$/.test(file.path) || file.path === "deployment.json")
      return true;
    const existing = old.get(file.path);
    return (
      !existing ||
      existing.sha256 !== file.sha256 ||
      existing.size !== file.size
    );
  });
}

export async function collectManifest(source) {
  const files = [];
  async function walk(directory, prefix = "") {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = prefix + entry.name;
      if (!safePath(relative)) throw Error("Invalid local publish path");
      if (entry.isSymbolicLink())
        throw Error("Publish source must not contain symlinks");
      if (entry.isDirectory())
        await walk(path.join(directory, entry.name), relative + "/");
      else if (entry.isFile() && relative !== manifestName) {
        const bytes = await readFile(path.join(directory, entry.name));
        files.push({
          path: relative,
          size: bytes.length,
          sha256: createHash("sha256").update(bytes).digest("hex"),
        });
      }
    }
  }
  await walk(source);
  return {
    version: 1,
    files: files.sort((a, b) => a.path.localeCompare(b.path, "en")),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const get = (flag) => args[args.indexOf(flag) + 1];
  for (const flag of ["--source", "--output", "--base"])
    if (!args.includes(flag) || !get(flag)) throw Error(`Missing ${flag}`);
  const source = path.resolve(get("--source")),
    output = path.resolve(get("--output"));
  if (
    source === output ||
    output.startsWith(source + path.sep) ||
    source.startsWith(output + path.sep)
  )
    throw Error("Publish output must be separate from source");
  // A fresh directory prevents leftovers from an earlier publish entering this release.
  try {
    await mkdir(output);
  } catch (error) {
    if (error.code === "EEXIST")
      throw Error("Publish output already exists; choose a fresh directory");
    throw error;
  }
  const base = new URL(get("--base"));
  if (base.protocol !== "https:" || base.username || base.password)
    throw Error("Invalid hosting origin");
  let previous;
  try {
    const url = new URL(manifestName, base);
    url.searchParams.set(
      "verify",
      process.env.GITHUB_SHA ?? String(Date.now()),
    );
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { "Cache-Control": "no-cache" },
    });
    if (response.ok) {
      const raw = await response.text();
      if (raw.length > 2_000_000)
        throw Error("Remote publish manifest too large");
      previous = JSON.parse(raw);
    }
  } catch {
    console.warn("No valid prior publish manifest; uploading the full build.");
  }
  const current = await collectManifest(source),
    changed = changedFiles(current, previous);
  for (const file of changed) {
    const destination = path.join(output, file.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(source, file.path), destination);
  }
  await writeFile(
    path.join(output, manifestName),
    JSON.stringify(current) + "\n",
  );
  console.log(
    `Publish ${changed.length}/${current.files.length} files plus integrity manifest; retain unchanged remote files.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();

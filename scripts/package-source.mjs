import { execFileSync } from "node:child_process";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const git = (args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
if (git(["status", "--porcelain"]))
  throw Error(
    "Commit or resolve working-tree changes before exporting source.",
  );
const commit = git(["rev-parse", "HEAD"]),
  short = commit.slice(0, 7);
const folder = path.join(root, "deliverables");
await mkdir(folder, { recursive: true });
const archive = path.join(folder, `Mineblogcraft-source-${short}.zip`);
execFileSync(
  "git",
  [
    "archive",
    "--format=zip",
    "--prefix=mineblogcraft/",
    "--output=" + archive,
    commit,
  ],
  { cwd: root, stdio: "inherit" },
);
const bytes = await readFile(archive),
  sha256 = createHash("sha256").update(bytes).digest("hex");
await writeFile(
  archive + ".sha256",
  sha256 + "  " + path.basename(archive) + "\n",
);
await writeFile(
  path.join(folder, "SOURCE_DELIVERY.json"),
  JSON.stringify(
    {
      commit,
      archive: path.basename(archive),
      bytes: bytes.length,
      sha256,
      createdAt: new Date().toISOString(),
      scope:
        "All tracked files in this commit; Git metadata, dependencies, build output and ignored original media excluded.",
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify({ archive, commit, bytes: bytes.length, sha256 }));

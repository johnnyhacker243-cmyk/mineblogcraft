import { mkdir, copyFile } from "node:fs/promises";
await mkdir(new URL("../dist/mineworld/", import.meta.url), {
  recursive: true,
});
await copyFile(
  new URL("../dist/index.html", import.meta.url),
  new URL("../dist/mineworld/index.html", import.meta.url),
);

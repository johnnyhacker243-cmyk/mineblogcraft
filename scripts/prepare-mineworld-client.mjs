import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const clientName = "ClassiCube.mineworld-nopause-v1.js";
const sourceHash =
  "6fc9dfd8a0ca5c36624b1614669667f8f346d101a4335f743be031b5a8a12319";
const originalMenu = `function _Gui_ShowPauseMenu() {
 var $0 = 0, $tobool = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP8[(1090066)>>0]|0;
 $tobool = ($0<<24>>24)==(0);
 if ($tobool) {
  _PauseScreen_Show();
 } else {
  _ClassicPauseScreen_Show();
 }
 return;
}`;
const originalPause = "    HEAP8[1869857] = 1;\n    _Gui_ShowPauseMenu();";

export function prepareMineWorldClient(bytes) {
  if (createHash("sha256").update(bytes).digest("hex") !== sourceHash)
    throw Error(
      "Unsupported ClassiCube client; review the pause adapter before upgrading",
    );
  const source = bytes.toString("utf8");
  for (const site of [originalMenu, originalPause])
    if (source.split(site).length !== 2)
      throw Error("Pause adapter target is not unique");
  // Disable only the menu entry, including automatic pause. Do not swallow DOM
  // keys: native keydown/up must still close inventory, chat and other screens.
  // Without a menu, setting suppressEscape would swallow the NEXT inventory Esc.
  return source
    .replace(originalMenu, "function _Gui_ShowPauseMenu() {\n return;\n}")
    .replace(
      originalPause,
      "    return; /* MineWorld: no pause menu or pending Escape suppression. */",
    );
}

async function main() {
  const directory = new URL("../public/vendor/classicube/", import.meta.url);
  const bytes = await readFile(new URL("ClassiCube.js", directory));
  await writeFile(
    new URL(clientName, directory),
    prepareMineWorldClient(bytes),
  );
  console.log(
    "Prepared MineWorld client: pause menu disabled, native input preserved; upstream file unchanged.",
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();

"""Extract a fixed set of user-authorized 1.21.1 assets for local research.

Usage: python scripts/import-inventory.py --jar PATH [--assets PATH]
Requires Pillow. Outputs remain ignored by Git; never scans personal folders.
"""
import argparse
import hashlib
import io
import json
import zipfile
from pathlib import Path
from PIL import Image

p = argparse.ArgumentParser()
p.add_argument('--jar', required=True, type=Path)
p.add_argument('--assets', type=Path)
a = p.parse_args()
assert hashlib.sha1(a.jar.read_bytes()).hexdigest() == '30c73b1c5da787909b2f73340419fdf13b9def88', 'Expected original 1.21.1 client'
out = Path(__file__).resolve().parents[1] / 'public/assets/inventory'
out.mkdir(parents=True, exist_ok=True)
mapping = {
    'creative.png': 'gui/container/creative_inventory/tab_items.png',
    'inventory.png': 'gui/container/creative_inventory/tab_inventory.png',
    'dirt.png': 'block/dirt.png', 'grass.png': 'block/grass_block_top.png',
    'grass-side.png': 'block/grass_block_side.png', 'blue-ice.png': 'block/blue_ice.png',
    'crafting-top.png': 'block/crafting_table_top.png', 'crafting-side.png': 'block/crafting_table_side.png',
    'book.png': 'item/book.png', 'redstone.png': 'item/redstone.png', 'compass.png': 'item/compass_16.png',
    'steve.png': 'entity/player/wide/steve.png', 'diamond-1.png': 'models/armor/diamond_layer_1.png',
    'diamond-2.png': 'models/armor/diamond_layer_2.png', 'pickaxe.png': 'item/diamond_pickaxe.png',
    'diamond.png': 'item/diamond.png', 'sword.png': 'item/diamond_sword.png',
    'nether-star.png': 'item/nether_star.png',
    'torch.png': 'block/torch.png', 'dragon-egg.png': 'block/dragon_egg.png',
    'golden-apple.png': 'item/golden_apple.png', 'ender-pearl.png': 'item/ender_pearl.png',
    'tnt-top.png': 'block/tnt_top.png', 'tnt-side.png': 'block/tnt_side.png',
    'grass-overlay.png': 'block/grass_block_side_overlay.png',
    'heart-container.png': 'gui/sprites/hud/heart/container.png',
    'heart-full.png': 'gui/sprites/hud/heart/full.png',
    'food-empty.png': 'gui/sprites/hud/food_empty.png',
    'food-full.png': 'gui/sprites/hud/food_full.png',
}
for n in range(1, 7):
    state = 'selected' if n == 1 else 'unselected'
    mapping[f'tab-{n}.png'] = f'gui/sprites/container/creative_inventory/tab_top_{state}_{n}.png'
records = []
with zipfile.ZipFile(a.jar) as z:
    egg_model = z.read('assets/minecraft/models/block/dragon_egg.json')
    (out/'dragon-egg-model.json').write_bytes(egg_model)
    records.append({'file': 'dragon-egg-model.json', 'source': 'models/block/dragon_egg.json', 'sha1': hashlib.sha1(egg_model).hexdigest()})
    for dest, source in mapping.items():
        data = z.read('assets/minecraft/textures/' + source)
        (out / dest).write_bytes(data)
        records.append({'file': dest, 'source': source, 'sha1': hashlib.sha1(data).hexdigest()})
    # Keep source pixels: atlas corners, blank center, native 18x18 slot.
    original = Image.open(io.BytesIO(z.read('assets/minecraft/textures/gui/container/creative_inventory/tab_items.png'))).convert('RGBA')
    frame = Image.new('RGBA', (16, 16))
    for x, sx, w in [(0,0,7), (7,170,2), (9,188,7)]:
        for y, sy, h in [(0,0,7), (7,108,2), (9,129,7)]:
            frame.paste(original.crop((sx,sy,sx+w,sy+h)), (x,y))
    frame.save(out/'frame.png')
    original.crop((8,17,26,35)).save(out/'slot.png')
    # Vanilla grass side texture plus its biome-tinted overlay; source pixels
    # stay intact and only the normal game color multiplier is applied.
    from PIL import ImageChops
    grass = Image.open(io.BytesIO(z.read('assets/minecraft/textures/block/grass_block_side.png'))).convert('RGBA')
    overlay = Image.open(io.BytesIO(z.read('assets/minecraft/textures/block/grass_block_side_overlay.png'))).convert('RGBA')
    tinted = ImageChops.multiply(overlay,Image.new('RGBA',overlay.size,(145,189,89,255)))
    grass.alpha_composite(tinted)
    grass.save(out/'grass-border.png')

assets = a.assets or a.jar.parents[2] / 'assets'
unifont_hash = '666999116c467f10622db1527a06ddc0a6efad2a'
data = (assets/'objects'/unifont_hash[:2]/unifont_hash).read_bytes()
assert hashlib.sha1(data).hexdigest() == unifont_hash
with zipfile.ZipFile(io.BytesIO(data)) as z:
    lines = z.read('unifont_all_no_pua-15.1.05.hex').decode('ascii').splitlines()
    # BMP glyphs, retained locally. One monochrome atlas rather than a system font.
    glyphs = {int(line.split(':')[0],16): line.split(':')[1] for line in lines if int(line.split(':')[0],16) < 65536}
# Extract the current profile's glyphs, not a 64 MB full Unicode GPU/bitmap atlas.
# Re-run after adding profile text; the source .hex never leaves the client assets.
project = Path(__file__).resolve().parents[1]
characters = set(chr(n) for n in range(32,256))
for source in ['src/config/profile-config.ts','src/components/ProfilePanel.tsx','src/components/MinecraftInventory.tsx']:
    characters.update((project/source).read_text(encoding='utf-8'))
selected = sorted(code for code in glyphs if chr(code) in characters)
atlas = Image.new('RGBA', (256,((len(selected)+15)//16)*16))
metadata = {}
for index, code in enumerate(selected):
    bits = glyphs[code]
    w = len(bits)//4
    pixels = bytes.fromhex(bits)
    x, y = (index % 16)*16, (index//16)*16
    for yy in range(16):
        row = int.from_bytes(pixels[yy*(w//8):(yy+1)*(w//8)],'big')
        for xx in range(w):
            if row & (1 << (w-1-xx)): atlas.putpixel((x+xx,y+yy),(255,255,255,255))
    metadata[chr(code)] = [x,y,w]
atlas.save(out/'unifont.png')
(out/'font.json').write_text(json.dumps(metadata,ensure_ascii=False),encoding='utf-8')
(out/'PROVENANCE.json').write_text(json.dumps({'clientSha1':'30c73b1c5da787909b2f73340419fdf13b9def88','textures':records,'unifontSha1':unifont_hash,'scope':'User-authorized local research; excluded from Git'},indent=2),encoding='utf-8')
print(f'Imported {len(records)} original textures and {len(metadata)} bitmap glyphs to {out}')

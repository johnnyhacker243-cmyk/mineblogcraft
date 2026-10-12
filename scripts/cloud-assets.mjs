import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifestPath = path.join(root, 'cloud-assets.json');
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const assetPath = (name) => {
  if (!/^assets\/[a-zA-Z0-9_./-]+$/.test(name) || name.split('/').includes('..')) {
    throw new Error(`Invalid asset path: ${name}`);
  }
  return path.join(root, 'public', name);
};

if (process.argv.includes('--manifest')) {
  // Only runtime resources already excluded from Git; never include credentials or papers.
  const names = execFileSync('git', ['ls-files', '--others', '--ignored', '--exclude-standard', 'public/assets'], { cwd: root, encoding: 'utf8' })
    .trim().split(/\r?\n/).filter(Boolean)
    .filter((name) => !name.endsWith('PROVENANCE.json'));
  const files = [];
  for (const name of names) {
    const relative = name.slice('public/'.length);
    const bytes = await readFile(assetPath(relative));
    files.push({ path: relative, size: bytes.length, sha256: digest(bytes) });
  }
  await writeFile(manifestPath, JSON.stringify({ version: 1, baseUrl: 'https://jonhyblog-jonhyblog-d2ggh3rc306480701.webapps.tcloudbase.com/', files }, null, 2) + '\n');
  console.log(`Recorded ${files.length} runtime assets (file metadata only).`);
} else {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.version !== 1 || !Array.isArray(manifest.files) || !manifest.files.length) throw new Error('Invalid asset manifest');
  const base = new URL(manifest.baseUrl);
  if (base.protocol !== 'https:') throw new Error('Asset origin must use HTTPS');
  let cursor = 0;
  let restored = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (cursor < manifest.files.length) {
      const entry = manifest.files[cursor++];
      const destination = assetPath(entry.path);
      if (!/^[a-f0-9]{64}$/.test(entry.sha256) || !Number.isSafeInteger(entry.size) || entry.size <= 0) throw new Error('Invalid asset metadata');
      let existing;
      try { existing = await readFile(destination); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      if (existing && digest(existing) === entry.sha256) continue;
      if (process.argv.includes('--check')) throw new Error(`Missing or changed asset: ${entry.path}`);
      const response = await fetch(new URL(entry.path, base), { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`Asset download failed (${response.status}): ${entry.path}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length !== entry.size || digest(bytes) !== entry.sha256) throw new Error(`Asset checksum mismatch: ${entry.path}`);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes);
      restored++;
    }
  }));
  console.log(`Verified ${manifest.files.length} assets; restored ${restored}.`);
}

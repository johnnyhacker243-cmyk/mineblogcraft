import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

async function fixture(t, entry, bytes) {
  const directory = await mkdtemp(path.join(tmpdir(), 'mineblogcraft-assets-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, 'scripts'));
  await copyFile(new URL('../scripts/cloud-assets.mjs', import.meta.url), path.join(directory, 'scripts/cloud-assets.mjs'));
  await writeFile(path.join(directory, 'cloud-assets.json'), JSON.stringify({ version: 1, baseUrl: 'https://example.com/', files: [entry] }));
  if (bytes) {
    await mkdir(path.join(directory, 'public/assets'), { recursive: true });
    await writeFile(path.join(directory, 'public/assets/sample.png'), bytes);
  }
  return spawnSync(process.execPath, [path.join(directory, 'scripts/cloud-assets.mjs'), '--check'], { encoding: 'utf8' });
}
const bytes = Buffer.from('asset fixture');
const entry = { path: 'assets/sample.png', size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };

test('valid resources pass without contacting remote origin', async (t) => {
  const result = await fixture(t, entry, bytes);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /restored 0/);
});
test('missing resources block publication', async (t) => {
  const result = await fixture(t, entry);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing or changed asset/);
});
test('corrupted resources block publication', async (t) => {
  const result = await fixture(t, entry, Buffer.from('corrupted'));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing or changed asset/);
});
test('manifest cannot write outside public assets', async (t) => {
  const result = await fixture(t, { ...entry, path: 'assets/../../package.json' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid asset path/);
});

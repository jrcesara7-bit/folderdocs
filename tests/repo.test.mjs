/* Checks on this repository's own documentation. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../tools/lib/site.mjs';
import { scanDocs } from '../tools/lib/scan.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('the demo site builds without broken links', async () => {
  const { warnings } = await buildSite(ROOT, { env: {} });
  assert.deepEqual(warnings, []);
});

test('English and Spanish documentation have the same pages, paired by id', async () => {
  const ids = async (dir) => {
    const { pages } = await scanDocs(path.join(ROOT, dir));
    return pages.map((p) => p.meta.id);
  };
  const en = await ids('docs');
  const es = await ids('docs-es');
  assert.ok(en.every(Boolean), 'every English page has an id');
  assert.deepEqual([...es].sort(), [...en].sort());
});

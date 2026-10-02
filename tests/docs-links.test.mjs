import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findDocsDirs } from '../tools/build-nav.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.md')) yield full;
  }
}

const exists = async (file) => stat(file).then(() => true, () => false);

test('relative links in every docs folder point to files that exist', async () => {
  const broken = [];
  for (const docs of await findDocsDirs(ROOT)) {
    for await (const file of walk(docs)) {
      // Code blocks are skipped: links there are examples.
      const text = (await readFile(file, 'utf8')).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
      for (const [, href] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) continue;
        const target = path.resolve(path.dirname(file), href.split('#')[0]);
        const ok = (await exists(target)) || (await exists(path.join(target, 'index.md')));
        if (!ok) broken.push(`${path.relative(ROOT, file)} → ${href}`);
      }
    }
  }
  assert.deepEqual(broken, []);
});

test('both languages have the same number of pages', async () => {
  const count = async (dir) => {
    let n = 0;
    for await (const file of walk(dir)) n += file ? 1 : 0;
    return n;
  };
  assert.equal(await count(path.join(ROOT, 'docs-es')), await count(path.join(ROOT, 'docs')));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.md')) yield full;
  }
}

const exists = async (file) => stat(file).then(() => true, () => false);

test('los enlaces relativos de docs/ apuntan a archivos que existen', async () => {
  const broken = [];
  for await (const file of walk(DOCS)) {
    // Se ignoran los bloques de código: ahí los enlaces son ejemplos.
    const text = (await readFile(file, 'utf8')).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
    for (const [, href] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) continue;
      const target = path.resolve(path.dirname(file), href.split('#')[0]);
      const ok = (await exists(target)) || (await exists(path.join(target, 'index.md')));
      if (!ok) broken.push(`${path.relative(DOCS, file)} → ${href}`);
    }
  }
  assert.deepEqual(broken, []);
});

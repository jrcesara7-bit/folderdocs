import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildSite } from '../tools/build-site.mjs';

test('buildSite copies only what the browser needs and includes every language', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'folderdocs-site-'));
  const files = {
    'index.html': '<html></html>',
    'es/index.html': '<html lang="es"></html>',
    'assets/js/app.js': '//',
    'docs/index.md': '# Home\n',
    'docs/guide/a.md': '# A\n',
    'docs-es/index.md': '# Inicio\n',
    'docs-es/guia/a.md': '# A\n',
    'tools/serve.mjs': '//',
    'tests/x.test.mjs': '//',
    '.github/workflows/ci.yml': 'name: x',
    'README.md': '# readme',
  };
  try {
    for (const [rel, content] of Object.entries(files)) {
      await mkdir(path.dirname(path.join(root, rel)), { recursive: true });
      await writeFile(path.join(root, rel), content);
    }
    const copied = await buildSite(root);
    assert.deepEqual(copied, ['assets', 'docs', 'docs-es', 'es', 'index.html']);

    const site = path.join(root, '_site');
    assert.deepEqual((await readdir(site)).sort(), ['.nojekyll', 'assets', 'docs', 'docs-es', 'es', 'index.html']);
    assert.ok(existsSync(path.join(site, 'docs', 'nav.json')), 'English menu generated');
    assert.ok(existsSync(path.join(site, 'docs-es', 'nav.json')), 'Spanish menu generated');
    assert.ok(!existsSync(path.join(site, 'tools')), 'tools are not published');
  } finally { await rm(root, { recursive: true, force: true }); }
});

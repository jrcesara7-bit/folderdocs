import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildNav, findDocsDirs, writeAllNavs } from '../tools/build-nav.mjs';

/** Creates a temporary project from { 'path/file': 'content' } and returns its root. */
async function fixture(files) {
  const dir = await mkdtemp(path.join(tmpdir(), 'folderdocs-'));
  for (const [rel, content] of Object.entries(files)) {
    const file = path.join(dir, rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
  }
  return dir;
}

/** Builds the menu of a temporary docs/ folder. */
async function nav(files) {
  const dir = await fixture(files);
  try { return await buildNav(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}

test('each folder is a section and each .md a page', async () => {
  const result = await nav({
    'guide/one.md': '# One\n',
    'guide/two.md': '# Two\n',
  });
  assert.deepEqual(result, [{
    title: 'Guide',
    items: [
      { title: 'One', path: 'guide/one' },
      { title: 'Two', path: 'guide/two' },
    ],
  }]);
});

test('title comes from front matter, then the first H1, then the file name', async () => {
  const result = await nav({
    'a/x.md': '---\ntitle: From front matter\n---\n# Another title\n',
    'a/y.md': 'text\n\n# From the H1\n',
    'a/my-file.md': 'no heading\n',
  });
  const titles = result[0].items.map((i) => i.title);
  assert.deepEqual(titles.sort(), ['From front matter', 'From the H1', 'My file']);
});

test('a # inside a code block is not a title', async () => {
  const result = await nav({ 'a/page.md': '```bash\n# comment\n```\n' });
  assert.equal(result[0].items[0].title, 'Page');
});

test('order uses `order`, then numeric prefix, then alphabetical', async () => {
  const result = await nav({
    'a/zeta.md': '---\norder: 1\n---\n# Zeta\n',
    'a/10-ten.md': '# Ten\n',
    'a/02-two.md': '# Two\n',
    'a/beta.md': '# Beta\n',
    'a/alpha.md': '# Alpha\n',
  });
  assert.deepEqual(result[0].items.map((i) => i.title), ['Zeta', 'Two', 'Ten', 'Alpha', 'Beta']);
});

test('prefixes are compared as numbers, not as text', async () => {
  const result = await nav({ 'a/2-b.md': '# B\n', 'a/10-j.md': '# J\n' });
  assert.deepEqual(result[0].items.map((i) => i.title), ['B', 'J']);
});

test('_meta.json sets the folder title and order', async () => {
  const result = await nav({
    'b/p.md': '# P\n',
    'b/_meta.json': '{ "title": "Section B", "order": 2 }',
    'a/p.md': '# P\n',
    'a/_meta.json': '{ "title": "Section A", "order": 1 }',
  });
  assert.deepEqual(result.map((s) => s.title), ['Section A', 'Section B']);
});

test("a section's index.md appears as its first page", async () => {
  const result = await nav({
    's/index.md': '# Overview\n',
    's/other.md': '# Other\n',
  });
  assert.deepEqual(result[0].items.map((i) => i.path), ['s/index', 's/other']);
});

test("a subfolder's index.md is the group's page and is not repeated as a child", async () => {
  const result = await nav({
    's/g/index.md': '# Group\n',
    's/g/child.md': '# Child\n',
  });
  assert.deepEqual(result[0].items, [{
    title: 'Group',
    path: 's/g/index',
    items: [{ title: 'Child', path: 's/g/child' }],
  }]);
});

test('a subfolder without index.md is a group without a link', async () => {
  const result = await nav({ 's/g/child.md': '# Child\n' });
  assert.equal(result[0].items[0].title, 'G');
  assert.equal(result[0].items[0].path, undefined);
  assert.equal(result[0].items[0].items.length, 1);
});

test('ignores _hidden and .hidden entries, folders without .md and non-.md files', async () => {
  const result = await nav({
    'a/visible.md': '# Visible\n',
    'a/_draft.md': '# Hidden\n',
    '_private/x.md': '# Hidden\n',
    '.git/x.md': '# Hidden\n',
    'img/photo.png': 'binary',
    'a/notes.txt': 'not md',
  });
  assert.deepEqual(result, [{ title: 'A', items: [{ title: 'Visible', path: 'a/visible' }] }]);
});

test('docs/index.md is the home page and stays out of the menu', async () => {
  const result = await nav({ 'index.md': '# Home\n', 'a/p.md': '# P\n' });
  assert.equal(result.length, 1);
  assert.equal(result[0].items[0].path, 'a/p');
});

test('loose .md files go to a root section, listed first, with a configurable name', async () => {
  const result = await nav({
    'loose.md': '# Loose\n',
    'a/p.md': '# P\n',
    'config.json': '{ "site": { "rootSection": "Basics" } }',
  });
  assert.equal(result[0].title, 'Basics');
  assert.deepEqual(result[0].items, [{ title: 'Loose', path: 'loose' }]);
});

test('alphabetical order follows Spanish collation (accents and ñ)', async () => {
  const result = await nav({ 'a/ñu.md': '# Ñu\n', 'a/zorro.md': '# Zorro\n', 'a/árbol.md': '# Árbol\n', 'a/ola.md': '# Ola\n' });
  assert.deepEqual(result[0].items.map((i) => i.title), ['Árbol', 'Ñu', 'Ola', 'Zorro']);
});

test('an empty docs folder produces an empty menu', async () => {
  assert.deepEqual(await nav({ 'config.json': '{}' }), []);
});

test('findDocsDirs returns docs and docs-* folders only', async () => {
  const root = await fixture({
    'docs/index.md': '# A\n',
    'docs-es/index.md': '# B\n',
    'docs-pt-br/index.md': '# C\n',
    'docsify/readme.md': 'no',
    'assets/x.txt': 'no',
  });
  try {
    const dirs = (await findDocsDirs(root)).map((d) => path.basename(d));
    assert.deepEqual(dirs, ['docs', 'docs-es', 'docs-pt-br']);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('writeAllNavs writes a nav.json for every language folder', async () => {
  const root = await fixture({
    'docs/a/p.md': '# English page\n',
    'docs-es/a/p.md': '# Página en español\n',
  });
  try {
    const results = await writeAllNavs(root);
    assert.deepEqual(results.map((r) => [r.dir, r.pages]), [['docs', 1], ['docs-es', 1]]);
    const { readFile } = await import('node:fs/promises');
    const es = JSON.parse(await readFile(path.join(root, 'docs-es', 'nav.json'), 'utf8'));
    assert.equal(es[0].items[0].title, 'Página en español');
    assert.equal((await writeAllNavs(root)).every((r) => !r.changed), true, 'second run changes nothing');
  } finally { await rm(root, { recursive: true, force: true }); }
});

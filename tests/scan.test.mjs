import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { scanDocs } from '../tools/lib/scan.mjs';
import { withProject } from './helpers.mjs';

/** Scans a temporary docs/ folder and returns a compact view of its menu. */
const menu = (files) => withProject(files, async (root) => {
  const { sections } = await scanDocs(path.join(root, 'docs'));
  const view = (nodes) => nodes.map((n) => ({
    title: n.title,
    ...(n.page ? { slug: n.page.slug } : {}),
    ...(n.children && n.children.length ? { items: view(n.children) } : {}),
  }));
  return view(sections);
});

test('each folder is a section and each .md a page', async () => {
  assert.deepEqual(await menu({ 'docs/guide/one.md': '# One\n', 'docs/guide/two.md': '# Two\n' }), [
    { title: 'Guide', items: [{ title: 'One', slug: 'guide/one' }, { title: 'Two', slug: 'guide/two' }] },
  ]);
});

test('numeric prefixes order pages but do not appear in the URL', async () => {
  const result = await menu({ 'docs/a/02-usage.md': '# Usage\n', 'docs/a/01-install.md': '# Install\n' });
  assert.deepEqual(result[0].items, [
    { title: 'Install', slug: 'a/install' },
    { title: 'Usage', slug: 'a/usage' },
  ]);
});

test('title comes from front matter, then the first H1, then the file name', async () => {
  const result = await menu({
    'docs/a/x.md': '---\ntitle: From front matter\n---\n# Another title\n',
    'docs/a/y.md': 'text\n\n# From the H1\n',
    'docs/a/my-file.md': 'no heading\n',
  });
  assert.deepEqual(result[0].items.map((i) => i.title).sort(), ['From front matter', 'From the H1', 'My file']);
});

test('a # inside a code block is not a title', async () => {
  const result = await menu({ 'docs/a/page.md': '```bash\n# comment\n```\n' });
  assert.equal(result[0].items[0].title, 'Page');
});

test('order uses `order`, then numeric prefix, then alphabetical', async () => {
  const result = await menu({
    'docs/a/zeta.md': '---\norder: 1\n---\n# Zeta\n',
    'docs/a/10-ten.md': '# Ten\n',
    'docs/a/02-two.md': '# Two\n',
    'docs/a/beta.md': '# Beta\n',
    'docs/a/alpha.md': '# Alpha\n',
  });
  assert.deepEqual(result[0].items.map((i) => i.title), ['Zeta', 'Two', 'Ten', 'Alpha', 'Beta']);
});

test('prefixes are compared as numbers, not as text', async () => {
  const result = await menu({ 'docs/a/2-b.md': '# B\n', 'docs/a/10-j.md': '# J\n' });
  assert.deepEqual(result[0].items.map((i) => i.title), ['B', 'J']);
});

test('_meta.json sets the folder title and order', async () => {
  const result = await menu({
    'docs/b/p.md': '# P\n', 'docs/b/_meta.json': '{ "title": "Section B", "order": 2 }',
    'docs/a/p.md': '# P\n', 'docs/a/_meta.json': '{ "title": "Section A", "order": 1 }',
  });
  assert.deepEqual(result.map((s) => s.title), ['Section A', 'Section B']);
});

test("a section's index.md is its first page and lives at the folder URL", async () => {
  const result = await menu({ 'docs/s/index.md': '# Overview\n', 'docs/s/other.md': '# Other\n' });
  assert.deepEqual(result[0].items, [{ title: 'Overview', slug: 's' }, { title: 'Other', slug: 's/other' }]);
});

test("a subfolder's index.md is the group's page and is not repeated as a child", async () => {
  const result = await menu({ 'docs/s/g/index.md': '# Group\n', 'docs/s/g/child.md': '# Child\n' });
  assert.deepEqual(result[0].items, [
    { title: 'Group', slug: 's/g', items: [{ title: 'Child', slug: 's/g/child' }] },
  ]);
});

test('a subfolder without index.md is a group without a link', async () => {
  const result = await menu({ 'docs/s/g/child.md': '# Child\n' });
  assert.deepEqual(result[0].items, [{ title: 'G', items: [{ title: 'Child', slug: 's/g/child' }] }]);
});

test('ignores _hidden and .hidden entries, folders without .md and non-.md files', async () => {
  const result = await menu({
    'docs/a/visible.md': '# Visible\n', 'docs/a/_draft.md': '# Hidden\n', 'docs/_private/x.md': '# Hidden\n',
    'docs/.git/x.md': '# Hidden\n', 'docs/img/photo.png': 'binary', 'docs/a/notes.txt': 'not md',
  });
  assert.deepEqual(result, [{ title: 'A', items: [{ title: 'Visible', slug: 'a/visible' }] }]);
});

test('docs/index.md is the home page and stays out of the menu', async () => {
  await withProject({ 'docs/index.md': '# Home\n', 'docs/a/p.md': '# P\n' }, async (root) => {
    const { home, sections, pages } = await scanDocs(path.join(root, 'docs'));
    assert.equal(home.slug, '');
    assert.equal(sections.length, 1);
    assert.deepEqual(pages.map((p) => p.slug), ['a/p']);
  });
});

test('loose .md files go to a root section, listed first, with a configurable name', async () => {
  const result = await menu({
    'docs/loose.md': '# Loose\n', 'docs/a/p.md': '# P\n',
    'docs/config.json': '{ "site": { "rootSection": "Basics" } }',
  });
  assert.equal(result[0].title, 'Basics');
  assert.deepEqual(result[0].items, [{ title: 'Loose', slug: 'loose' }]);
});

test('alphabetical order follows Spanish collation (accents and ñ)', async () => {
  const result = await menu({ 'docs/a/ñu.md': '# Ñu\n', 'docs/a/zorro.md': '# Zorro\n', 'docs/a/árbol.md': '# Árbol\n', 'docs/a/ola.md': '# Ola\n' });
  assert.deepEqual(result[0].items.map((i) => i.title), ['Árbol', 'Ñu', 'Ola', 'Zorro']);
});

test('URL slugs drop accents and punctuation', async () => {
  const result = await menu({ 'docs/guía/01-Cómo empezar.md': '# Cómo empezar\n' });
  assert.equal(result[0].items[0].slug, 'guia/como-empezar');
});

test('non-markdown files are collected as assets, except config.json', async () => {
  await withProject({ 'docs/config.json': '{}', 'docs/index.md': '# H\n', 'docs/img/a.png': 'x', 'docs/files/m.pdf': 'x', 'docs/_skip/b.png': 'x' }, async (root) => {
    const { assets } = await scanDocs(path.join(root, 'docs'));
    assert.deepEqual(assets.map((a) => a.rel).sort(), ['files/m.pdf', 'img/a.png']);
  });
});

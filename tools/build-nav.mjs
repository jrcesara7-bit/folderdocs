#!/usr/bin/env node
/* Generates docs/nav.json by scanning the folders and .md files inside docs/.
 *
 * Rules:
 *  - Top-level folder          → menu section.
 *  - Subfolder                 → collapsible group inside the section.
 *  - .md file                  → page.
 *  - folder/index.md           → the folder's own page (not repeated as a child).
 *  - docs/index.md             → home page (not in the menu).
 *  - Loose files in docs/      → "General" section (configurable with site.rootSection).
 *  - Names starting with _ or . are ignored (except each folder's _meta.json).
 *
 * Titles:   front matter `title:` → first `# Heading` → file/folder name.
 * Order:    `order:` (front matter or _meta.json) → numeric prefix (01-name) → alphabetical.
 * Optional: <folder>/_meta.json  →  { "title": "About", "order": 1 }
 *
 * Every folder named `docs` or `docs-*` at the project root is treated as one language
 * of the site, and gets its own nav.json.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');

const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = {};
  if (!m) return { meta, body: text };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return { meta, body: text.slice(m[0].length) };
}

function firstHeading(body) {
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const m = !inFence && line.match(/^#\s+(.+?)\s*#*\s*$/);
    if (m) return m[1].replace(/[`*_]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim();
  }
  return '';
}

const numericPrefix = (name) => {
  const m = name.match(/^(\d+)[-_.\s]/);
  return m ? Number(m[1]) : undefined;
};

function prettify(name) {
  const clean = name.replace(/\.md$/i, '').replace(/^\d+[-_.\s]+/, '').replace(/[-_]+/g, ' ').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

const toOrder = (...candidates) => {
  for (const c of candidates) {
    const n = typeof c === 'string' && c.trim() !== '' ? Number(c) : c;
    if (typeof n === 'number' && Number.isFinite(n)) return n;
  }
  return Infinity;
};

const sortItems = (items) =>
  items.sort((a, b) => (a.order - b.order) || collator.compare(a.title, b.title));

async function readPage(file, relPath) {
  const { meta, body } = parseFrontMatter(await readFile(file, 'utf8'));
  const base = path.basename(file);
  return {
    title: meta.title || firstHeading(body) || prettify(base),
    path: relPath.replace(/\.md$/i, ''),
    order: toOrder(meta.order, numericPrefix(base)),
  };
}

async function readJsonIfExists(file) {
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return {}; }
}

/** Returns { title, order, path?, items[] } for a folder, or null if it ends up empty. */
async function readGroup(dir, rel, { isSection }) {
  const entries = (await readdir(dir, { withFileTypes: true }))
    .filter((e) => !e.name.startsWith('_') && !e.name.startsWith('.'));
  const meta = await readJsonIfExists(path.join(dir, '_meta.json'));
  const name = path.basename(dir);

  let index = null;
  const items = [];
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    const relPath = `${rel}/${e.name}`;
    if (e.isDirectory()) {
      const group = await readGroup(abs, relPath, { isSection: false });
      if (group) items.push(group);
    } else if (/\.md$/i.test(e.name)) {
      const page = await readPage(abs, relPath);
      if (/^index\.md$/i.test(e.name)) index = page; else items.push(page);
    }
  }
  sortItems(items);
  if (!index && !items.length) return null;

  const group = {
    title: meta.title || (!isSection && index && index.title) || prettify(name),
    order: toOrder(meta.order, index && index.order, numericPrefix(name)),
  };
  if (index) {
    if (isSection) items.unshift({ title: index.title, path: index.path, order: -Infinity });
    else group.path = index.path;
  }
  group.items = items;
  return group;
}

const strip = (item) => {
  const { order, items, ...rest } = item;
  return items ? { ...rest, items: items.map(strip) } : rest;
};

export async function buildNav(docsDir = DOCS) {
  const config = await readJsonIfExists(path.join(docsDir, 'config.json'));
  const rootTitle = (config.site && config.site.rootSection) || 'General';

  const entries = (await readdir(docsDir, { withFileTypes: true }))
    .filter((e) => !e.name.startsWith('_') && !e.name.startsWith('.'));

  const sections = [];
  const loose = [];
  for (const e of entries) {
    const abs = path.join(docsDir, e.name);
    if (e.isDirectory()) {
      const section = await readGroup(abs, e.name, { isSection: true });
      if (section) sections.push(section);
    } else if (/\.md$/i.test(e.name) && !/^index\.md$/i.test(e.name)) {
      loose.push(await readPage(abs, e.name));
    }
  }
  sortItems(sections);
  if (loose.length) sections.unshift({ title: rootTitle, order: -Infinity, items: sortItems(loose) });

  return sections.map(strip);
}

export async function writeNav(docsDir = DOCS) {
  const nav = await buildNav(docsDir);
  const out = path.join(docsDir, 'nav.json');
  const json = JSON.stringify(nav, null, 2) + '\n';
  let previous = '';
  try { previous = await readFile(out, 'utf8'); } catch { /* first run */ }
  if (previous !== json) await writeFile(out, json);
  return { nav, changed: previous !== json };
}

/** Absolute paths of the project's documentation folders: `docs` and `docs-*`. */
export async function findDocsDirs(root = ROOT) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && /^docs(-[\w-]+)?$/.test(e.name))
    .map((e) => path.join(root, e.name))
    .sort();
}

const countPages = (items) => items.reduce((n, i) => n + (i.path ? 1 : 0) + (i.items ? countPages(i.items) : 0), 0);

export async function writeAllNavs(root = ROOT) {
  const results = [];
  for (const dir of await findDocsDirs(root)) {
    const { nav, changed } = await writeNav(dir);
    results.push({ dir: path.relative(root, dir), sections: nav.length, pages: countPages(nav.flatMap((s) => s.items)), changed });
  }
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const r of await writeAllNavs()) {
    console.log(`${r.dir}/nav.json ${r.changed ? 'updated' : 'unchanged'}: ${r.sections} sections, ${r.pages} pages`);
  }
}

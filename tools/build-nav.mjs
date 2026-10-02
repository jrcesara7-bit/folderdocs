#!/usr/bin/env node
/* Genera docs/nav.json escaneando las carpetas y archivos .md de docs/.
 *
 * Reglas:
 *  - Carpeta de primer nivel      → sección del menú.
 *  - Subcarpeta                   → grupo desplegable dentro de la sección.
 *  - Archivo .md                  → página.
 *  - carpeta/index.md             → es la página del propio grupo (no se repite como hijo).
 *  - docs/index.md                → portada (no aparece en el menú).
 *  - Archivos sueltos en docs/    → sección "General" (configurable con site.rootSection).
 *  - Nombres que empiezan con _ o . se ignoran (salvo _meta.json de cada carpeta).
 *
 * Títulos:  front matter `title:` → primer `# Encabezado` → nombre del archivo/carpeta.
 * Orden:    `order:` (front matter o _meta.json) → prefijo numérico (01-nombre) → alfabético.
 * Opcional: <carpeta>/_meta.json  →  { "title": "Acerca de", "order": 1 }
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

/** Devuelve { title, order, path?, items[] } para una carpeta, o null si queda vacía. */
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
  try { previous = await readFile(out, 'utf8'); } catch { /* primera vez */ }
  if (previous !== json) await writeFile(out, json);
  return { nav, changed: previous !== json };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { nav, changed } = await writeNav();
  const count = (items) => items.reduce((n, i) => n + (i.path ? 1 : 0) + (i.items ? count(i.items) : 0), 0);
  console.log(`docs/nav.json ${changed ? 'actualizado' : 'sin cambios'}: ${nav.length} secciones, ${count(nav.flatMap((s) => s.items))} páginas`);
}

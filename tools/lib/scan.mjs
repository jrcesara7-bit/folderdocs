/* Scans a documentation folder (docs/, docs-es/…) and builds its page tree.
 *
 * Rules:
 *  - Top-level folder      → menu section.
 *  - Subfolder             → collapsible group.
 *  - .md file              → page, published at /<folders>/<name>/ (numeric prefixes are dropped).
 *  - folder/index.md       → the folder's own page (a section's first page, or a group's link).
 *  - index.md at the root  → home page (not in the menu).
 *  - Loose .md files       → "General" section (site.rootSection).
 *  - Names starting with _ or . are ignored (except each folder's _meta.json).
 *
 * Titles: front matter `title:` → first `# Heading` → file/folder name.
 * Order:  `order:` (front matter or _meta.json) → numeric prefix → alphabetical.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { numericPrefix, parseFrontMatter, prettify, slugSegment, toPosix } from './util.mjs';

const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

function firstHeading(body) {
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const m = !inFence && line.match(/^#\s+(.+?)\s*#*\s*$/);
    if (m) return m[1].replace(/[`*_]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim();
  }
  return '';
}

const toOrder = (...candidates) => {
  for (const c of candidates) {
    const n = typeof c === 'string' && c.trim() !== '' ? Number(c) : c;
    if (typeof n === 'number' && Number.isFinite(n)) return n;
  }
  return Infinity;
};

const byOrder = (a, b) => (a.order - b.order) || collator.compare(a.title, b.title);
const isHidden = (name) => name.startsWith('_') || name.startsWith('.');

async function readJsonIfExists(file) {
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return {}; }
}

/** Reads one .md file into a page object. `rel` is its path inside the docs folder, with extension. */
async function readPage(file, rel) {
  const raw = await readFile(file, 'utf8');
  const { meta, body } = parseFrontMatter(raw);
  const base = path.basename(rel);
  const relNoExt = rel.replace(/\.md$/i, '');
  const segments = relNoExt.split('/');
  const isIndex = /^index$/i.test(segments[segments.length - 1]);
  const folderSegments = isIndex ? segments.slice(0, -1) : segments;
  return {
    file,
    rel: relNoExt,                       // "get-started/01-installation"
    sourcePath: rel,                     // "get-started/01-installation.md"
    isIndex,
    title: meta.title || firstHeading(body) || prettify(isIndex ? (segments[segments.length - 2] || base) : base),
    order: toOrder(meta.order, numericPrefix(base)),
    meta,
    body,
    slug: folderSegments.map(slugSegment).join('/'),   // "get-started/installation"; "" for the home page
  };
}

async function readNode(dir, rel, isSection) {
  const entries = (await readdir(dir, { withFileTypes: true })).filter((e) => !isHidden(e.name));
  const meta = await readJsonIfExists(path.join(dir, '_meta.json'));
  const name = path.basename(dir);

  let index = null;
  const children = [];
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    const childRel = `${rel}/${e.name}`;
    if (e.isDirectory()) {
      const node = await readNode(abs, childRel, false);
      if (node) children.push(node);
    } else if (/\.md$/i.test(e.name)) {
      const page = await readPage(abs, childRel);
      if (page.isIndex && /^index\.md$/i.test(e.name)) index = page;
      else children.push({ title: page.title, order: page.order, page });
    }
  }
  children.sort(byOrder);
  if (!index && !children.length) return null;

  const node = {
    title: meta.title || (!isSection && index && index.title) || prettify(name),
    order: toOrder(meta.order, index && index.order, numericPrefix(name)),
    children,
  };
  if (index) {
    if (isSection) children.unshift({ title: index.title, order: -Infinity, page: index });
    else node.page = index;
  }
  return node;
}

/** Depth-first reading order of every page reachable from the menu. */
function flatten(nodes, out = []) {
  for (const n of nodes) {
    if (n.page) out.push(n.page);
    if (n.children) flatten(n.children, out);
  }
  return out;
}

/** Non-markdown files (images, PDFs…) that must be copied next to the pages. */
async function collectAssets(dir, rel = '', out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (isHidden(e.name)) continue;
    const abs = path.join(dir, e.name);
    const childRel = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) await collectAssets(abs, childRel, out);
    else if (!/\.md$/i.test(e.name) && !(rel === '' && e.name === 'config.json')) out.push({ file: abs, rel: toPosix(childRel) });
  }
  return out;
}

/**
 * Scans one documentation folder.
 * Returns { config, home, sections, pages, assets } where `sections` is the menu tree
 * ({ title, order, page?, children[] } nodes) and `pages` lists every page in reading order.
 */
export async function scanDocs(docsDir) {
  const config = await readJsonIfExists(path.join(docsDir, 'config.json'));
  const site = config.site || {};
  const entries = (await readdir(docsDir, { withFileTypes: true })).filter((e) => !isHidden(e.name));

  let home = null;
  const sections = [];
  const loose = [];
  for (const e of entries) {
    const abs = path.join(docsDir, e.name);
    if (e.isDirectory()) {
      const section = await readNode(abs, e.name, true);
      if (section) sections.push(section);
    } else if (/\.md$/i.test(e.name)) {
      const page = await readPage(abs, e.name);
      if (/^index\.md$/i.test(e.name)) home = page;
      else loose.push({ title: page.title, order: page.order, page });
    }
  }
  sections.sort(byOrder);
  if (loose.length) {
    loose.sort(byOrder);
    sections.unshift({ title: site.rootSection || 'General', order: -Infinity, children: loose });
  }

  return {
    config,
    site,
    home,
    sections,
    pages: flatten(sections),
    assets: await collectAssets(docsDir),
  };
}

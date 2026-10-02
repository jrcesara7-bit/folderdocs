/* Small helpers shared by the site generator. No dependencies. */

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
export const decodeEntities = (s) => s.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (e) => ENTITIES[e]);

/** Turns text into a URL-safe slug: lowercase, no accents, hyphens. Keeps letters of any script. */
export function slugify(text) {
  return String(text)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** "01-getting-started.md" → "getting-started" (drops the extension and a numeric ordering prefix). */
export const slugSegment = (name) => slugify(name.replace(/\.md$/i, '').replace(/^\d+[-_.\s]+/, ''));

/** Leading number of a name ("02-usage.md" → 2), used for ordering. */
export function numericPrefix(name) {
  const m = name.match(/^(\d+)[-_.\s]/);
  return m ? Number(m[1]) : undefined;
}

/** "get-started-now" → "Get started now" */
export function prettify(name) {
  const clean = name.replace(/\.md$/i, '').replace(/^\d+[-_.\s]+/, '').replace(/[-_]+/g, ' ').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = {};
  if (!m) return { meta, body: text };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return { meta, body: text.slice(m[0].length) };
}

/** Resolves `href` against the directory of a source path ("a/b/c" + "../d" → "a/d"). */
export function resolveSourcePath(fromRel, href) {
  const parts = href.startsWith('/') ? [] : fromRel.split('/').slice(0, -1);
  for (const part of href.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') parts.pop(); else parts.push(part);
  }
  return parts.join('/');
}

/**
 * Relative URL from one site path to another. Both are paths from the site root;
 * `fromDir` is the directory a page lives in ("guide/intro" for "/guide/intro/").
 */
export function relativeUrl(fromDir, target) {
  const depth = fromDir.split('/').filter(Boolean).length;
  const url = '../'.repeat(depth) + target;
  return url === '' ? './' : url;
}

/** Percent-encodes each segment of a URL path, leaving "/" and "#" structure intact. */
export const encodePath = (p) => p.split('/').map((seg) => encodeURIComponent(seg)).join('/');

export const toPosix = (p) => p.split('\\').join('/');

/** Shortens text to `max` characters at a word boundary. */
export function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,;:.]+$/, '') + '…';
}

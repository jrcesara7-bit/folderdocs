#!/usr/bin/env node
/* Development server: builds the site in memory and serves it, rebuilding whenever a
 * source file changes. Pages, URLs and styling are identical to the published site.
 *   node tools/serve.mjs [port]      (default 8000)
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from './lib/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 8000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};

/** Newest modification time among the files that make up the site. */
async function sourceStamp(dir = ROOT, depth = 0) {
  let newest = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '_site' || e.name === 'tests') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (depth === 0 && !/^(docs(-[\w-]+)?|assets)$/.test(e.name)) continue;
      newest = Math.max(newest, await sourceStamp(full, depth + 1));
    } else newest = Math.max(newest, (await stat(full)).mtimeMs);
  }
  return newest;
}

let cache = { stamp: -1, site: null };
async function currentSite() {
  const stamp = await sourceStamp();
  if (stamp !== cache.stamp) {
    const site = await buildSite(ROOT, { dev: true });
    for (const w of site.warnings) console.warn(`warning: ${w}`);
    cache = { stamp, site };
  }
  return cache.site;
}

createServer(async (req, res) => {
  try {
    const { files } = await currentSite();
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '');
    if (pathname === '' || pathname.endsWith('/')) pathname += 'index.html';
    let entry = files.get(pathname);
    // /folder → /folder/ like most static hosts do
    if (!entry && files.has(`${pathname}/index.html`)) {
      res.writeHead(301, { Location: `/${pathname}/` });
      return res.end();
    }
    const notFound = !entry;
    if (notFound) entry = files.get('404.html');

    const type = TYPES[path.extname(pathname).toLowerCase()] || (notFound ? TYPES['.html'] : 'application/octet-stream');
    res.writeHead(notFound ? 404 : 200, { 'Content-Type': notFound ? TYPES['.html'] : type, 'Cache-Control': 'no-cache' });
    if (entry && entry.source) createReadStream(entry.source).pipe(res);
    else res.end(entry ? entry.content : 'Not found');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Build error: ${err.message}`);
  }
}).listen(PORT, () => console.log(`Docs at http://localhost:${PORT}  (Ctrl+C to quit)`));

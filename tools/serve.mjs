#!/usr/bin/env node
/* Servidor local de desarrollo: sirve el sitio y regenera docs/nav.json en cada
 * petición, así basta con crear carpetas/.md y recargar el navegador.
 *   node tools/serve.mjs [puerto]      (por defecto 8000)
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeNav } from './build-nav.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 8000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};

createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.join(ROOT, pathname);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) throw Object.assign(new Error('fuera de la raíz'), { code: 'EACCES' });

    if (pathname === '/docs/nav.json') await writeNav();

    if (!(await stat(file)).isFile()) throw Object.assign(new Error('no es archivo'), { code: 'ENOENT' });
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(file));
  } catch (err) {
    const code = err.code === 'EACCES' ? 403 : err.code === 'ENOENT' ? 404 : 500;
    res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(code === 404 ? 'No encontrado' : String(err.message));
  }
}).listen(PORT, () => console.log(`Documentación en http://localhost:${PORT}  (Ctrl+C para salir)`));

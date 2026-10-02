#!/usr/bin/env node
/* Assembles the publishable site into _site/: regenerates every menu, then copies
 * only what a browser needs. Tools, tests and the rest of the repository are left out.
 *
 *   node tools/build-site.mjs        (or: npm run build)
 *
 * Copied: index.html, assets/, every `docs` / `docs-*` folder, and each language entry
 * folder (any other top-level folder that contains an index.html, such as es/).
 */
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { findDocsDirs, writeAllNavs } from './build-nav.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOT_ENTRY_FOLDERS = new Set(['assets', 'tools', 'tests', 'node_modules', '_site']);

export async function buildSite(root = ROOT, outName = '_site') {
  await writeAllNavs(root);

  const out = path.join(root, outName);
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  const copied = [];
  const copy = async (name) => {
    await cp(path.join(root, name), path.join(out, name), { recursive: true });
    copied.push(name);
  };

  await copy('index.html');
  if (existsSync(path.join(root, 'assets'))) await copy('assets');
  for (const dir of await findDocsDirs(root)) await copy(path.basename(dir));

  for (const entry of await readdir(root, { withFileTypes: true })) {
    const isEntryFolder = entry.isDirectory()
      && !entry.name.startsWith('.')
      && !entry.name.startsWith('docs')
      && !NOT_ENTRY_FOLDERS.has(entry.name)
      && existsSync(path.join(root, entry.name, 'index.html'));
    if (isEntryFolder) await copy(entry.name);
  }

  await writeFile(path.join(out, '.nojekyll'), '');
  return copied.sort();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const copied = await buildSite();
  console.log(`_site/ ready: ${copied.join(', ')}`);
}

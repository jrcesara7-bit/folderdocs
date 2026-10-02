import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

/** Creates a temporary project from { 'path/file': 'content' }; returns { root, cleanup }. */
export async function fixture(files) {
  const root = await mkdtemp(path.join(tmpdir(), 'folderdocs-'));
  for (const [rel, content] of Object.entries(files)) {
    const file = path.join(root, rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
  }
  return { root, cleanup: () => rm(root, { recursive: true, force: true }) };
}

/** Runs `fn(root)` against a temporary project and always cleans up. */
export async function withProject(files, fn) {
  const { root, cleanup } = await fixture(files);
  try { return await fn(root); } finally { await cleanup(); }
}

/** Minimal project shell every site test needs (assets are copied as-is). */
export const baseAssets = {
  'assets/css/theme.css': '/* css */',
  'assets/js/site.js': '// js',
  'assets/img/favicon.svg': '<svg/>',
  'assets/img/social-preview.png': 'png',
};

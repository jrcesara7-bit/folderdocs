#!/usr/bin/env node
/* Builds the publishable site into _site/: one HTML file per Markdown page.
 *
 *   node tools/build-site.mjs [--strict] [--out <dir>]      (or: npm run build)
 *
 * --strict   exit with an error if any link points to a page or file that does not exist.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite, writeSite } from './lib/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const outIndex = args.indexOf('--out');
const outDir = path.resolve(ROOT, outIndex !== -1 ? args[outIndex + 1] : '_site');

try {
  const result = await buildSite(ROOT);
  await writeSite(result.files, outDir);

  for (const w of result.warnings) console.warn(`warning: ${w}`);
  const langs = result.languages.map((l) => `${l.name} (${l.pages})`).join(', ');
  console.log(`Built ${result.pages} pages [${langs}] → ${path.relative(ROOT, outDir) || '.'}/` +
    (result.siteUrl ? `  (site URL: ${result.siteUrl})` : '  (no site URL: sitemap, canonical and og:url skipped)'));
  if (strict && result.warnings.length) {
    console.error(`${result.warnings.length} problem(s) found and --strict is on.`);
    process.exit(1);
  }
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}

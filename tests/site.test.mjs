import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { buildSite, writeSite, resolveSiteUrl } from '../tools/lib/site.mjs';
import { baseAssets, withProject } from './helpers.mjs';

const project = {
  ...baseAssets,
  'docs/config.json': JSON.stringify({ site: { title: 'Acme', subtitle: 'Docs for Acme', lang: 'en', repo: 'acme/docs', branch: 'main' } }),
  'docs/index.md': '# Welcome\n\nHome intro text.\n',
  'docs/get-started/01-install.md': '---\nid: install\ndescription: How to install Acme.\n---\n# Install\n\nRun it. See [usage](02-usage.md#flags).\n\n![shot](../img/shot.png)\n',
  'docs/get-started/02-usage.md': '---\nid: usage\n---\n# Usage\n\n## Flags\n\nUse flags.\n',
  'docs/img/shot.png': 'png-bytes',
  'docs-es/config.json': JSON.stringify({ site: { title: 'Acme', subtitle: 'Docs de Acme', lang: 'es' } }),
  'docs-es/index.md': '# Bienvenido\n\nIntro.\n',
  'docs-es/empezar/01-instalar.md': '---\nid: install\n---\n# Instalar\n\nEjecútalo.\n',
};

const build = (files, options = {}) => withProject(files, (root) => buildSite(root, options));
const text = (result, file) => result.files.get(file).content;

test('every page is published as <slug>/index.html, per language', async () => {
  const result = await build(project);
  assert.deepEqual([...result.files.keys()].filter((f) => f.endsWith('.html')).sort(), [
    '404.html', 'es/empezar/instalar/index.html', 'es/index.html', 'get-started/install/index.html',
    'get-started/usage/index.html', 'index.html',
  ]);
  assert.equal(result.pages, 5);
  assert.deepEqual(result.warnings, []);
});

test('pages are complete HTML: content, menu, breadcrumbs and meta tags, no JavaScript needed', async () => {
  const result = await build(project);
  const html = text(result, 'get-started/install/index.html');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<title>Install · Acme<\/title>/);
  assert.match(html, /<meta name="description" content="How to install Acme\.">/);
  assert.match(html, /<h1 id="install">Install/);
  assert.match(html, /<a class="nav-link active" href="\.\.\/\.\.\/get-started\/install\/" aria-current="page">Install<\/a>/);
  assert.match(html, /<ol class="breadcrumb"><li><a href="\.\.\/\.\.\/">Home<\/a><\/li><li>Get started<\/li><li aria-current="page">Install<\/li>/);
  assert.match(html, /https:\/\/github\.com\/acme\/docs\/edit\/main\/docs\/get-started\/01-install\.md/);
});

test('links and images between pages are relative and work under any base path', async () => {
  const html = text(await build(project), 'get-started/install/index.html');
  assert.match(html, /href="\.\.\/\.\.\/get-started\/usage\/#flags"/);
  assert.match(html, /<img src="\.\.\/\.\.\/img\/shot\.png"/);
  assert.match(html, /href="\.\.\/\.\.\/assets\/css\/theme\.css"/);
});

test('the home page uses the site subtitle in its title and the first paragraph as description', async () => {
  const html = text(await build(project), 'index.html');
  assert.match(html, /<title>Acme: Docs for Acme<\/title>/);
  assert.match(html, /<meta name="description" content="Home intro text\.">/);
  assert.match(html, /href="assets\/css\/theme\.css"/);
});

test('docs files that are not markdown are copied next to the pages', async () => {
  const result = await build(project);
  assert.ok(result.files.get('img/shot.png').source.endsWith('shot.png'));
  assert.ok(result.files.has('assets/css/theme.css'));
  assert.ok(result.files.has('.nojekyll'));
});

test('without a known site URL there are no canonical links, sitemap or robots.txt', async () => {
  const result = await build(project, { env: {} });
  assert.ok(!result.files.has('sitemap.xml') && !result.files.has('robots.txt'));
  assert.doesNotMatch(text(result, 'index.html'), /rel="canonical"|og:url/);
});

test('with a site URL: canonical, Open Graph, hreflang, sitemap and robots.txt', async () => {
  const result = await build(project, { env: { SITE_URL: 'https://example.com/docs/' } });
  const html = text(result, 'get-started/install/index.html');
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.com\/docs\/get-started\/install\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/example\.com\/docs\/get-started\/install\/">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/example\.com\/docs\/assets\/img\/social-preview\.png">/);
  assert.match(html, /<link rel="alternate" hreflang="es" href="https:\/\/example\.com\/docs\/es\/empezar\/instalar\/">/);
  assert.match(html, /<link rel="alternate" hreflang="x-default" href="https:\/\/example\.com\/docs\/get-started\/install\/">/);
  assert.match(html, /"@type":"BreadcrumbList"/);

  const sitemap = text(result, 'sitemap.xml');
  assert.match(sitemap, /<loc>https:\/\/example\.com\/docs\/get-started\/usage\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/example\.com\/docs\/es\/<\/loc>/);
  assert.match(text(result, 'robots.txt'), /Sitemap: https:\/\/example\.com\/docs\/sitemap\.xml/);
});

test('pages that share an id are linked as translations; others fall back to the language home', async () => {
  const html = text(await build(project), 'get-started/install/index.html');
  assert.match(html, /<a href="\.\.\/\.\.\/es\/empezar\/instalar\/" hreflang="es" lang="es">ES<\/a>/);
  const usage = text(await build(project), 'get-started/usage/index.html');
  assert.match(usage, /<a href="\.\.\/\.\.\/es\/" hreflang="es" lang="es">ES<\/a>/);
});

test('each language gets its own search index with relative URLs', async () => {
  const result = await build(project);
  const en = JSON.parse(text(result, 'search-index.json'));
  assert.deepEqual(en.map((e) => e.u).sort(), ['', 'get-started/install/', 'get-started/usage/']);
  const install = en.find((e) => e.u === 'get-started/install/');
  assert.equal(install.t, 'Install');
  assert.equal(install.s, 'Get started');
  assert.match(install.x, /Run it\./);
  const es = JSON.parse(text(result, 'es/search-index.json'));
  assert.deepEqual(es.map((e) => e.u).sort(), ['', 'empezar/instalar/']);
});

test('404.html uses absolute paths under the site base and is not indexable', async () => {
  const html = text(await build(project, { env: { SITE_URL: 'https://example.com/docs' } }), '404.html');
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /href="\/docs\/assets\/css\/theme\.css"/);
  assert.match(html, /Page not found/);
});

test('the interface language follows each language folder', async () => {
  const result = await build(project);
  assert.match(text(result, 'es/index.html'), /<html lang="es"[\s\S]*placeholder="Buscar en la documentación"/);
  assert.match(text(result, 'index.html'), /placeholder="Search the docs"/);
});

test('broken links are reported as warnings', async () => {
  const result = await build({ ...project, 'docs/get-started/02-usage.md': '# Usage\n\n[x](missing.md) [y](../img/none.png)\n' });
  assert.equal(result.warnings.length, 2);
  assert.match(result.warnings[0], /docs\/get-started\/02-usage\.md/);
});

test('two pages that would share a URL stop the build', async () => {
  await assert.rejects(
    build({ ...baseAssets, 'docs/a/01-intro.md': '# A\n', 'docs/a/02-intro.md': '# B\n' }),
    /would both be published at \/a\/intro\//,
  );
});

test('a page cannot be published inside another language folder', async () => {
  await assert.rejects(
    build({ ...baseAssets, 'docs/es/page.md': '# X\n', 'docs-es/index.md': '# Hola\n' }),
    /inside the \/es\/ language folder/,
  );
});

test('a docs/ folder is required', async () => {
  await assert.rejects(build({ ...baseAssets, 'docs-es/index.md': '# Hola\n' }), /docs\/ folder is required/);
});

test('dev mode never emits absolute URLs', async () => {
  const result = await build(project, { dev: true, env: { SITE_URL: 'https://example.com' } });
  assert.doesNotMatch(text(result, 'index.html'), /canonical|og:url/);
  assert.ok(!result.files.has('sitemap.xml'));
});

test('writeSite saves the result to disk', async () => {
  await withProject(project, async (root) => {
    const result = await buildSite(root, { env: {} });
    await writeSite(result.files, path.join(root, '_site'));
    assert.match(await readFile(path.join(root, '_site/get-started/usage/index.html'), 'utf8'), /<h2 id="flags">/);
    assert.equal(await readFile(path.join(root, '_site/img/shot.png'), 'utf8'), 'png-bytes');
    assert.ok((await readdir(path.join(root, '_site'))).includes('404.html'));
  });
});

test('resolveSiteUrl: SITE_URL, then config, then GitHub Actions', () => {
  assert.equal(resolveSiteUrl('https://cfg.dev/', { SITE_URL: 'https://env.dev/' }), 'https://env.dev');
  assert.equal(resolveSiteUrl('https://cfg.dev/', {}), 'https://cfg.dev');
  assert.equal(resolveSiteUrl('', { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'Owner/Repo' }), 'https://Owner.github.io/Repo');
  assert.equal(resolveSiteUrl('', { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'me/me.github.io' }), 'https://me.github.io');
  assert.equal(resolveSiteUrl('', {}), '');
});

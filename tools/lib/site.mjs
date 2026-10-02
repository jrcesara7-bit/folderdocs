/* Builds the whole site in memory: one HTML file per Markdown page, for every language,
 * plus sitemap.xml, robots.txt, 404.html, search indexes and the copied assets.
 * `writeSite` saves the result to disk; the dev server serves it straight from memory. */
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderMarkdown, firstParagraph, plainText } from './render.mjs';
import { renderDocument, renderNav, findTrail } from './template.mjs';
import { scanDocs } from './scan.mjs';
import { translator } from './i18n.mjs';
import { encodePath, escapeHtml, relativeUrl, toPosix, truncate } from './util.mjs';

const SEARCH_TEXT_LIMIT = 20000;

/** Absolute paths of the project's documentation folders: `docs` and `docs-*`. */
export async function findDocsDirs(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && /^docs(-[\w-]+)?$/.test(e.name))
    .map((e) => path.join(root, e.name))
    .sort();
}

/** Public URL of the site (no trailing slash), or '' when it cannot be known. */
export function resolveSiteUrl(configUrl, env = process.env) {
  const clean = (u) => u.replace(/\/+$/, '');
  if (env.SITE_URL) return clean(env.SITE_URL);
  if (configUrl) return clean(configUrl);
  if (env.GITHUB_ACTIONS && env.GITHUB_REPOSITORY) {
    const [owner, name] = env.GITHUB_REPOSITORY.split('/');
    return name.toLowerCase() === `${owner.toLowerCase()}.github.io`
      ? `https://${owner}.github.io`
      : `https://${owner}.github.io/${name}`;
  }
  return '';
}

async function listFiles(dir, base = '') {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...await listFiles(path.join(dir, e.name), rel));
    else out.push({ rel: toPosix(rel), source: path.join(dir, e.name) });
  }
  return out;
}

/**
 * Builds the site. Returns { files, warnings, pages } where `files` is a Map from output
 * path ("guide/intro/index.html") to { content } (text) or { source } (file to copy).
 * Options: { dev: boolean (no absolute URLs), env: process.env-like object }.
 */
export async function buildSite(root, options = {}) {
  const env = options.env || process.env;
  const dev = Boolean(options.dev);
  const warnings = [];
  const files = new Map();
  const addFile = (out, entry) => {
    if (files.has(out)) throw new Error(`Two files would be written to "${out}"`);
    files.set(out, entry);
  };

  // ---- 1. Languages: docs/ is the default (served at /), docs-xx/ is served at /xx/ ----
  const dirs = await findDocsDirs(root);
  if (!dirs.some((d) => path.basename(d) === 'docs')) throw new Error('A docs/ folder is required (it is the default language).');
  const languages = [];
  for (const dir of dirs) {
    const name = path.basename(dir);
    const scan = await scanDocs(dir);
    const code = name === 'docs' ? (scan.site.lang || 'en') : name.slice('docs-'.length);
    languages.push({
      name, dir, scan, site: scan.site, isDefault: name === 'docs',
      code: scan.site.lang || code,
      prefix: name === 'docs' ? '' : `${name.slice('docs-'.length)}/`,
      label: scan.site.langLabel || String(scan.site.lang || code).slice(0, 2).toUpperCase(),
    });
  }
  languages.sort((a, b) => (b.isDefault - a.isDefault) || a.name.localeCompare(b.name));
  const defaultLang = languages[0];
  const siteUrl = dev ? '' : resolveSiteUrl(defaultLang.site.url, env);
  const siteBase = siteUrl ? new URL(siteUrl).pathname.replace(/\/+$/, '') : '';

  // ---- 2. URLs: every page lives at /<prefix><slug>/ ----
  const urlOwners = new Map();
  const claim = (url, owner) => {
    if (urlOwners.has(url)) throw new Error(`Pages "${urlOwners.get(url)}" and "${owner}" would both be published at /${url}`);
    urlOwners.set(url, owner);
  };
  for (const lang of languages) {
    lang.byRel = new Map();
    lang.allPages = [...(lang.scan.home ? [lang.scan.home] : []), ...lang.scan.pages];
    for (const page of lang.allPages) {
      page.url = page.slug ? `${lang.prefix}${page.slug}/` : lang.prefix;
      page.lang = lang;
      claim(page.url, `${lang.name}/${page.sourcePath}`);
      lang.byRel.set(page.rel, page);
    }
    if (!lang.scan.home) warnings.push(`${lang.name}/: there is no index.md, so the language home page will be missing`);
    lang.assetByRel = new Map(lang.scan.assets.map((a) => [a.rel, a]));
  }
  for (const lang of languages) {
    if (lang.isDefault) continue;
    for (const page of languages[0].allPages) {
      if (page.url.startsWith(lang.prefix)) throw new Error(`The page "${page.sourcePath}" would be published inside the /${lang.prefix} language folder`);
    }
  }

  // Translations: pages that share the same `id:` in front matter are linked across languages.
  const byId = new Map();
  for (const lang of languages) {
    for (const page of lang.allPages) {
      const id = page.meta.id || (page === lang.scan.home ? '__home__' : '');
      if (!id) continue;
      if (!byId.has(id)) byId.set(id, new Map());
      byId.get(id).set(lang.name, page);
    }
  }
  const translationsOf = (page) => {
    const id = page.meta.id || (page === page.lang.scan.home ? '__home__' : '');
    return id ? [...byId.get(id).values()] : [page];
  };

  // ---- 3. Pages ----
  const searchEntries = new Map(languages.map((l) => [l.name, []]));
  for (const lang of languages) {
    const t = translator(lang.site.lang || lang.code);
    const { site, scan } = lang;
    const siteName = site.title || t('siteName');
    const homePage = scan.home;
    const homeUrl = homePage ? homePage.url : lang.prefix;

    for (const page of lang.allPages) {
      const isHome = page === homePage;
      const pageDir = page.url.replace(/\/$/, '');
      const href = (target) => relativeUrl(pageDir, target);
      const ctx = {
        page, pageDir, t,
        urlForRel: (rel) => lang.byRel.get(rel)?.url,
        assetUrl: (rel) => (lang.assetByRel.has(rel) ? `${lang.prefix}${rel}` : undefined),
        warn: (m) => warnings.push(`${lang.name}/${m}`),
      };
      const content = renderMarkdown(page.body, ctx);

      const description = truncate(
        page.meta.description || (isHome && site.description) || firstParagraph(page.body) || site.subtitle || siteName, 160);
      const pageTitle = page.title;
      const title = page.meta.seoTitle
        || (isHome ? (site.subtitle ? `${siteName}: ${site.subtitle}` : siteName) : `${pageTitle} · ${siteName}`);

      const trail = isHome ? [] : findTrail(scan.sections, page);
      const index = scan.pages.indexOf(page);
      const prev = index > 0 ? scan.pages[index - 1] : null;
      const next = isHome ? (scan.pages[0] || null) : (scan.pages[index + 1] || null);

      const canonical = siteUrl ? `${siteUrl}/${encodePath(page.url)}` : '';
      const peers = translationsOf(page);
      const alternates = siteUrl && peers.length > 1
        ? [...peers.map((p) => ({ code: p.lang.code, url: `${siteUrl}/${encodePath(p.url)}` })),
           { code: 'x-default', url: `${siteUrl}/${encodePath((peers.find((p) => p.lang.isDefault) || peers[0]).url)}` }]
        : [];
      const image = site.image || 'assets/img/social-preview.png';
      const ogImage = siteUrl ? (/^https?:/.test(image) ? image : `${siteUrl}/${image}`) : '';

      const languageLinks = languages.map((l) => {
        const target = peers.find((p) => p.lang === l) || l.scan.home;
        const targetUrl = target ? target.url : l.prefix;
        return { label: l.label, code: l.code, current: l === lang, href: relativeUrl(pageDir, encodePath(targetUrl)) };
      });

      const crumbs = [
        { name: siteName, url: homeUrl },
        ...trail.filter((n) => n.page !== page).map((n) => ({ name: n.title, url: n.page ? n.page.url : '' , linked: Boolean(n.page) })),
        { name: pageTitle, url: page.url },
      ];
      const jsonLd = siteUrl && !isHome ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem', position: i + 1, name: c.name,
          ...(c.linked === false ? {} : { item: `${siteUrl}/${encodePath(c.url)}` }),
        })),
      }) : '';

      const html = renderDocument({
        lang: lang.code, site, t, href, title, description, canonical, ogImage, alternates,
        languages: languageLinks, nav: renderNav(scan.sections, isHome ? null : page, href), trail,
        current: isHome ? null : page, pageTitle, isHome, content, prev, next,
        editUrl: site.repo ? `https://github.com/${site.repo}/edit/${site.branch || 'main'}/${lang.name}/${page.sourcePath}` : '',
        baseHref: relativeUrl(pageDir, lang.prefix), homeHref: relativeUrl(pageDir, encodePath(homeUrl)), jsonLd,
        ui: { copy: t('copy'), copied: t('copied'), copyError: t('copyError'), noResults: t('noResults') },
      });
      addFile(`${page.url}index.html`, { content: html });

      searchEntries.get(lang.name).push({
        t: pageTitle,
        u: page.url.slice(lang.prefix.length),
        s: trail.filter((n) => n.page !== page).map((n) => n.title).join(' › '),
        x: plainText(content).slice(0, SEARCH_TEXT_LIMIT),
      });
    }

    // Per-language assets (images, PDFs…) and search index.
    for (const asset of scan.assets) addFile(`${lang.prefix}${asset.rel}`, { source: asset.file });
    addFile(`${lang.prefix}search-index.json`, { content: JSON.stringify(searchEntries.get(lang.name)) });
  }

  // ---- 4. Shared assets, 404, sitemap, robots ----
  const assetsDir = path.join(root, 'assets');
  for (const f of await listFiles(assetsDir)) addFile(`assets/${f.rel}`, { source: f.source });

  {
    const lang = defaultLang;
    const t = translator(lang.site.lang || lang.code);
    const base = `${siteBase}/`;
    const href = (target) => base + target;
    const notFoundContent = `<h1>${escapeHtml(t('notFound'))}</h1>\n<p>${escapeHtml(t('notFoundBody'))}</p>\n<p><a href="${escapeHtml(href(lang.scan.home ? lang.scan.home.url : ''))}">${escapeHtml(t('backHome'))}</a></p>`;
    const html = renderDocument({
      lang: lang.code, site: lang.site, t, href, title: `${t('notFound')} · ${lang.site.title || t('siteName')}`,
      description: t('notFoundBody'), canonical: '', ogImage: '', alternates: [], languages: [],
      nav: renderNav(lang.scan.sections, null, href), trail: [], current: null, pageTitle: t('notFound'), isHome: false,
      content: notFoundContent, prev: null, next: null, editUrl: '', baseHref: base + lang.prefix,
      homeHref: href(lang.scan.home ? lang.scan.home.url : ''), jsonLd: '',
      ui: { copy: t('copy'), copied: t('copied'), copyError: t('copyError'), noResults: t('noResults') },
      noindex: true,
    });
    addFile('404.html', { content: html });
  }

  if (siteUrl) {
    const urls = [];
    for (const lang of languages) {
      for (const page of lang.allPages) {
        const peers = translationsOf(page);
        const alt = peers.length > 1
          ? peers.map((p) => `<xhtml:link rel="alternate" hreflang="${escapeHtml(p.lang.code)}" href="${escapeHtml(`${siteUrl}/${encodePath(p.url)}`)}"/>`).join('')
          : '';
        urls.push(`  <url><loc>${escapeHtml(`${siteUrl}/${encodePath(page.url)}`)}</loc>${alt}</url>`);
      }
    }
    addFile('sitemap.xml', {
      content: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
    });
    addFile('robots.txt', { content: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
  }
  addFile('.nojekyll', { content: '' });

  return {
    files, warnings, siteUrl,
    pages: languages.reduce((n, l) => n + l.allPages.length, 0),
    languages: languages.map((l) => ({ name: l.name, code: l.code, prefix: l.prefix, pages: l.allPages.length })),
  };
}

/** Writes a built site to disk, replacing `outDir`. */
export async function writeSite(files, outDir) {
  await rm(outDir, { recursive: true, force: true });
  for (const [out, entry] of files) {
    const target = path.join(outDir, out);
    await mkdir(path.dirname(target), { recursive: true });
    if (entry.source) await copyFile(entry.source, target);
    else await writeFile(target, entry.content);
  }
}

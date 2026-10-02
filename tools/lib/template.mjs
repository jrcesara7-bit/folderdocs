/* HTML shell of every page: <head> with SEO tags, sidebar menu, breadcrumbs, pager and footer.
 * All URLs are produced through `href(sitePath)` so pages work under any base path. */
import { encodePath, escapeHtml } from './util.mjs';

const attr = escapeHtml;

/** Does this menu node contain `page` (itself or in its descendants)? */
function contains(node, page) {
  if (node.page === page) return true;
  return (node.children || []).some((c) => contains(c, page));
}

/** Menu nodes from the section down to the node that holds `page` (inclusive). */
export function findTrail(sections, page) {
  const walk = (node, trail) => {
    const here = [...trail, node];
    if (node.page === page) return here;
    for (const child of node.children || []) {
      const found = walk(child, here);
      if (found) return found;
    }
    return null;
  };
  for (const section of sections) {
    const found = walk(section, []);
    if (found) return found;
  }
  return [];
}

function navItem(node, ctx) {
  const { current, href } = ctx;
  const link = node.page
    ? `<a class="nav-link${node.page === current ? ' active' : ''}" href="${attr(href(encodePath(node.page.url)))}"${node.page === current ? ' aria-current="page"' : ''}>${escapeHtml(node.title)}</a>`
    : `<span class="nav-link nav-label">${escapeHtml(node.title)}</span>`;

  if (!node.children || !node.children.length) {
    return `<li><div class="nav-row">${link}</div></li>`;
  }
  const open = current && contains(node, current) ? ' open' : '';
  return `<li class="has-children"><details class="nav-group"${open}><summary class="nav-row">${link}</summary>` +
    `<ul class="nav-list">${node.children.map((c) => navItem(c, ctx)).join('')}</ul></details></li>`;
}

export function renderNav(sections, current, href) {
  const ctx = { current, href };
  return sections.map((section, i) => {
    const open = current ? contains(section, current) : i === 0;
    return `<details class="nav-section"${open ? ' open' : ''}><summary class="nav-section-title">${escapeHtml(section.title)}</summary>` +
      `<ul class="nav-list">${section.children.map((c) => navItem(c, ctx)).join('')}</ul></details>`;
  }).join('\n');
}

function renderBreadcrumb({ trail, current, title, homeHref, href, t }) {
  const items = [`<li><a href="${attr(homeHref)}">${escapeHtml(t('home'))}</a></li>`];
  for (const node of trail) {
    if (node.page === current) continue;
    items.push(node.page
      ? `<li><a href="${attr(href(encodePath(node.page.url)))}">${escapeHtml(node.title)}</a></li>`
      : `<li>${escapeHtml(node.title)}</li>`);
  }
  if (current) items.push(`<li aria-current="page">${escapeHtml(title)}</li>`);
  return items.join('');
}

function renderPager({ prev, next, href, t }) {
  const link = (page, rel, label) =>
    `<a class="${rel}" rel="${rel}" href="${attr(href(encodePath(page.url)))}">${label}</a>`;
  return (prev ? link(prev, 'prev', `« ${escapeHtml(prev.title)}`) : '') +
         (next ? link(next, 'next', `${escapeHtml(next.title)} »`) : '');
}

/**
 * Builds the complete HTML document of one page.
 * `p` = { lang, site, t, href, title, description, canonical, ogImage, alternates, languages,
 *         nav, trail, current, content, prev, next, editUrl, baseHref, searchHref, jsonLd, ui, homeHref }
 */
export function renderDocument(p) {
  const { site, t, href } = p;
  const siteName = site.title || t('siteName');

  const logo = site.logo
    ? `<img src="${attr(/^(https?:)?\/\//.test(site.logo) ? site.logo : href(site.logo))}" alt="${attr(siteName)}">`
    : `<span class="brand-mark">${escapeHtml((siteName.trim().charAt(0) || 'D').toUpperCase())}</span><span>${escapeHtml(siteName)}</span>`;

  const languageSwitch = p.languages.length > 1
    ? `<span class="lang-switch" role="group" aria-label="${attr(t('language'))}">` +
      p.languages.map((l) => l.current
        ? `<span class="current" aria-current="true">${escapeHtml(l.label)}</span>`
        : `<a href="${attr(l.href)}" hreflang="${attr(l.code)}" lang="${attr(l.code)}">${escapeHtml(l.label)}</a>`).join('') +
      '</span>'
    : '';

  const headLinks = [
    p.editUrl ? `<a href="${attr(p.editUrl)}" target="_blank" rel="noopener">${escapeHtml(t('edit'))}</a>` : '',
    site.contributeUrl ? `<a class="small" href="${attr(site.contributeUrl)}" target="_blank" rel="noopener">${escapeHtml(t('contribute'))}</a>` : '',
  ].join('');

  const meta = [
    `<meta property="og:type" content="${p.isHome ? 'website' : 'article'}">`,
    `<meta property="og:title" content="${attr(p.title)}">`,
    `<meta property="og:description" content="${attr(p.description)}">`,
    `<meta property="og:locale" content="${attr(p.lang)}">`,
    p.canonical ? `<meta property="og:url" content="${attr(p.canonical)}">` : '',
    p.ogImage ? `<meta property="og:image" content="${attr(p.ogImage)}">` : '',
    `<meta name="twitter:card" content="${p.ogImage ? 'summary_large_image' : 'summary'}">`,
  ].filter(Boolean).join('\n  ');

  const alternates = p.alternates
    .map((a) => `<link rel="alternate" hreflang="${attr(a.code)}" href="${attr(a.url)}">`).join('\n  ');

  return `<!doctype html>
<html lang="${attr(p.lang)}" data-theme="dark" data-base="${attr(p.baseHref)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(p.title)}</title>
  <meta name="description" content="${attr(p.description)}">
  ${p.noindex ? '<meta name="robots" content="noindex">\n  ' : ''}<meta name="theme-color" content="#25282c">
  <link rel="icon" type="image/svg+xml" href="${attr(href('assets/img/favicon.svg'))}">
  ${p.canonical ? `<link rel="canonical" href="${attr(p.canonical)}">\n  ` : ''}${alternates ? alternates + '\n  ' : ''}${meta}
  <link rel="stylesheet" href="${attr(href('assets/css/theme.css'))}">
  <script>
    document.documentElement.classList.add('js');
    try { var t = localStorage.getItem('docs-theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
  </script>${p.jsonLd ? `\n  <script type="application/ld+json">${p.jsonLd}</script>` : ''}
</head>
<body>
  <a class="skip-link" href="#main">${escapeHtml(t('skip'))}</a>
  <header class="topbar">
    <button class="icon-btn" id="menu-toggle" type="button" aria-label="${attr(t('menu'))}" aria-controls="sidebar">☰</button>
    <a class="topbar-title" href="${attr(p.homeHref)}">${escapeHtml(siteName)}</a>
  </header>

  <div class="layout">
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-head">
        <a class="brand" href="${attr(p.homeHref)}">${logo}</a>
        <div class="search">
          <input id="search" type="search" placeholder="${attr(t('search'))}" aria-label="${attr(t('searchLabel'))}" autocomplete="off">
        </div>
      </div>
      <div class="sidebar-body">
        <nav id="nav" aria-label="${attr(t('contents'))}">
${p.nav}
        </nav>
        <div id="results" class="results" hidden></div>
      </div>
      <div class="sidebar-foot">
        <span>${escapeHtml(site.version || '')}${languageSwitch ? ' ' + languageSwitch : ''}</span>
        <button class="theme-btn" id="theme-toggle" type="button" aria-label="${attr(t('theme'))}">☾ / ☀</button>
      </div>
    </aside>

    <main class="content" id="main">
      <div class="content-head">
        <div>
          <div class="site-subtitle">${escapeHtml(site.subtitle || siteName)}</div>
          <ol class="breadcrumb">${renderBreadcrumb({ trail: p.trail, current: p.current, title: p.pageTitle, homeHref: p.homeHref, href, t })}</ol>
        </div>
        <div class="head-links">${headLinks}</div>
      </div>
      <article class="doc">
${p.content}
      </article>
      <footer class="pager">${renderPager({ prev: p.prev, next: p.next, href, t })}</footer>
      <div class="site-footer">${escapeHtml(site.footer || '')}</div>
    </main>
  </div>
  <div class="backdrop" id="backdrop"></div>

  <script type="application/json" id="ui">${JSON.stringify(p.ui).replace(/</g, '\\u003c')}</script>
  <script src="${attr(href('assets/js/site.js'))}" defer></script>
</body>
</html>
`;
}

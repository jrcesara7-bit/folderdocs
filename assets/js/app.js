/* Lector de documentación: carga archivos .md desde /docs, los convierte a HTML
 * con marked y los pinta con el tema de theme.css. Sin paso de build.
 *
 * Rutas:  #/carpeta/pagina          → docs/carpeta/pagina.md
 *         #/carpeta/pagina#seccion  → ídem, saltando al encabezado "seccion"
 */
(() => {
  'use strict';

  const DOCS_DIR = 'docs';
  const $ = (sel) => document.querySelector(sel);

  /* Textos de la interfaz. Para añadir un idioma, copia un bloque y ponle su código en
   * `site.lang` de docs/config.json. Los textos que no existan caen en español. */
  const I18N = {
    es: {
      siteName: 'Documentación', loading: 'Cargando…', home: 'Inicio',
      search: 'Buscar en la documentación', searchLabel: 'Buscar', noResults: 'Sin resultados.',
      menu: 'Abrir menú', theme: 'Cambiar tema', contents: 'Contenido', expand: 'Expandir',
      edit: '✎ Editar en GitHub', contribute: '¡Aprende cómo contribuir!', anchor: 'Enlace a esta sección',
      copy: 'Copiar', copied: '¡Copiado!', copyError: 'Error',
      note: 'Nota', tip: 'Consejo', important: 'Importante', warning: 'Advertencia', caution: 'Precaución',
      notFound: 'Página no encontrada',
      notFoundBody: (path) => `No existe <code>${path}</code>. Revisa que el archivo exista en <code>docs/</code> y que el enlace apunte a su ruta.`,
      backHome: 'Volver al inicio',
      configError: 'No se pudo cargar docs/config.json',
      configErrorBody: 'Si abriste <code>index.html</code> con doble clic, el navegador bloquea la lectura de archivos. Sirve la carpeta con un servidor local: <code>node tools/serve.mjs</code>',
      navError: 'No se pudo cargar docs/nav.json',
      navErrorBody: 'El menú se genera a partir de las carpetas de <code>docs/</code>. Ejecuta <code>node tools/build-nav.mjs</code> (o usa <code>node tools/serve.mjs</code>, que lo hace solo).',
    },
    en: {
      siteName: 'Documentation', loading: 'Loading…', home: 'Home',
      search: 'Search the docs', searchLabel: 'Search', noResults: 'No results.',
      menu: 'Open menu', theme: 'Toggle theme', contents: 'Contents', expand: 'Expand',
      edit: '✎ Edit on GitHub', contribute: 'Learn how to contribute!', anchor: 'Link to this section',
      copy: 'Copy', copied: 'Copied!', copyError: 'Error',
      note: 'Note', tip: 'Tip', important: 'Important', warning: 'Warning', caution: 'Caution',
      notFound: 'Page not found',
      notFoundBody: (path) => `<code>${path}</code> does not exist. Check that the file is in <code>docs/</code> and that the link points to its path.`,
      backHome: 'Back to home',
      configError: 'Could not load docs/config.json',
      configErrorBody: 'If you opened <code>index.html</code> by double-clicking it, the browser blocks file access. Serve the folder with a local server: <code>node tools/serve.mjs</code>',
      navError: 'Could not load docs/nav.json',
      navErrorBody: 'The menu is generated from the folders in <code>docs/</code>. Run <code>node tools/build-nav.mjs</code> (or use <code>node tools/serve.mjs</code>, which does it for you).',
    },
  };
  let strings = I18N.es;
  const t = (key, ...args) => {
    const value = strings[key] !== undefined ? strings[key] : I18N.es[key];
    return typeof value === 'function' ? value(...args) : value;
  };

  const els = {
    nav: $('#nav'), results: $('#results'), search: $('#search'),
    doc: $('#doc'), breadcrumb: $('#breadcrumb'), pager: $('#pager'),
    headLinks: $('#head-links'), subtitle: $('#site-subtitle'),
    brand: $('#brand'), topbarTitle: $('#topbar-title'),
    footLabel: $('#foot-label'), siteFooter: $('#site-footer'),
  };

  let cfg;                 // contenido de docs/config.json
  let pages = [];          // páginas del menú, en orden de lectura
  const byPath = new Map();
  let currentPath = null;
  let loadToken = 0;       // descarta respuestas de navegaciones antiguas

  /* ----------------------------- utilidades ----------------------------- */

  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const fold = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const slugify = (s) => fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'seccion';

  const isExternal = (href) => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href);

  /** Resuelve `href` relativo al directorio de `fromPath`; devuelve ruta limpia dentro de docs. */
  function resolvePath(fromPath, href) {
    const base = href.startsWith('/') ? [] : fromPath.split('/').slice(0, -1);
    for (const part of href.split('/')) {
      if (part === '' || part === '.') continue;
      if (part === '..') base.pop(); else base.push(part);
    }
    return base.join('/');
  }

  function saveSetting(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* sin storage: el tema no se recuerda */ }
  }

  /* ------------------------------ arranque ------------------------------ */

  async function init() {
    try {
      cfg = await fetchJson('config.json');
    } catch (err) {
      els.doc.innerHTML = `<h1>${t('configError')}</h1><p>${t('configErrorBody')}</p>`;
      return;
    }
    try {
      cfg.nav = await fetchJson('nav.json');
    } catch (err) {
      els.doc.innerHTML = `<h1>${t('navError')}</h1><p>${t('navErrorBody')}</p>`;
      return;
    }

    cfg.site = cfg.site || {};
    setLanguage(cfg.site.lang);
    flattenNav();
    applySiteInfo();
    renderNav();
    bindUi();
    window.addEventListener('hashchange', route);
    route();
  }

  function setLanguage(lang) {
    const code = String(lang || 'es').toLowerCase().split('-')[0];
    strings = I18N[code] || I18N.es;
    document.documentElement.lang = I18N[code] ? code : 'es';
    els.search.placeholder = t('search');
    els.search.setAttribute('aria-label', t('searchLabel'));
    $('#menu-toggle').setAttribute('aria-label', t('menu'));
    $('#theme-toggle').setAttribute('aria-label', t('theme'));
    $('#nav').setAttribute('aria-label', t('contents'));
  }

  async function fetchJson(name) {
    const res = await fetch(`${DOCS_DIR}/${name}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    return res.json();
  }

  function flattenNav() {
    const walk = (items, trail) => {
      for (const item of items) {
        if (item.path) {
          const page = { title: item.title, path: item.path, trail };
          pages.push(page);
          byPath.set(item.path, page);
        }
        if (item.items) walk(item.items, [...trail, item.title]);
      }
    };
    for (const section of cfg.nav) walk(section.items || [], [section.title]);
  }

  function applySiteInfo() {
    const s = cfg.site;
    document.title = s.title || t('siteName');
    els.topbarTitle.textContent = s.title || t('siteName');
    els.subtitle.textContent = s.subtitle || s.title || '';
    els.footLabel.textContent = s.version || '';
    els.siteFooter.textContent = s.footer || '';
    if (s.logo) {
      const img = document.createElement('img');
      img.src = s.logo; img.alt = s.title || '';
      els.brand.append(img);
    } else {
      const mark = document.createElement('span');
      mark.className = 'brand-mark';
      mark.textContent = (s.title || 'D').trim().charAt(0).toUpperCase();
      const name = document.createElement('span');
      name.textContent = s.title || t('siteName');
      els.brand.append(mark, name);
    }
  }

  /* ------------------------------- menú ------------------------------- */

  function renderNav() {
    const buildItems = (items) => {
      const ul = document.createElement('ul');
      ul.className = 'nav-list';
      for (const item of items) {
        const li = document.createElement('li');
        const row = document.createElement('div');
        row.className = 'nav-row';
        const hasKids = Array.isArray(item.items) && item.items.length > 0;

        if (hasKids) {
          li.classList.add('has-children');
          const btn = document.createElement('button');
          btn.className = 'expander';
          btn.setAttribute('aria-label', `${t('expand')} ${item.title}`);
          btn.addEventListener('click', () => li.classList.toggle('open'));
          row.append(btn);
        }

        const a = document.createElement('a');
        a.className = 'nav-link';
        a.textContent = item.title;
        if (item.path) {
          a.href = `#/${item.path}`;
          a.dataset.path = item.path;
        } else {
          a.href = '#';
          a.addEventListener('click', (e) => { e.preventDefault(); li.classList.toggle('open'); });
        }
        row.append(a);
        li.append(row);
        if (hasKids) li.append(buildItems(item.items));
        ul.append(li);
      }
      return ul;
    };

    for (const [i, section] of cfg.nav.entries()) {
      const wrap = document.createElement('section');
      wrap.className = 'nav-section';
      if (i === 0) wrap.classList.add('open');
      const title = document.createElement('button');
      title.className = 'nav-section-title';
      title.textContent = section.title;
      title.addEventListener('click', () => wrap.classList.toggle('open'));
      wrap.append(title, buildItems(section.items || []));
      els.nav.append(wrap);
    }
  }

  function syncNav(path) {
    els.nav.querySelectorAll('.nav-link.active').forEach((a) => a.classList.remove('active'));
    const link = els.nav.querySelector(`.nav-link[data-path="${CSS.escape(path)}"]`);
    if (!link) return;
    link.classList.add('active');
    for (let el = link.parentElement; el && el !== els.nav; el = el.parentElement) {
      if (el.matches('.nav-section, .has-children')) el.classList.add('open');
    }
    link.scrollIntoView({ block: 'nearest' });
  }

  /* ------------------------------ enrutado ------------------------------ */

  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    const m = raw.match(/^\/?([^#]*)(?:#(.*))?$/);
    let path = (m && m[1] || '').replace(/\/+$/, '').replace(/\.md$/i, '');
    if (!path) path = cfg.site.home || (pages[0] && pages[0].path) || 'index';
    const valid = /^[\w\-./áéíóúñÁÉÍÓÚÑ]+$/.test(path) && !path.split('/').includes('..');
    return { path: valid ? path : null, anchor: m && m[2] || '' };
  }

  async function route() {
    closeMenu();
    let { path, anchor } = parseHash();
    if (path === null) return showNotFound(location.hash);
    // #/carpeta equivale a #/carpeta/index
    if (!byPath.has(path) && byPath.has(`${path}/index`)) path = `${path}/index`;
    if (path === currentPath) return scrollToAnchor(anchor);
    await loadPage(path, anchor);
  }

  async function loadPage(path, anchor) {
    const token = ++loadToken;
    let text;
    try {
      const res = await fetch(`${DOCS_DIR}/${path}.md`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      text = await res.text();
    } catch (err) {
      if (token === loadToken) showNotFound(path);
      return;
    }
    if (token !== loadToken) return;

    const { meta, body } = splitFrontMatter(text);
    currentPath = path;
    els.doc.innerHTML = marked.parse(body, { gfm: true });
    enhance(els.doc, path);

    const page = byPath.get(path);
    const h1 = els.doc.querySelector('h1');
    const h1Text = h1 && [...h1.childNodes].filter((n) => !(n.classList && n.classList.contains('anchor'))).map((n) => n.textContent).join('');
    const title = meta.title || (page && page.title) || h1Text || path;
    document.title = `${title} · ${cfg.site.title || t('siteName')}`;

    renderBreadcrumb(page, title);
    renderHeadLinks(path);
    renderPager(page);
    syncNav(path);
    if (anchor) scrollToAnchor(anchor); else window.scrollTo(0, 0);
  }

  function showNotFound(path) {
    currentPath = null;
    els.doc.innerHTML = `<h1>${t('notFound')}</h1><p>${t('notFoundBody', escapeHtml(path))}</p>` +
      `<p><a href="#/">${t('backHome')}</a></p>`;
    els.breadcrumb.innerHTML = '';
    els.pager.innerHTML = '';
    els.headLinks.innerHTML = '';
  }

  function scrollToAnchor(anchor) {
    if (!anchor) return;
    const target = document.getElementById(anchor);
    if (target) target.scrollIntoView();
  }

  function splitFrontMatter(text) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    const meta = {};
    if (!m) return { meta, body: text };
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
    }
    return { meta, body: text.slice(m[0].length) };
  }

  /* ----------------------- cabecera, migas, paginador ----------------------- */

  function renderBreadcrumb(page, title) {
    els.breadcrumb.innerHTML = '';
    const crumb = (content) => {
      const li = document.createElement('li');
      if (typeof content === 'string') li.textContent = content; else li.append(content);
      els.breadcrumb.append(li);
    };
    const home = document.createElement('a');
    home.href = '#/'; home.textContent = t('home');
    crumb(home);
    if (page) page.trail.forEach(crumb);
    crumb(title);
  }

  function renderHeadLinks(path) {
    const { repo, branch, contributeUrl } = cfg.site;
    els.headLinks.innerHTML = '';
    if (repo) {
      const a = document.createElement('a');
      a.href = `https://github.com/${repo}/edit/${branch || 'main'}/${DOCS_DIR}/${path}.md`;
      a.target = '_blank'; a.rel = 'noopener';
      a.textContent = t('edit');
      els.headLinks.append(a);
    }
    if (contributeUrl) {
      const a = document.createElement('a');
      a.className = 'small'; a.href = contributeUrl; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = t('contribute');
      els.headLinks.append(a);
    }
  }

  function renderPager(page) {
    els.pager.innerHTML = '';
    if (!page) return;
    const i = pages.indexOf(page);
    const link = (p, cls, label) => {
      const a = document.createElement('a');
      a.className = cls; a.href = `#/${p.path}`;
      a.textContent = label(p.title);
      els.pager.append(a);
    };
    if (i > 0) link(pages[i - 1], 'prev', (t) => `« ${t}`);
    if (i < pages.length - 1) link(pages[i + 1], 'next', (t) => `${t} »`);
  }

  /* ------------------ post-proceso del HTML generado ------------------ */

  const ADMONITIONS = {
    note: 'i', tip: '✓', important: '!', warning: '!', caution: '×',
  };

  function enhance(root, path) {
    rewriteLinks(root, path);
    rewriteImages(root, path);
    addHeadingAnchors(root, path);
    buildAdmonitions(root);
    wrapTables(root);
    highlightCode(root);
  }

  function rewriteLinks(root, path) {
    root.querySelectorAll('a[href]').forEach((a) => {
      if (a.classList.contains('anchor')) return;
      const href = a.getAttribute('href');
      if (isExternal(href)) {
        a.target = '_blank'; a.rel = 'noopener noreferrer';
        if (!a.querySelector('img') && !a.classList.contains('tile')) a.classList.add('external');
      } else if (href.startsWith('#/')) {
        // ya es una ruta de la app (útil en HTML escrito a mano, p. ej. los tiles)
      } else if (href.startsWith('#')) {
        a.setAttribute('href', `#/${path}#${href.slice(1)}`);
      } else {
        const [file, frag] = href.split('#');
        if (/\.md$/i.test(file) || !/\.[a-z0-9]+$/i.test(file)) {
          const target = resolvePath(path, file.replace(/\.md$/i, ''));
          a.setAttribute('href', `#/${target}${frag ? '#' + frag : ''}`);
        } else {
          a.setAttribute('href', `${DOCS_DIR}/${resolvePath(path, file)}`);
        }
      }
    });
  }

  function rewriteImages(root, path) {
    root.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (!isExternal(src) && !src.startsWith('data:')) {
        img.setAttribute('src', `${DOCS_DIR}/${resolvePath(path, src)}`);
      }
      img.loading = 'lazy';
    });
  }

  function addHeadingAnchors(root, path) {
    const used = new Set();
    root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      let id = slugify(h.textContent), n = 1;
      while (used.has(id)) id = `${slugify(h.textContent)}-${++n}`;
      used.add(id);
      h.id = id;
      const a = document.createElement('a');
      a.className = 'anchor';
      a.href = `#/${path}#${id}`;
      a.setAttribute('aria-label', t('anchor'));
      a.textContent = '¶';
      h.prepend(a);
    });
  }

  function buildAdmonitions(root) {
    root.querySelectorAll('blockquote').forEach((bq) => {
      const first = bq.firstElementChild;
      if (!first || first.tagName !== 'P') return;
      const m = first.innerHTML.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:<br\s*\/?>|\n)?\s*/i);
      if (!m) return;
      const kind = m[1].toLowerCase();
      first.innerHTML = first.innerHTML.slice(m[0].length);
      if (!first.textContent.trim() && !first.children.length) first.remove();

      const box = document.createElement('div');
      box.className = `admonition ${kind}`;
      const head = document.createElement('div');
      head.className = 'admonition-title';
      head.innerHTML = `<span class="ico"><span>${ADMONITIONS[kind]}</span></span>${t(kind)}`;
      const body = document.createElement('div');
      body.className = 'admonition-body';
      body.append(...bq.childNodes);
      box.append(head, body);
      bq.replaceWith(box);
    });
  }

  function wrapTables(root) {
    root.querySelectorAll('table').forEach((t) => {
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      t.replaceWith(wrap);
      wrap.append(t);
    });
  }

  function highlightCode(root) {
    root.querySelectorAll('pre > code').forEach((code) => {
      const lang = (code.className.match(/language-([\w-]+)/) || [])[1];
      if (lang && window.hljs && hljs.getLanguage(lang)) hljs.highlightElement(code);

      const pre = code.parentElement;
      const wrap = document.createElement('div');
      wrap.className = 'code-block';
      pre.replaceWith(wrap);
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = t('copy');
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          btn.textContent = t('copied');
        } catch (e) { btn.textContent = t('copyError'); }
        setTimeout(() => { btn.textContent = t('copy'); }, 1500);
      });
      wrap.append(pre, btn);
    });
  }

  /* ------------------------------ búsqueda ------------------------------ */

  let indexPromise = null;

  function buildIndex() {
    if (!indexPromise) {
      indexPromise = Promise.all(pages.map(async (page) => {
        try {
          const res = await fetch(`${DOCS_DIR}/${page.path}.md`);
          const raw = res.ok ? await res.text() : '';
          const text = splitFrontMatter(raw).body
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/[#>*_`|~-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return { page, text, textFold: fold(text), titleFold: fold(page.title) };
        } catch (e) {
          return { page, text: '', textFold: '', titleFold: fold(page.title) };
        }
      }));
    }
    return indexPromise;
  }

  async function runSearch() {
    const query = els.search.value.trim();
    if (!query) {
      els.results.hidden = true; els.nav.hidden = false;
      return;
    }
    els.nav.hidden = true; els.results.hidden = false;
    const terms = fold(query).split(/\s+/).filter(Boolean);
    const index = await buildIndex();
    if (els.search.value.trim() !== query) return;   // el usuario siguió escribiendo

    const hits = [];
    for (const entry of index) {
      if (!terms.every((t) => entry.titleFold.includes(t) || entry.textFold.includes(t))) continue;
      let score = 0;
      for (const t of terms) {
        if (entry.titleFold.includes(t)) score += 10;
        score += Math.min(entry.textFold.split(t).length - 1, 10);
      }
      hits.push({ entry, score });
    }
    hits.sort((a, b) => b.score - a.score);

    els.results.innerHTML = '';
    if (!hits.length) {
      els.results.innerHTML = `<div class="results-empty">${t('noResults')}</div>`;
      return;
    }
    for (const { entry } of hits.slice(0, 10)) {
      const a = document.createElement('a');
      a.className = 'result';
      a.href = `#/${entry.page.path}`;
      a.innerHTML =
        `<div class="result-title">${escapeHtml(entry.page.title)}</div>` +
        `<div class="result-where">${escapeHtml(entry.page.trail.join(' › '))}</div>` +
        `<div class="result-snippet">${snippet(entry, terms)}</div>`;
      a.addEventListener('click', () => { els.search.value = ''; runSearch(); });
      els.results.append(a);
    }
  }

  function snippet(entry, terms) {
    const pos = Math.min(...terms.map((t) => entry.textFold.indexOf(t)).filter((p) => p >= 0), Infinity);
    if (!isFinite(pos)) return escapeHtml(entry.text.slice(0, 110));
    const start = Math.max(0, pos - 40);
    // fold() conserva la longitud en español, así que los índices coinciden con el texto original
    const raw = entry.text.slice(start, start + 140);
    let html = escapeHtml(raw);
    for (const t of terms) {
      html = html.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
    }
    return (start > 0 ? '…' : '') + html + '…';
  }

  /* ---------------------------- UI auxiliar ---------------------------- */

  function closeMenu() { document.body.classList.remove('nav-open'); }

  function bindUi() {
    $('#menu-toggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
    $('#backdrop').addEventListener('click', closeMenu);

    $('#theme-toggle').addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      saveSetting('docs-theme', next);
    });

    let timer;
    els.search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(runSearch, 120); });
    els.search.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { els.search.value = ''; runSearch(); els.search.blur(); }
      if (e.key === 'Enter') {
        const first = els.results.querySelector('.result');
        if (first) first.click();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        e.preventDefault(); els.search.focus();
      }
    });
  }

  init();
})();

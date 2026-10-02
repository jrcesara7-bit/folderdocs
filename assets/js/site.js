/* Progressive enhancement for pages that are already complete HTML: theme toggle, mobile
 * menu, search, copy buttons and sidebar scroll memory. Without JavaScript the site is
 * still fully readable and navigable. */
(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;
  const base = root.dataset.base || './';          // relative path from this page to the language root
  const ui = (() => { try { return JSON.parse($('#ui').textContent); } catch (e) { return {}; } })();

  const save = (storage, key, value) => { try { storage.setItem(key, value); } catch (e) { /* storage unavailable */ } };
  const load = (storage, key) => { try { return storage.getItem(key); } catch (e) { return null; } };

  /* ---- Links from the previous hash-based version (#/folder/01-page) ---- */
  const legacy = location.hash.match(/^#\/(.*)$/);
  if (legacy) {
    const path = legacy[1].split('#')[0].replace(/\.md$/i, '').replace(/\/?index$/, '')
      .split('/').map((s) => s.replace(/^\d+[-_.\s]+/, '').toLowerCase()).join('/');
    location.replace(base + (path ? path + '/' : ''));
    return;
  }

  /* ---- Theme ---- */
  $('#theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    save(localStorage, 'docs-theme', next);
  });

  /* ---- Mobile menu ---- */
  const closeMenu = () => document.body.classList.remove('nav-open');
  $('#menu-toggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $('#backdrop').addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---- Sidebar: keep scroll position between pages and show the active link ---- */
  const sidebarBody = $('.sidebar-body');
  const active = $('.nav-link.active');
  const savedScroll = load(sessionStorage, 'docs-nav-scroll');
  if (savedScroll !== null) sidebarBody.scrollTop = Number(savedScroll) || 0;
  if (active) {
    const box = sidebarBody.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    if (rect.top < box.top || rect.bottom > box.bottom) active.scrollIntoView({ block: 'center' });
  }
  window.addEventListener('pagehide', () => save(sessionStorage, 'docs-nav-scroll', sidebarBody.scrollTop));

  /* ---- Copy buttons ---- */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      const code = btn.parentElement.querySelector('code');
      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.textContent = ui.copied || 'Copied!';
      } catch (e) { btn.textContent = ui.copyError || 'Error'; }
      setTimeout(() => { btn.textContent = label; }, 1500);
    });
  });

  /* ---- Search ---- */
  const input = $('#search');
  const nav = $('#nav');
  const results = $('#results');
  let index = null;
  let timer;

  const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function loadIndex() {
    if (!index) {
      index = fetch(`${base}search-index.json`).then((r) => r.json()).then((list) =>
        list.map((e) => ({ ...e, titleFold: fold(e.t), textFold: fold(e.x) }))).catch(() => []);
    }
    return index;
  }

  function snippet(entry, terms) {
    const positions = terms.map((t) => entry.textFold.indexOf(t)).filter((p) => p >= 0);
    if (!positions.length) return escapeHtml(entry.x.slice(0, 110));
    const start = Math.max(0, Math.min(...positions) - 40);
    let html = escapeHtml(entry.x.slice(start, start + 140));
    for (const t of terms) {
      html = html.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
    }
    return (start > 0 ? '…' : '') + html + '…';
  }

  async function runSearch() {
    const query = input.value.trim();
    if (!query) { results.hidden = true; nav.hidden = false; return; }
    nav.hidden = true; results.hidden = false;
    const terms = fold(query).split(/\s+/).filter(Boolean);
    const list = await loadIndex();
    if (input.value.trim() !== query) return;

    const hits = [];
    for (const entry of list) {
      if (!terms.every((t) => entry.titleFold.includes(t) || entry.textFold.includes(t))) continue;
      let score = 0;
      for (const t of terms) {
        if (entry.titleFold.includes(t)) score += 10;
        score += Math.min(entry.textFold.split(t).length - 1, 10);
      }
      hits.push({ entry, score });
    }
    hits.sort((a, b) => b.score - a.score);

    results.innerHTML = '';
    if (!hits.length) {
      results.innerHTML = `<div class="results-empty">${escapeHtml(ui.noResults || 'No results.')}</div>`;
      return;
    }
    for (const { entry } of hits.slice(0, 10)) {
      const a = document.createElement('a');
      a.className = 'result';
      a.href = base + entry.u.split('/').map(encodeURIComponent).join('/');
      a.innerHTML = `<div class="result-title">${escapeHtml(entry.t)}</div>` +
        (entry.s ? `<div class="result-where">${escapeHtml(entry.s)}</div>` : '') +
        `<div class="result-snippet">${snippet(entry, terms)}</div>`;
      results.append(a);
    }
  }

  input.addEventListener('focus', loadIndex, { once: true });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(runSearch, 120); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { input.value = ''; runSearch(); input.blur(); }
    if (e.key === 'Enter') { const first = results.querySelector('.result'); if (first) location.href = first.href; }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); input.focus();
    }
  });
})();

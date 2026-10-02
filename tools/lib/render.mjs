/* Markdown → HTML for one page: marked + highlight.js, plus GitHub-style admonitions,
 * heading anchors, relative-link resolution and a few presentation wrappers.
 * Runs at build time only: the browser receives finished HTML. */
import { Marked } from '../vendor/marked.esm.js';
import hljs from '../vendor/highlight.esm.min.js';
import { decodeEntities, encodePath, escapeHtml, relativeUrl, resolveSourcePath, slugify } from './util.mjs';

const ADMONITION_ICONS = { note: 'i', tip: '✓', important: '!', warning: '!', caution: '×' };
const isExternal = (href) => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
const stripTags = (html) => decodeEntities(html.replace(/<[^>]+>/g, ''));

/**
 * ctx = {
 *   page,            // the page being rendered ({ rel, slug, … })
 *   pageDir,         // site path of the page's directory ("guide/intro")
 *   urlForRel(rel),  // site path of the page whose source path is `rel`, or undefined
 *   assetUrl(rel),   // site path of a copied asset, or undefined
 *   t,               // translator
 *   warn(message)    // collects problems (broken links…)
 * }
 */
export function renderMarkdown(body, ctx) {
  const used = new Set();
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const base = slugify(stripTags(inner)) || 'section';
        let id = base;
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
        used.add(id);
        return `<h${depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="${escapeHtml(ctx.t('anchor'))}">¶</a></h${depth}>\n`;
      },

      code({ text, lang }) {
        const language = (lang || '').trim().split(/\s+/)[0];
        let html;
        let cls = '';
        if (language && hljs.getLanguage(language)) {
          html = hljs.highlight(text, { language, ignoreIllegals: true }).value;
          cls = ` class="hljs language-${escapeHtml(language)}"`;
        } else {
          html = escapeHtml(text);
          if (language) cls = ` class="language-${escapeHtml(language)}"`;
        }
        return `<div class="code-block"><pre><code${cls}>${html}</code></pre>` +
          `<button class="copy-btn" type="button">${escapeHtml(ctx.t('copy'))}</button></div>\n`;
      },

      blockquote({ tokens }) {
        const inner = this.parser.parse(tokens);
        const m = inner.match(/^\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:<br\s*\/?>|\n)?\s*/i);
        if (!m) return `<blockquote>\n${inner}</blockquote>\n`;
        const kind = m[1].toLowerCase();
        return `<div class="admonition ${kind}"><div class="admonition-title"><span class="ico"><span>${ADMONITION_ICONS[kind]}</span></span>${escapeHtml(ctx.t(kind))}</div>` +
          `<div class="admonition-body">${admonitionBody(inner, m[0])}</div></div>\n`;
      },
    },
  });

  let html = marked.parse(body);
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  html = rewriteReferences(html, ctx);
  return html;
}

/** Drops the "[!NOTE]" marker from the rendered body, keeping valid paragraph markup. */
function admonitionBody(inner, marker) {
  const rest = inner.slice(marker.length);
  // Marker alone in its paragraph: the body continues after the closing </p>.
  if (rest.startsWith('</p>')) return rest.replace(/^<\/p>\s*/, '');
  // Text followed the marker inside the same paragraph.
  return `<p>${rest}`;
}

/** Rewrites href/src attributes: .md links to page URLs, assets to copied files, external links to new tabs. */
function rewriteReferences(html, ctx) {
  const resolveLocal = (href) => {
    const [pathPart, fragment] = splitFragment(href);
    const frag = fragment ? `#${fragment}` : '';
    if (pathPart === '') return href;

    const target = resolveSourcePath(ctx.page.rel, pathPart);
    const noExt = target.replace(/\.md$/i, '').replace(/\/$/, '');
    const isMarkdownLike = /\.md$/i.test(pathPart) || !/\.[a-z0-9]+$/i.test(pathPart);
    if (isMarkdownLike) {
      const sitePath = ctx.urlForRel(noExt) ?? ctx.urlForRel(`${noExt}/index`);
      if (sitePath === undefined) {
        ctx.warn(`${ctx.page.sourcePath}: link to "${href}" does not match any page`);
        return href;
      }
      return relativeUrl(ctx.pageDir, encodePath(sitePath)) + frag;
    }
    const asset = ctx.assetUrl(target);
    if (asset === undefined) {
      ctx.warn(`${ctx.page.sourcePath}: file "${href}" not found in the docs folder`);
      return href;
    }
    return relativeUrl(ctx.pageDir, encodePath(asset)) + frag;
  };

  html = html.replace(/<a\s([^>]*?)href="([^"]*)"([^>]*)>/g, (all, before, rawHref, after) => {
    const href = decodeEntities(rawHref);
    if (/\bclass="[^"]*\banchor\b/.test(before + after)) return all;
    if (isExternal(href)) {
      const hasTarget = /\btarget=/.test(before + after);
      const isTile = /\bclass="[^"]*\btile\b/.test(before + after);
      const attrs = `${before}href="${rawHref}"${after}`;
      return `<a ${isTile ? attrs : addClass(attrs, 'external')}${hasTarget ? '' : ' target="_blank" rel="noopener noreferrer"'}>`;
    }
    if (href.startsWith('#') || href.startsWith('/')) return all;
    return `<a ${before}href="${escapeHtml(resolveLocal(href))}"${after}>`;
  });

  html = html.replace(/<img\s([^>]*?)src="([^"]*)"([^>]*)>/g, (all, before, rawSrc, after) => {
    const src = decodeEntities(rawSrc);
    const lazy = /\bloading=/.test(before + after) ? '' : ' loading="lazy"';
    if (isExternal(src) || src.startsWith('data:') || src.startsWith('/')) return `<img ${before}src="${rawSrc}"${after}${lazy}>`;
    return `<img ${before}src="${escapeHtml(resolveLocal(src))}"${after}${lazy}>`;
  });
  return html;
}

function addClass(attrs, cls) {
  if (/\bclass="/.test(attrs)) return attrs.replace(/\bclass="([^"]*)"/, (_, c) => `class="${c} ${cls}"`);
  return `${attrs} class="${cls}"`;
}

const splitFragment = (href) => {
  const i = href.indexOf('#');
  return i === -1 ? [href, ''] : [href.slice(0, i), href.slice(i + 1)];
};

/** Plain text of a rendered page (for search and descriptions). */
export function plainText(html) {
  return stripTags(
    html.replace(/<button[\s\S]*?<\/button>/g, ' ').replace(/<a class="anchor"[\s\S]*?<\/a>/g, ' ').replace(/<\/(p|li|h[1-6]|tr|div|pre)>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
}

/** First top-level paragraph of the Markdown, as plain text (for meta descriptions). */
export function firstParagraph(body) {
  const marked = new Marked({ gfm: true });
  const token = marked.lexer(body).find((t) => t.type === 'paragraph');
  if (!token) return '';
  return plainText(marked.parseInline(token.text));
}

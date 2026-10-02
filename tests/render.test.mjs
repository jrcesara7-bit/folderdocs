import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, firstParagraph, plainText } from '../tools/lib/render.mjs';
import { translator } from '../tools/lib/i18n.mjs';

function render(md, overrides = {}) {
  const warnings = [];
  const html = renderMarkdown(md, {
    page: { rel: 'guide/02-syntax', sourcePath: 'guide/02-syntax.md' },
    pageDir: 'guide/syntax',
    t: translator('en'),
    urlForRel: (rel) => ({ 'guide/01-org': 'guide/org/', index: '', 'other/index': 'other/' })[rel],
    assetUrl: (rel) => (rel === 'img/a.png' || rel === 'files/m.pdf' ? rel : undefined),
    warn: (m) => warnings.push(m),
    ...overrides,
  });
  return { html, warnings };
}

test('headings get unique ids and an anchor link', () => {
  const { html } = render('# Hi *there*\n\n## Hi there\n');
  assert.match(html, /<h1 id="hi-there">Hi <em>there<\/em><a class="anchor" href="#hi-there"/);
  assert.match(html, /<h2 id="hi-there-2">/);
});

test('GitHub-style admonitions become styled boxes', () => {
  const { html } = render('> [!NOTE]\n> Body text\n\n> [!WARNING]\n>\n> Separate paragraph\n');
  assert.match(html, /<div class="admonition note">.*Note<\/div><div class="admonition-body"><p>Body text<\/p>/s);
  assert.match(html, /<div class="admonition warning">.*Warning<\/div><div class="admonition-body"><p>Separate paragraph<\/p>/s);
  assert.doesNotMatch(html, /\[!NOTE\]|\[!WARNING\]/);
});

test('a plain blockquote stays a blockquote', () => {
  assert.match(render('> just a quote\n').html, /<blockquote>/);
});

test('admonition titles are translated', () => {
  const { html } = render('> [!TIP]\n> x\n', { t: translator('es') });
  assert.match(html, /Consejo/);
});

test('relative .md links become relative page URLs and keep their fragment', () => {
  const { html, warnings } = render('[a](01-org.md#x) [home](../index.md) [dir](../other/)');
  assert.match(html, /href="\.\.\/\.\.\/guide\/org\/#x"/);
  assert.match(html, /href="\.\.\/\.\.\/"[^>]*>home/);
  assert.match(html, /href="\.\.\/\.\.\/other\/"/);
  assert.deepEqual(warnings, []);
});

test('links to missing pages and files produce warnings', () => {
  const { warnings } = render('[a](nope.md) [b](../files/missing.pdf)');
  assert.equal(warnings.length, 2);
  assert.match(warnings[0], /guide\/02-syntax\.md: link to "nope\.md"/);
});

test('in-page anchors and absolute paths are left alone', () => {
  const { html } = render('<a href="#top">t</a> [x](/robots.txt)');
  assert.match(html, /href="#top"/);
  assert.match(html, /href="\/robots\.txt"/);
});

test('external links open in a new tab and get the external class', () => {
  const { html } = render('[x](https://example.com)');
  assert.match(html, /<a href="https:\/\/example\.com" class="external" target="_blank" rel="noopener noreferrer">x<\/a>/);
});

test('tiles written as raw HTML are resolved too', () => {
  const { html, warnings } = render('<div class="tiles"><a class="tile green" href="../other/index.md">T</a></div>');
  assert.match(html, /<a class="tile green" href="\.\.\/\.\.\/other\/">/);
  assert.deepEqual(warnings, []);
});

test('images resolve to the copied asset and load lazily', () => {
  const { html } = render('![alt text](../img/a.png)');
  assert.match(html, /<img src="\.\.\/\.\.\/img\/a\.png" alt="alt text" loading="lazy">/);
});

test('code blocks are highlighted and wrapped with a copy button', () => {
  const { html } = render('```js\nconst a = 1\n```\n');
  assert.match(html, /<div class="code-block"><pre><code class="hljs language-js"><span class="hljs-keyword">const<\/span>/);
  assert.match(html, /<button class="copy-btn" type="button">Copy<\/button>/);
});

test('code in unknown languages is escaped, not highlighted', () => {
  const { html } = render('```foobar\n<b>&\n```\n');
  assert.match(html, /<code class="language-foobar">&lt;b&gt;&amp;/);
});

test('tables are wrapped so they can scroll', () => {
  assert.match(render('| a | b |\n|---|---|\n| 1 | 2 |\n').html, /<div class="table-wrap"><table>/);
});

test('firstParagraph skips headings and admonitions and strips formatting', () => {
  assert.equal(firstParagraph('# T\n\n> [!NOTE]\n> n\n\nHello **world** [x](y) `code`.\n\nSecond.'), 'Hello world x code.');
});

test('plainText removes tags, buttons and anchors', () => {
  const { html } = render('# Title\n\n```js\nx\n```\n\nBody &amp; more');
  const text = plainText(html);
  assert.ok(text.includes('Title') && text.includes('Body & more'));
  assert.ok(!text.includes('Copy') && !text.includes('¶'));
});

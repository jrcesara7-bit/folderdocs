<div align="center">

# folderdocs

**Documentation template for Markdown. Your folders are the menu: write files and get a site with search and light/dark themes. No build step, nothing to install.**

[![CI](https://github.com/jrcesara7-bit/folderdocs/actions/workflows/ci.yml/badge.svg)](https://github.com/jrcesara7-bit/folderdocs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Node 18+](https://img.shields.io/badge/node-%E2%89%A518-339933)

[**Live demo**](https://jrcesara7-bit.github.io/folderdocs/) · [Report a bug](https://github.com/jrcesara7-bit/folderdocs/issues/new/choose) · [Español](README.md)

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/img/preview-light.png">
  <img alt="Screenshot of the template: sidebar with sections, search box and coloured tiles on the home page" src="docs/img/preview-dark.png" width="900">
</picture>

</div>

> The demo site and its documentation are written in Spanish. The interface itself can be switched to English with `"lang": "en"` in `docs/config.json`; your own `.md` files can be in any language.

## What it is

A template for presentable documentation (for a project, a product, a team or your own notes) where you only write `.md` files. Create a folder, add a file, reload: it shows up in the menu. There is no list to maintain, no framework to learn and no build step.

The look is inspired by the Godot documentation and the Read the Docs theme: collapsible sidebar sections, breadcrumbs, coloured admonitions and previous/next pagination.

## Features

- **Automatic menu**: each folder is a section, each subfolder a group, each `.md` a page. Titles come from front matter or the first `# H1`; order from `order`, a numeric prefix (`01-`) or alphabetical.
- **Text search** in the sidebar, no external service (shortcut: `/`).
- **Light and dark themes**, remembered between visits. Colours are CSS variables.
- **Extended Markdown**: tables, task lists, GitHub-style admonitions (`> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`), highlighted code with a copy button.
- **Relative links and images** between `.md` files, which also work when browsing them on GitHub.
- **Coloured tiles** for the home page, written as HTML inside the `.md`.
- **Responsive**, with a print stylesheet.
- **Interface in Spanish and English** (`site.lang`), extensible.
- **«Edit on GitHub»** link on every page.
- **Nothing to install**: `marked` and `highlight.js` ship in `assets/vendor/`. Node is only needed locally, for the dev server and the menu generator.
- **GitHub Actions** included: tests, menu check and GitHub Pages deployment.

## Quick start

You need [Node.js](https://nodejs.org) 18 or later.

```bash
# 1. Use the template ("Use this template" button on GitHub) or clone it
git clone https://github.com/jrcesara7-bit/folderdocs.git my-docs
cd my-docs

# 2. Start the local server (it rebuilds the menu on every reload)
npm run dev
```

Open <http://localhost:8000>. Then:

1. Create `docs/guide/hello.md` with `# Hello` and a paragraph.
2. Reload the browser: it appears in the menu.
3. Edit `docs/config.json` with your project's name and repository.

> Don't open `index.html` by double-clicking it: browsers block local file access. Use `npm run dev`.

## How content is organised

```text
docs/
├── index.md                    home page (not in the menu)
├── config.json                 name, language, repository…
├── guide/                      → section "Guide"
│   ├── _meta.json              { "title": "Guide", "order": 1 }   (optional)
│   ├── install.md              → page
│   └── advanced/               → collapsible group
│       ├── index.md            → the group's own page
│       └── 01-plugins.md       → numeric prefix sets the order
└── _drafts/                    anything starting with _ or . is ignored
```

The menu is stored in `docs/nav.json` (generated; don't edit it by hand).

## Customisation

| What | Where |
| --- | --- |
| Name, subtitle, footer, language, repository, logo | `docs/config.json` |
| Colours (dark and light), typography, width | variables at the top of `assets/css/theme.css` |
| Title, description and social preview | `index.html` and `assets/img/social-preview.png` |
| Interface strings or a new language | `I18N` object in `assets/js/app.js` |

## Publishing

`.github/workflows/pages.yml` deploys the site to GitHub Pages on every push to `main`. Just go to **Settings → Pages → Source → GitHub Actions**. Any static host works too (Netlify, Cloudflare Pages, nginx…).

## Limitations

Stated up front so you can decide with the facts:

- **No per-page SEO.** Content is rendered in the browser and URLs use `#/path`, so search engines see the site as a single page. For public documentation where each page should rank, use a generator that outputs one HTML file per page (MkDocs, Docusaurus, VitePress, Astro Starlight…); your `.md` files carry over almost unchanged.
- Requires JavaScript.
- No documentation versioning and no built-in language switcher.
- HTML inside `.md` files is not sanitised: not suitable for content from untrusted users.

## Development and contributing

```bash
npm run dev     # local server with automatic menu
npm run nav     # regenerate docs/nav.json
npm test        # menu generator tests
```

Contributions are welcome: read [CONTRIBUTING.md](CONTRIBUTING.md) first (in Spanish). Release notes are in the [CHANGELOG](CHANGELOG.md).

## Credits and license

- [marked](https://github.com/markedjs/marked) (MIT) and [highlight.js](https://highlightjs.org) (BSD-3-Clause), bundled in `assets/vendor/`.
- Look inspired by [Godot Docs](https://docs.godotengine.org) and Read the Docs; none of their assets are used.

Released under the [MIT](LICENSE) license.

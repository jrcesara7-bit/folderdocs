# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [semantic versioning](https://semver.org/).

*[Leer en español](.github/es/CHANGELOG.md)*

## [Unreleased]

## [2.0.0] - 2026-10-02

folderdocs now generates a **static HTML page for every Markdown file**, so search engines can index each page. This is a breaking release: the previous hash-based URLs (`#/guide/01-page`) are replaced by clean URLs (`/guide/page/`), and publishing requires a build step (GitHub Pages runs it for you).

### Added

- Static site generator (`npm run build`): one complete, readable-without-JavaScript HTML page per `.md` file, for every language.
- Clean URLs: folders and file names become `/folder/page/`, with numeric ordering prefixes dropped and accents removed. Colliding URLs stop the build.
- Per-page SEO: `<title>`, meta description (from `description:` front matter or the first paragraph), canonical link, Open Graph and Twitter tags, breadcrumb JSON-LD, `sitemap.xml`, `robots.txt` and a `noindex` `404.html`.
- `hreflang` alternates and a translation-aware language switcher, linking pages that share an `id:` in their front matter. Language folders (`docs-xx/`) are discovered automatically and the switcher is built from them.
- Automatic site URL detection on GitHub Actions, with `site.url` and `SITE_URL` overrides.
- Build-time link checking for pages, images and files, with `--strict` to fail the build.
- Search index generated at build time (`search-index.json`, one per language).
- Native `<details>` menu that works without JavaScript, a "skip to content" link and no-JavaScript layout fallbacks.
- Development server that rebuilds the site in memory whenever a source file changes.
- New config options: `description`, `url`, `image`, `langLabel`; new front matter fields: `description`, `id`, `seoTitle`.
- Secret-file patterns in `.gitignore`.

### Changed

- The browser no longer downloads or runs `marked` and `highlight.js`; they are used only at build time (`tools/vendor/`). The remaining script (`assets/js/site.js`) is about 150 lines.
- Documentation, tests and the Pages workflow were rewritten for the new architecture.

### Removed

- The client-side renderer (`assets/js/app.js`), the hand-written `index.html` entry pages and the generated `nav.json` files. Menus are built together with the pages.
- The `languages` and `home` config keys (languages are detected from the folders; the home page is always `index.md`).

### Migration from 1.x

- Links like `#/guide/01-page` redirect automatically to `/guide/page/` for anyone who opens an old link on the site.
- Replace `#/…` hrefs in hand-written HTML (such as home page tiles) with relative paths to `.md` files.
- Run `npm run build` (or `npm run dev`) instead of `npm run nav`.
- Remove any custom `index.html` edits: titles, descriptions and social tags now live in `config.json` and front matter.

## [1.0.0] - 2026-10-02

First public release.

### Added

- In-browser Markdown reader (`marked`) with GitHub extensions: tables, task lists, strikethrough.
- Sidebar menu generated automatically from the folders in `docs/` (`tools/build-nav.mjs`), with titles from front matter or `# H1`, order by `order`, numeric prefix or alphabetical, and a per-folder `_meta.json`.
- Text search in the sidebar, with the `/` shortcut.
- Light and dark themes, remembered between visits; responsive layout and print stylesheet.
- GitHub-style admonitions (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`).
- Code highlighting (`highlight.js`) and a copy button.
- Relative links and images between `.md` files; automatic heading anchors.
- Colored home page tiles.
- "Edit on GitHub" link, breadcrumbs and previous/next pagination.
- Interface in English and Spanish (`site.lang`), and multilingual sites: one documentation folder per language (`docs/`, `docs-es/`) with a language switcher.
- Development server (`tools/serve.mjs`) that regenerates the menus on every reload, and a site builder (`tools/build-site.mjs`).
- GitHub Actions workflows: tests, menu check and GitHub Pages deployment.
- Tests for the menu generator and the site builder (`npm test`).

[Unreleased]: https://github.com/jrcesara7-bit/folderdocs/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/jrcesara7-bit/folderdocs/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/jrcesara7-bit/folderdocs/releases/tag/v1.0.0

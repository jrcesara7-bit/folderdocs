# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [semantic versioning](https://semver.org/).

*[Leer en español](.github/es/CHANGELOG.md)*

## [Unreleased]

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

[Unreleased]: https://github.com/jrcesara7-bit/folderdocs/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/jrcesara7-bit/folderdocs/releases/tag/v1.0.0

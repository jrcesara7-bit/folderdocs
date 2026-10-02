# folderdocs

> [!NOTE]
> This site is the template's demo and its documentation at the same time. Every page is a plain `.md` file inside `docs/`: there is no HTML to write or maintain.

You write Markdown and create folders; folderdocs turns them into a fast, static documentation site: sidebar menu, search, breadcrumbs, light and dark themes, admonitions and syntax highlighting. Every page is its own HTML file with a clean URL, so search engines can index it, and it works on any static hosting.

Pick the tile that best describes your situation:

<div class="tiles">
  <a class="tile green" href="get-started/01-installation.md">I want to use the template.<br><strong>Install it and run it locally.</strong></a>
  <a class="tile teal" href="guide/01-organize-content.md">I want to write content.<br><strong>Folders, menu and Markdown.</strong></a>
  <a class="tile blue" href="customize/01-configuration.md">I want it to look like my project.<br><strong>Name, logo, colors and language.</strong></a>
  <a class="tile red" href="publish/01-github-pages.md">I want to publish it.<br><strong>GitHub Pages and other hosts.</strong></a>
</div>

## What's included

- **Automatic menu**: each folder is a section and each `.md` a page. No lists to maintain.
- **One HTML page per Markdown file**, with clean URLs, titles, descriptions, canonical links, a sitemap and breadcrumb data for search engines.
- **Readable without JavaScript**; the script only adds search, the theme switch, the mobile menu and copy buttons.
- **Search** in the sidebar (shortcut: `/`), built from an index generated at build time.
- **Light and dark themes**, remembered between visits, and a mobile-friendly layout.
- **Admonitions**, tables, highlighted code with a copy button, and relative links between pages that the build checks for you.
- **Multilingual**: one documentation folder per language, with a language switcher and `hreflang` links.

## Before you choose it

folderdocs generates static pages with one command (`npm run build`), and GitHub Pages runs it for you. Good URLs and metadata make your pages indexable, but they don't decide your ranking. Read [SEO and limitations](publish/03-seo-and-limitations.md) for what to expect, and the [comparison with other tools](about/01-why-this-template.md).

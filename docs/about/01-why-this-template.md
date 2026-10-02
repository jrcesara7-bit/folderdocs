---
id: why
description: How folderdocs compares with Docsify, MkDocs, Docusaurus and VitePress, and when each is the better choice.
---
# Why folderdocs

There are very good documentation tools. This one fills a specific space: **a presentable, search-engine-friendly documentation site made only of Markdown files and folders, with almost nothing to configure**.

## What it aims for

- Creating a page means creating a file; the menu and the URLs follow your folders.
- It can be read and modified entirely in an afternoon: the generator is a handful of small files in `tools/lib/`, plus one stylesheet and one short script.
- It looks polished from day one, with a style close to Read the Docs.
- It sends the browser finished HTML, so pages are fast and readable even without JavaScript.

## Comparison with other options

| | folderdocs | Docsify | MkDocs | Docusaurus / VitePress |
| --- | --- | --- | --- | --- |
| How pages are built | Static HTML at build time | In the browser | Static HTML at build time | Static HTML at build time |
| Needs installing | Node | Nothing (CDN) or npm | Python | Node + dependencies |
| Menu | Automatic from folders | Manual (`_sidebar.md`) | Automatic or manual | Automatic or manual |
| One HTML page per document (SEO) | Yes | No | Yes | Yes |
| Theme and plugin ecosystem | No | Yes | Very broad | Very broad |
| Versioned documentation | No | Limited | Yes | Yes |
| Multilingual | One folder per language, switcher included | Limited | Yes | Yes |
| Dependencies to install | None (libraries are bundled) | None | Several | Many |

The rows for the other tools are a general guide: check their documentation for current details.

## When to choose it

- You want a lightweight, readable generator with good defaults and no framework to learn.
- You want to understand and modify the code yourself.
- You want a clean starting point for a personal, team or small-project site.

## When not to

- You need documentation versions, a plugin ecosystem, or rich built-in components (tabs, diagrams, API playgrounds…). Look at MkDocs Material, Docusaurus or VitePress.
- You need search that scales to thousands of pages or tolerates typos.

## Credits

- [marked](https://github.com/markedjs/marked) (MIT) converts the Markdown.
- [highlight.js](https://highlightjs.org) (BSD-3-Clause) colors the code.
- The look is inspired by the Godot documentation and the Read the Docs theme. None of their graphic assets are used.

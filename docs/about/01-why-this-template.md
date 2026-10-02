# Why this template

There are very good documentation tools. This one fills a specific space: **having a presentable documentation site by writing only Markdown, without installing or building anything**.

## What it aims for

- Creating a page means creating a file.
- The menu is not maintained by hand.
- It can be read and modified entirely in an afternoon: there are three files of its own (`app.js`, `theme.css`, `build-nav.mjs`).
- It looks polished from day one, with a style close to Read the Docs.

## Comparison with other options

| | folderdocs | Docsify | MkDocs | Docusaurus / VitePress |
| --- | --- | --- | --- | --- |
| Build step | No | No | Yes | Yes |
| Needs installing | Node (only for the local server) | Nothing (CDN) or npm | Python | Node + dependencies |
| Menu | Automatic from folders | Manual (`_sidebar.md`) | Automatic or manual | Automatic or manual |
| One HTML page per document (SEO) | No | No | Yes | Yes |
| Theme and plugin ecosystem | No | Yes | Very broad | Very broad |
| Versioned / multilingual docs | No / one site per language | Limited | Yes | Yes |

The rows for the other tools are a general guide: check their documentation for current details.

## When to choose it

- You want the lightest possible solution and don't mind pages not being indexed one by one.
- You want to understand and modify the code without learning a framework.
- You want a clean starting point for a personal or team project.

## When not to

- Public documentation whose traffic depends on search engines.
- You need documentation versions, built-in translations or a plugin ecosystem.

## Credits

- [marked](https://github.com/markedjs/marked) (MIT) converts the Markdown.
- [highlight.js](https://highlightjs.org) (BSD-3-Clause) colors the code.
- The look is inspired by the Godot documentation and the Read the Docs theme. None of their graphic assets are used.

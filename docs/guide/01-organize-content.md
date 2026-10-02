---
id: organize
description: How folders, files, front matter and _meta.json define the menu, page titles, order and URLs in folderdocs.
---
# Organize content

The sidebar menu and the URLs are generated from the folders and files in `docs/`. There is no list to maintain.

| What you create | What shows up in the menu |
| --------------- | ------------------------- |
| A folder in `docs/` | A **section** (collapsible heading) |
| A subfolder inside a section | A collapsible group |
| A `.md` file | A page |
| `folder/index.md` | That folder's page (in a subfolder the group becomes clickable; in a section it appears as the first page) |
| `docs/index.md` | The home page (not in the menu) |
| Loose `.md` files in `docs/` | A "General" section (configurable with `rootSection`) |
| A folder with no `.md` files | Nothing: it is ignored, e.g. `img/` |

## Titles

For a **page**, in order of priority:

1. `title:` from the front matter.
2. The first `# …` heading in the file.
3. The file name, formatted.

For a **folder**: `title` from its `_meta.json`; if there is none and it is a subfolder with an `index.md`, that page's title; otherwise the folder name.

## Order

1. `order:` in the front matter (pages) or in `_meta.json` (folders).
2. A numeric prefix in the name: `01-install.md`, `02-usage.md`.
3. Alphabetical order.

```markdown
---
title: Installation
order: 1
---
```

```json
{ "title": "Getting started", "order": 2 }
```

## URLs

Each page is published at a clean URL built from its folders and file name:

| File | URL |
| ---- | --- |
| `docs/get-started/01-installation.md` | `/get-started/installation/` |
| `docs/guide/index.md` | `/guide/` |
| `docs/guía/Cómo empezar.md` | `/guia/como-empezar/` |

- The numeric ordering prefix is **dropped** from the URL, so you can reorder pages without changing their addresses.
- Names are lowercased, accents are removed and spaces become hyphens.
- If two pages would end up at the same URL, the build stops and tells you which ones.
- Other languages live under their own prefix, such as `/es/`.

> [!IMPORTANT]
> Renaming a file or folder changes its URL. Pick names you can live with before you publish and share links.

## When the menu updates

The menu is built together with the pages: `npm run dev` rebuilds it every time you save, and `npm run build` (run for you by GitHub Pages) rebuilds it on every deploy. There is no `nav.json` or other generated file to commit.

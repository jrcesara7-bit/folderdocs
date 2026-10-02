---
id: structure
description: What each folder and file in folderdocs does, and which ones you actually need to edit.
---
# Project structure

```text
.
├── docs/                    ← your documentation (the default language)
│   ├── config.json          site name, language, repository…
│   ├── index.md             home page
│   └── …folders with .md files
├── docs-es/                 Spanish version of the documentation
├── assets/
│   ├── css/theme.css        the theme (colors are variables)
│   ├── js/site.js           search, theme switch, mobile menu, copy buttons
│   └── img/                 favicon and social image
├── tools/
│   ├── build-site.mjs       builds the site into _site/
│   ├── serve.mjs            development server
│   ├── lib/                 the generator (Markdown, menu, page template)
│   └── vendor/              marked and highlight.js, used only at build time
├── tests/                   tests for the generator
└── _site/                   build output (not committed)
```

## What you touch every day

The `docs/` folder. The rest only changes if you want to alter behavior or design. If your site has a single language, you can delete `docs-es/`.

## What each file in `docs/` does

| File | Purpose |
| ---- | ------- |
| `config.json` | Site name, language, repository link… See [Configuration](../customize/01-configuration.md). |
| `index.md` | The home page. It does not appear in the menu. |
| `*/_meta.json` | Optional: title and order of a folder. |
| everything else | Pages (`.md`) and files they use, such as images. |

> [!NOTE]
> Files and folders whose name starts with `_` or `.` are ignored when the site is built. Use that for drafts.

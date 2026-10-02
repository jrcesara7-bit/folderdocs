---
id: install
description: Install folderdocs, the Markdown documentation template: clone it, run the local server and see your site in a minute.
---
# Installation

folderdocs is a folder of Markdown files plus a small build script. You need **Node.js 18 or later** to preview and build the site; the published result is plain static files, so your server doesn't need Node.

## Option A: use it as a GitHub template

1. Open the [repository](https://github.com/jrcesara7-bit/folderdocs) and click **Use this template** → **Create a new repository**.
2. Clone your copy:

```bash
git clone https://github.com/YOUR-USER/YOUR-REPO.git
cd YOUR-REPO
```

## Option B: clone and start from scratch

```bash
git clone https://github.com/jrcesara7-bit/folderdocs.git my-docs
cd my-docs
rm -rf .git && git init
```

## View the site locally

```bash
npm run dev        # or: node tools/serve.mjs
```

Open <http://localhost:8000>. The server builds the site in memory and rebuilds it whenever you save a file, so refresh the browser to see your changes.

> [!WARNING]
> Don't open the generated HTML files by double-clicking them (`file://`): links between pages won't resolve. Always use `npm run dev` to preview and `npm run build` to produce the files you publish.

> [!TIP]
> Change the port like this: `node tools/serve.mjs 3000`.

Next step: [the project structure](02-project-structure.md).

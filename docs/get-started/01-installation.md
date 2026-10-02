# Installation

The template is a folder of static files. You only need **Node.js 18 or later** for the development server, which also regenerates the menu. Publishing does not require Node on the server.

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

Open <http://localhost:8000>. Every time you reload, the menu is regenerated from the folders in `docs/`.

> [!WARNING]
> Don't open `index.html` by double-clicking it. Browsers block reading local files (`file://`) and you would see an error. Always use the local server.

> [!TIP]
> Change the port like this: `node tools/serve.mjs 3000`.

Next step: [the project structure](02-project-structure.md).

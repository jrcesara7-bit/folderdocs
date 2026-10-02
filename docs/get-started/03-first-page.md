---
id: first-page
description: Create your first documentation page and your first menu section by adding Markdown files.
---
# Your first page

1. Create the file `docs/guide/hello.md`:

```markdown
---
description: My first documentation page.
---
# Hello, world

Welcome to my documentation.

> [!TIP]
> Admonitions use GitHub's syntax.
```

2. Save it and refresh the browser. It shows up in the menu under **Guide**, titled after the first `# Heading`, and lives at `/guide/hello/`.

You didn't edit any list or any HTML: the menu is generated from what is in `docs/`.

## A new section

Create a folder with at least one `.md` file:

```text
docs/api/
├── index.md              ← the section's first page, at /api/
└── authentication.md     ← at /api/authentication/
```

It appears as the **Api** section. To call it "API" or set its position, add `docs/api/_meta.json`:

```json
{ "title": "API", "order": 6 }
```

## A custom title, description and order

With *front matter* at the top of the file:

```markdown
---
title: Getting started
description: A short summary that search engines show under the title.
order: 1
---
# Content…
```

More details in [Organize content](../guide/01-organize-content.md).

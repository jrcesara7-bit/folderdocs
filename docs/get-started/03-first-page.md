# Your first page

1. Create the file `docs/guide/hello.md`:

```markdown
# Hello, world

My first documentation page.

> [!TIP]
> Admonitions use GitHub's syntax.
```

2. Save and reload the browser. It shows up in the menu under **Guide**, titled after the first `# Heading`.

You didn't edit any list or any HTML: the menu is generated from what is in `docs/`.

## A new section

Create a folder with at least one `.md` file:

```text
docs/api/
├── index.md              ← the section's first page
└── authentication.md
```

It appears as the **Api** section. To call it "API" or set its position, add `docs/api/_meta.json`:

```json
{ "title": "API", "order": 6 }
```

## A custom title and order

Using *front matter* at the top of the file:

```markdown
---
title: Getting started
order: 1
---
# Content…
```

More details in [Organize content](../guide/01-organize-content.md).

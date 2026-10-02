---
id: tiles
description: Build a home page with colored tiles that guide each type of reader to the right section of your documentation.
---
# Home page and tiles

The home page is `docs/index.md`. It is a regular page, but it supports **colored tiles** to guide each kind of reader.

```html
<div class="tiles">
  <a class="tile green" href="../get-started/01-installation.md">I've never used it.<br><strong>I want to start.</strong></a>
  <a class="tile teal"  href="../guide/01-organize-content.md">I installed it.<br><strong>I want to write.</strong></a>
  <a class="tile blue"  href="../customize/01-configuration.md">I use it daily.<br><strong>I want to customize it.</strong></a>
  <a class="tile red"   href="../publish/01-github-pages.md">It's ready.<br><strong>I want to publish it.</strong></a>
</div>
```

<div class="tiles">
  <a class="tile green" href="../get-started/01-installation.md">I've never used it.<br><strong>I want to start.</strong></a>
  <a class="tile teal"  href="../guide/01-organize-content.md">I installed it.<br><strong>I want to write.</strong></a>
  <a class="tile blue"  href="../customize/01-configuration.md">I use it daily.<br><strong>I want to customize it.</strong></a>
  <a class="tile red"   href="../publish/01-github-pages.md">It's ready.<br><strong>I want to publish it.</strong></a>
</div>

## Rules

- Available colors: `green` (default), `teal`, `blue` and `red`. They are defined in `assets/css/theme.css`.
- The paths above are written for a page inside `docs/guide/`; in `docs/index.md` drop the leading `../`.
- The `href` of a tile is a relative path to a `.md` file, just like a Markdown link. The build turns it into the page's URL, and warns you if the file doesn't exist.
- On narrow screens the tiles collapse into a single column.
- Inside an HTML block, Markdown is **not** interpreted: use `<strong>` and `<br>`, not `**` or line breaks.

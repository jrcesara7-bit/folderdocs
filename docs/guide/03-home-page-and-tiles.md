# Home page and tiles

The home page is `docs/index.md`. It is a regular page, but it supports **colored tiles** to guide each kind of reader.

```html
<div class="tiles">
  <a class="tile green" href="#/get-started/01-installation">I've never used it.<br><strong>I want to start.</strong></a>
  <a class="tile teal"  href="#/guide/01-organize-content">I installed it.<br><strong>I want to write.</strong></a>
  <a class="tile blue"  href="#/customize/01-configuration">I use it daily.<br><strong>I want to customize it.</strong></a>
  <a class="tile red"   href="#/publish/01-github-pages">It's ready.<br><strong>I want to publish it.</strong></a>
</div>
```

<div class="tiles">
  <a class="tile green" href="#/get-started/01-installation">I've never used it.<br><strong>I want to start.</strong></a>
  <a class="tile teal"  href="#/guide/01-organize-content">I installed it.<br><strong>I want to write.</strong></a>
  <a class="tile blue"  href="#/customize/01-configuration">I use it daily.<br><strong>I want to customize it.</strong></a>
  <a class="tile red"   href="#/publish/01-github-pages">It's ready.<br><strong>I want to publish it.</strong></a>
</div>

## Rules

- Available colors: `green` (default), `teal`, `blue` and `red`. They are defined in `assets/css/theme.css`.
- In hand-written HTML, internal links use the form `#/path/without/extension` (the same one you see in the address bar).
- On narrow screens the tiles collapse into a single column.
- Inside an HTML block, Markdown is **not** interpreted: use `<strong>` and `<br>`, not `**` or line breaks.

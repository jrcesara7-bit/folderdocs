---
id: theme
description: Change the colors, accent, tiles, code highlighting and typography of your documentation site with CSS variables.
---
# Theme and colors

The whole design is in `assets/css/theme.css`, and the colors are CSS variables at the top of the file. You don't need to touch any other rule to change the palette.

## Main variables

```css
:root,
:root[data-theme="dark"] {
  --bg-page: #1c1e20;       /* outer background */
  --bg-sidebar: #25282c;    /* sidebar */
  --bg-content: #2c3034;    /* content column */
  --text: #d8dbde;
  --accent: #ff5d7d;        /* menu section titles */
  --link: #62b4f5;
}
```

The light theme is defined in the `:root[data-theme="light"]` block, with the same variables.

## Change the accent color

Replace `--accent` in both themes. It affects section titles, the active menu item, the logo square and the search matches.

## Home page tiles

The variables `--tile-green`, `--tile-teal`, `--tile-blue` and `--tile-red` define the four colors. To add a new one:

```css
:root { --tile-orange: #b45309; }
.doc .tile.orange { background: var(--tile-orange); }
```

## Admonition colors

Each type has three variables (`--note-bg`, `--note-head`, `--note-text`, and the same for `tip`, `important`, `warning` and `caution`).

## Code highlighting

Controlled by the `--hl-*` variables (comments, keywords, strings, numbers…), one palette per theme.

## Initial theme

The default theme is dark. To start in light, change `data-theme="dark"` to `data-theme="light"` in the `<html>` tag produced by `tools/lib/template.mjs`. The visitor's choice is saved in their browser and takes priority.

## Width and typography

The site's maximum width is `max-width: 1310px` on `.layout`. Typography uses system fonts (nothing is downloaded); change it in the `body` rule.

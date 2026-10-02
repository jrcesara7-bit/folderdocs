---
id: faq
description: Answers to common questions about folderdocs: menu, page URLs, hiding pages, logos, languages, printing and SEO.
---
# Frequently asked questions

## Why do links break when I open the HTML files directly?

Pages link to each other by folder (`../guide/intro/`), which browsers can't resolve from `file://`. Use `npm run dev` to preview, or serve `_site/` with any static server after `npm run build`.

## Why doesn't my new page show up in the menu?

Check that:

- the file ends in `.md` and is inside `docs/`;
- neither the file nor any folder along its path starts with `_` or `.`;
- you refreshed the `npm run dev` page after saving.

## Why is a page's URL different from its file name?

URLs are cleaned up: the numeric prefix (`01-`) is dropped and names are lowercased without accents. `docs/get-started/01-installation.md` is published at `/get-started/installation/`. See [Organize content](../guide/01-organize-content.md).

## Can I change the order of the sections?

Yes: `order` in each folder's `_meta.json`. See [Organize content](../guide/01-organize-content.md).

## How do I hide a page?

Rename the file with a leading underscore (`_draft.md`) or move it to a folder that starts with `_`. It won't be built, so it won't appear in the menu, in search or in the sitemap.

## How do I set the site address for the sitemap?

On GitHub Pages it is detected automatically. For a custom domain or another host, set `site.url` in `docs/config.json` or the `SITE_URL` environment variable. See [Configuration](../customize/01-configuration.md#the-site-url).

## Can I use my own logo?

Yes: copy the image to `assets/img/` and put its path in `logo` inside `docs/config.json`.

## Does it work on mobile?

Yes. On narrow screens the menu becomes a side panel opened with the ☰ button.

## Can I print or export to PDF?

Use the browser's print function: the stylesheet hides the menu and controls when printing. The page you are viewing is what gets printed.

## Can I have the documentation in more than one language?

Yes, with one folder per language and a language switcher. See [Languages](../customize/03-languages.md).

## Where do I report a problem or suggest an improvement?

In the repository's [issues](https://github.com/jrcesara7-bit/folderdocs/issues). The contribution guide is in `CONTRIBUTING.md`.

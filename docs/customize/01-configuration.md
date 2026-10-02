---
id: configuration
description: All the settings of folderdocs: site title, language, repository link, logo, site URL, SEO description and front matter fields.
---
# Configuration

The site settings live in `docs/config.json`, under the `site` key:

```json
{
  "site": {
    "title": "My Project",
    "subtitle": "Official documentation",
    "description": "Documentation for My Project: guides, reference and examples.",
    "footer": "© 2026 My Project",
    "version": "v1.0",
    "lang": "en",
    "url": "https://docs.example.com",
    "repo": "user/repository",
    "branch": "main",
    "contributeUrl": "",
    "logo": "assets/img/logo.svg",
    "image": "assets/img/social-preview.png",
    "rootSection": "General"
  }
}
```

| Key | What it does |
| --- | ------------ |
| `title` | Site name: sidebar header, page titles (`Page · My Project`) and top bar on mobile. |
| `subtitle` | Bold text above the breadcrumbs. Also part of the home page's `<title>`. |
| `description` | Meta description of the home page (search engines and social previews). Other pages use their own `description:` or their first paragraph. |
| `footer` | Page footer. |
| `version` | Label in the bottom corner of the sidebar. Leave it empty to hide it. |
| `lang` | Language of the interface and of the `<html lang>` attribute: `en` or `es`. See [Languages](03-languages.md). |
| `langLabel` | Text of this language in the language switcher. Defaults to the first two letters of `lang`, uppercase. |
| `url` | Public address of the site, without trailing slash. Needed for canonical links, the sitemap and social previews. See below. |
| `repo` | `user/repository`. Enables the "Edit on GitHub" link on every page. Empty = no link. |
| `branch` | Branch used in that link. Defaults to `main`. |
| `contributeUrl` | If not empty, shows a second link under "Edit" (for example, your contribution guide). |
| `logo` | Path to an image for the sidebar, relative to the site root. Without it, the first letter of the title is shown on a colored square. |
| `image` | Image used for social previews (Open Graph). Defaults to `assets/img/social-preview.png`; 1200×630 works best. |
| `rootSection` | Name of the section that groups loose `.md` files at the root of `docs/`. |

## The site URL

Canonical links, `og:url`, the sitemap and `hreflang` tags need the absolute address of your site. folderdocs finds it in this order:

1. The `SITE_URL` environment variable.
2. `site.url` in the **default** language's `config.json` (`docs/config.json`).
3. Automatically on GitHub Actions: `https://USER.github.io/REPO` (or `https://USER.github.io` for a `USER.github.io` repository).

If none applies (for example in a local build), those tags are simply left out. **Set `site.url` if you use a custom domain**, because the automatic value points to `github.io`.

## Page front matter

Every `.md` file can start with a front matter block:

| Field | Purpose |
| ----- | ------- |
| `title` | Page title in the menu, the heading list and `<title>`. |
| `description` | Meta description. Defaults to the first paragraph, shortened to 160 characters. |
| `order` | Position among its siblings. |
| `id` | Links this page with its translation in another language (same `id` = same page). |
| `seoTitle` | Overrides the full `<title>` tag, if you want something different from `Title · Site`. |

## Everything else is generated

There is no `index.html` to edit: titles, descriptions, Open Graph tags, the favicon link and the sitemap are produced for every page at build time. To change the favicon, replace `assets/img/favicon.svg`; to change the page template, edit `tools/lib/template.mjs`.

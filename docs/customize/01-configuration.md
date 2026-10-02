# Configuration

The site settings live in `docs/config.json`, under the `site` key:

```json
{
  "site": {
    "title": "My Project",
    "subtitle": "Official documentation",
    "footer": "© 2026 My Project",
    "version": "v1.0",
    "lang": "en",
    "languages": [
      { "label": "EN", "href": "./" },
      { "label": "ES", "href": "es/" }
    ],
    "home": "index",
    "repo": "user/repository",
    "branch": "main",
    "contributeUrl": "",
    "logo": "assets/img/logo.svg",
    "rootSection": "General"
  }
}
```

| Key | What it does |
| --- | ------------ |
| `title` | Site name: sidebar header, browser tab and top bar on mobile. |
| `subtitle` | Bold text above the breadcrumbs. |
| `footer` | Page footer. |
| `version` | Label in the bottom corner of the sidebar. Leave it empty to hide it. |
| `lang` | Interface language: `en` or `es`. See [Languages](03-languages.md). |
| `languages` | Optional list of `{ "label", "href" }` that shows a language switcher. `href` is relative to the page's `index.html`. |
| `home` | Home page file, without extension. Defaults to `index`. |
| `repo` | `user/repository`. Enables the "Edit on GitHub" link on every page. Empty = no link. |
| `branch` | Branch used in that link. Defaults to `main`. |
| `contributeUrl` | If not empty, shows a second link under "Edit" (for example, your contribution guide). |
| `logo` | Path to an image for the sidebar. Without it, the first letter of the title is shown on a colored square. |
| `rootSection` | Name of the section that groups loose `.md` files at the root of `docs/`. |

## Outside `config.json`

Four things live in `index.html` and not in the configuration, because search engines and social networks read them **before** running JavaScript:

- `<title>` and `<meta name="description">`.
- The `og:` and `twitter:` tags (the preview shown when you share the link).
- `og:url` and `og:image`, which must be absolute URLs of your published site.
- The favicon, at `assets/img/favicon.svg`.

> [!IMPORTANT]
> Change them before publishing. Otherwise your site will announce itself with the template's name and URL.

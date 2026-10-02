# Other hosts

The result is a static site: any hosting that can serve files will do.

## Build the site

```bash
npm run build
```

This regenerates every `nav.json` and leaves a ready-to-upload copy of the site in `_site/`.

## Netlify, Cloudflare Pages, Vercel

| Field | Value |
| ----- | ----- |
| Build command | `npm run build` |
| Output / publish directory | `_site` |

## Your own server (nginx, Apache…)

Copy the contents of `_site/` to the public folder. No rewrite rules are needed, because the template's routes come after the `#`.

## Subfolders

The site can be hosted in a subfolder (`https://example.com/docs/`) without changes: every path is relative.

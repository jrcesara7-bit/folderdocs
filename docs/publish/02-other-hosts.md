---
id: other-hosts
description: Build the static site with one command and host it on Netlify, Cloudflare Pages, Vercel, nginx or any static server.
---
# Other hosts

The result is a static site: any hosting that can serve files will do.

## Build the site

```bash
npm run build
```

This leaves a ready-to-upload copy of the site in `_site/`. Add `--strict` to fail on broken links, and `--out <dir>` to write somewhere else.

## Set the site URL

For canonical links, the sitemap and social previews, tell the build where the site will live:

```bash
SITE_URL=https://docs.example.com npm run build
```

or set `site.url` in `docs/config.json`.

## Netlify, Cloudflare Pages, Vercel

| Field | Value |
| ----- | ----- |
| Build command | `npm run build` |
| Output / publish directory | `_site` |
| Environment variable | `SITE_URL` = your public address (optional) |
| Node version | 18 or later |

## Your own server (nginx, Apache…)

Copy the contents of `_site/` to the public folder. Pages are `folder/index.html`, so the usual "serve index.html for a directory" rule is all you need. Use `404.html` as your error page.

## Subfolders

The site can be hosted in a subfolder (`https://example.com/docs/`) without changes: every link is relative.

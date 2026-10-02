---
id: github-pages
description: Publish your folderdocs site on GitHub Pages with the included workflow, a custom domain and the right site URL.
---
# GitHub Pages

The repository includes the workflow `.github/workflows/pages.yml`, which builds the site and publishes it on every push to `main`.

## Enable it

1. Push your repository to GitHub with a `main` branch.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow by hand from the **Actions** tab).

Your site will be at `https://YOUR-USER.github.io/YOUR-REPO/`.

## Before publishing

- In `docs/config.json`: `title`, `subtitle`, `description`, `repo` and `branch`.
- Replace `assets/img/social-preview.png` with your own social image (1200×630 recommended).
- Replace `assets/img/favicon.svg` with your icon.

> [!NOTE]
> The workflow detects your site URL automatically (`https://YOUR-USER.github.io/YOUR-REPO`), so canonical links and the sitemap are correct without any setup. With a custom domain, set `site.url` as explained below.

## Custom domain

1. Under **Settings → Pages → Custom domain** enter your domain and create the DNS record GitHub tells you.
2. Set `"url": "https://your-domain.com"` in `docs/config.json`, so canonical links and the sitemap use it.

## What the workflow does

It runs `npm run build -- --strict`, which regenerates every page and **stops with an error if a link points to a page or file that doesn't exist**. Then it publishes `_site/`, which contains only what a browser needs: the pages, `assets/`, the images of your docs, the sitemap and `404.html`. The tools, tests and the rest of the repository are not published.

> [!TIP]
> If something fails, open the **Actions** tab and check the log of the "Deploy to GitHub Pages" workflow. Broken links are listed there with the file that contains them.

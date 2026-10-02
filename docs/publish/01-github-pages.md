# GitHub Pages

The repository includes the workflow `.github/workflows/pages.yml`, which builds the site and publishes it on every push to `main`.

## Enable it

1. Push your repository to GitHub with a `main` branch.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow by hand from the **Actions** tab).

Your site will be at `https://YOUR-USER.github.io/YOUR-REPO/`.

## Before publishing

- In `docs/config.json`: `repo` and `branch`.
- In `index.html`: `<title>`, description and the URL of the `og:` tags.
- Replace `assets/img/social-preview.png` with your own social image (1200×630 recommended).

> [!NOTE]
> The site uses relative paths and `#/` routes, so it works the same at `user.github.io/repo/` as on a custom domain, with no extra configuration.

## Custom domain

Under **Settings → Pages → Custom domain** enter your domain and create the DNS record GitHub tells you. Then update `og:url` and `og:image`.

## What gets published

The workflow runs `npm run build`, which regenerates every menu and copies only what is needed into `_site/`: `index.html`, `assets/`, every documentation folder and each language's entry page. Tools, tests and the rest of the repository are not published.

> [!TIP]
> If something fails, open the **Actions** tab and check the log of the "Deploy to GitHub Pages" workflow.

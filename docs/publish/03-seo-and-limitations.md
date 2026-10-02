---
id: seo
description: How folderdocs helps your documentation rank: one HTML page per Markdown file, canonical URLs, sitemap, and honest expectations.
---
# SEO and limitations

## What the build does for search engines

Every Markdown file becomes its own complete HTML page, so crawlers see your content without running any JavaScript. For each page folderdocs generates:

- a **clean, stable URL** (`/guide/markdown-syntax/`);
- a `<title>` (`Page · Site`) and a **meta description**, from the front matter or the first paragraph;
- a **canonical link** and **Open Graph / Twitter** tags for good link previews;
- **breadcrumb structured data** (JSON-LD) matching the visible breadcrumbs;
- `hreflang` links between translations (see [Languages](../customize/03-languages.md));
- a **`sitemap.xml`** and **`robots.txt`**, and a `404.html` marked `noindex`;
- descriptive image `alt` text, heading anchors and a "skip to content" link.

The canonical links, the sitemap and `og:url` need your [site URL](../customize/01-configuration.md), which GitHub Pages deployments detect automatically.

## What you should do

- Give every page a clear title and, for the important ones, a hand-written `description:`.
- Write real `alt` text for images.
- Set `site.url` if you use a custom domain.
- Submit `https://your-site/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster Tools.
- Link to your documentation from your README, your project's website and other places people visit.

> [!IMPORTANT]
> Good URLs and metadata make your pages **indexable**; they don't decide where you rank. Ranking depends on the quality of your content, links from other sites and how long the site has existed. Expect it to take weeks for new pages to show up.

## Other limitations

- **It needs a build step.** Previewing and publishing use Node (`npm run dev`, `npm run build`); GitHub Pages runs it for you. Your server only receives static files.
- **Search is plain text.** It runs in the browser on an index generated at build time, with no fuzzy matching or semantic ranking. It does need JavaScript; everything else works without it.
- **No documentation versioning.** Languages are supported through one folder per language.
- **HTML in `.md` files is not filtered.** Only publish content you trust.
- **The search index holds the text of every page** (the first 20,000 characters of each). That is fine for hundreds of pages; for a very large site, use a dedicated search service.

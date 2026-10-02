# SEO and limitations

Worth knowing before you choose this template.

## How content is delivered

The browser downloads `index.html`, and a script reads the `.md` of the requested page and turns it into HTML. Each page's address uses a fragment (`#/guide/02-markdown-syntax`).

## What it means for search engines

> [!WARNING]
> Search engines treat everything after `#` as the same URL. To them, the site is **a single page**, so the pages of your documentation are not indexed or shown separately in results.

What does work:

- The home page is indexed with the title and description from `index.html`.
- Sharing links on social networks shows the preview from `og:title`, `og:description` and `og:image` (the whole site's, not each page's).
- Inside the site, the sidebar search finds any page.

## When it is a good fit

- Documentation for a project or library that people reach from the README or the repository.
- Internal, team or product manuals.
- Notes, personal guides and small wikis.
- Documentation prototypes you may migrate later.

## When to choose another tool

If you need **each page** to show up on Google (public documentation that earns organic traffic), use a generator that outputs one HTML file per page: MkDocs, Docusaurus, VitePress, Astro Starlight… Your `.md` files carry over almost unchanged.

## Other limitations

- Requires JavaScript.
- The home page (`index.md`) is not included in search.
- No documentation versioning. Languages work as one site per language (see [Languages](../customize/03-languages.md)).
- Search is plain text: no fuzzy matching and no ranking by semantic relevance.
- HTML in `.md` files is not filtered: it is not suitable for receiving content from unknown users.

---
id: links
description: Link between pages, add images and downloadable files with relative paths that also work on GitHub.
---
# Links and images

## Links between pages

Write paths relative to the current file, including the `.md` extension. That way they also work when you browse the files on GitHub:

```markdown
[Installation](../get-started/01-installation.md)
[A section of this page](#images)
[A section of another page](02-markdown-syntax.md#admonitions)
```

[Example: go to the syntax page](02-markdown-syntax.md#admonitions).

A link to a folder that has an `index.md` (for example `../api/`) opens that page.

> [!TIP]
> The build checks every internal link. A link to a page or file that doesn't exist is listed as a warning, and `npm run build -- --strict` (used by the GitHub Pages workflow) stops with an error instead of publishing a broken link.

## External links

Links to other sites open in a new tab and carry a small icon: [Markdown on MDN](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Writing_a_simple_page_in_HTML).

## Images

Keep images inside `docs/` (for example `docs/img/`) and reference them with a path relative to the `.md` file:

```markdown
![Description of the image](../img/screenshot.png)
```

Images are copied to the site and load lazily. They never overflow the column.

> [!TIP]
> Always write the alt text: it helps accessibility and search engines, and is shown if the image fails to load.

## Files to download

A relative link to a file that isn't `.md` (for example a PDF) points to the copied file:

```markdown
[Download the manual](../files/manual.pdf)
```

## Heading anchors

Every heading gets an automatic identifier (lowercase, accents removed, hyphens). Hover over a title and a `¶` appears so you can copy the direct link to that section.

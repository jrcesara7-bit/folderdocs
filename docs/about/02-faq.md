# Frequently asked questions

## Why do I get an error when I open `index.html`?

Browsers block `fetch` on `file://`. Use `npm run dev` (or `node tools/serve.mjs`) and open <http://localhost:8000>.

## Why doesn't my new page show up in the menu?

Check that:

- the file ends in `.md` and is inside `docs/`;
- neither the file nor any folder along its path starts with `_` or `.`;
- you reloaded with the `npm run dev` server, or ran `npm run nav` if you use another server.

## Can I change the order of the sections?

Yes: `order` in each folder's `_meta.json`. See [Organize content](../guide/01-organize-content.md).

## How do I hide a page?

Rename the file with a leading underscore (`_draft.md`) or move it to a folder that starts with `_`. It won't appear in the menu or in search, although it will still be reachable if someone knows the exact address.

## Can I use my own logo?

Yes: copy the image to `assets/img/` and put its path in `logo` inside `docs/config.json`.

## Does it work on mobile?

Yes. On narrow screens the menu becomes a side panel opened with the ☰ button.

## Can I print or export to PDF?

Use the browser's print function: the stylesheet hides the menu and controls when printing. The page you are viewing is what gets printed.

## Can I have the documentation in more than one language?

Yes, as one site per language with a language switcher. See [Languages](../customize/03-languages.md).

## Where do I report a problem or suggest an improvement?

In the repository's [issues](https://github.com/jrcesara7-bit/folderdocs/issues). The contribution guide is in `CONTRIBUTING.md`.

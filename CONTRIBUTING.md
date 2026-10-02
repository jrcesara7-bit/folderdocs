# Contributing

Thanks for wanting to improve folderdocs. Small, focused contributions are the easiest to review.

*[Leer en español](.github/es/CONTRIBUTING.md)*

## Before you start

- For usage questions, use [Discussions](https://github.com/jrcesara7-bit/folderdocs/discussions).
- For bugs and proposals, open an [issue](https://github.com/jrcesara7-bit/folderdocs/issues/new/choose) and describe the case. If the change is big, talk about it first, before writing code.
- This is a small project maintained in spare time: replies may take a while.

## Project principles

A proposal fits best if it respects these:

1. **No build step** for people who use the template.
2. **No new runtime dependencies.** `marked` and `highlight.js` are the only ones, and they live in `assets/vendor/`.
3. **Few moving parts of its own**: `app.js`, `theme.css`, and the scripts in `tools/` should be readable end to end.
4. **Colors go in variables** in `theme.css`, for both themes.

## Set up your environment

You need Node.js 18 or later.

```bash
git clone https://github.com/YOUR-USER/folderdocs.git
cd folderdocs
npm run dev        # http://localhost:8000
npm test
```

## Submit a change

1. Create a branch from `main`: `git checkout -b my-change`.
2. Make the change, with tests if it touches `tools/`.
3. If you changed `docs/` or `docs-es/`, run `npm run nav` and commit the `nav.json` files.
4. Try it in the browser, in dark and light themes, and at mobile width if the change is visual.
5. Add a line to `CHANGELOG.md` under `[Unreleased]`.
6. Open the pull request and fill in the template.

## Documentation in two languages

English (`docs/`) is the main version and Spanish (`docs-es/`) is its translation. If you change a page, update the other language too, or mention in the pull request that the translation is pending.

## Style

- Plain JavaScript, no transpilation and no dependencies: ES modules in `tools/` and an IIFE in `assets/js/app.js`.
- Follow `.editorconfig` (UTF-8, LF, 2 spaces).
- Comments explain *why*, not *what*.
- Commit messages in the imperative and specific: "Fix folder order with numeric prefixes".

## Bundled dependencies

To update `marked` or `highlight.js`, replace the file in `assets/vendor/` with the new version from its official package, check that the demo still works, and note the version in the commit.

## License

By contributing you agree that your work is published under the project's [MIT](LICENSE) license.

# Security policy

*[Leer en español](.github/es/SECURITY.md)*

## Reporting a vulnerability

Please don't open a public issue. Use GitHub's private advisory:
**Security → Report a vulnerability** in this repository.

I'll try to reply within a few days. This is a project maintained by one person, so there are no guaranteed timelines, but reports are handled with priority.

## What is in scope

- Code execution or HTML/JavaScript injection caused by the template itself (`assets/js/app.js`, `tools/`).
- Reading files outside the project in `tools/serve.mjs`.

## Out of scope

- The HTML you write inside your own `.md` files is inserted unfiltered **by design** (the home page tiles need it). Only publish content you trust, and review changes from outside contributors.
- `tools/serve.mjs` is a **development** server: don't expose it to the Internet.
- Vulnerabilities in `marked` or `highlight.js` (copied into `assets/vendor/`): report them to those projects. If they affect folderdocs, let me know so I can update the bundled copy.

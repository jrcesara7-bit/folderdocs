# Languages

There are two separate things: the **interface language** and the **content language**.

## Interface language

The interface (search box, buttons, admonition titles, error messages) is available in English and Spanish. Set it in `docs/config.json`:

```json
{ "site": { "lang": "es" } }
```

The document's `lang` attribute is adjusted as well. If the language doesn't exist, English is used.

> [!NOTE]
> The interface language is independent of your content: your `.md` files can be in any language.

## Add another interface language

The strings are in the `I18N` object at the top of `assets/js/app.js`. Copy the `en` block, change its code and translate the values:

```js
const I18N = {
  en: { /* … */ },
  es: { /* … */ },
  fr: { search: 'Rechercher dans la documentation', /* … */ },
};
```

Any key missing in your language is shown in English, so you can translate progressively.

## A site in several languages

This repository publishes **English at the root and Spanish under `/es/`**, and you can do the same:

1. Keep one documentation folder per language: `docs/` (English) and `docs-es/` (Spanish). Each has its own `config.json`, `nav.json` and pages.
2. Add an entry page per extra language: `es/index.html`, a copy of `index.html` that points to the other folder through the `data-docs` attribute:

```html
<html lang="es" data-theme="dark" data-docs="../docs-es">
```

   Adjust the asset paths in that copy (`../assets/…`).
3. Add the `languages` list to each `config.json` so a switcher appears in the sidebar footer. The `href` values are relative to each language's `index.html`:

```json
// docs/config.json (English, served at /)
"languages": [{ "label": "EN", "href": "./" }, { "label": "ES", "href": "es/" }]

// docs-es/config.json (Spanish, served at /es/)
"languages": [{ "label": "EN", "href": "../" }, { "label": "ES", "href": "./" }]
```

4. The build tools find every folder named `docs` or `docs-*` and every language entry folder, so `npm run dev`, `npm run nav` and `npm run build` handle all languages without extra setup.

> [!TIP]
> To add French, create `docs-fr/` and `fr/index.html` the same way. To remove a language, delete its two folders and its entry in `languages`.

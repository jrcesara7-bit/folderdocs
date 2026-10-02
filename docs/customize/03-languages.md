---
id: languages
description: Publish your documentation in several languages with a language switcher, translation links and hreflang tags.
---
# Languages

There are two separate things: the **interface language** and the **content language**.

## Interface language

The interface (search box, buttons, admonition titles, "Edit on GitHub") is available in English and Spanish. Set it in the language's `config.json`:

```json
{ "site": { "lang": "es" } }
```

The page's `lang` attribute is set as well. If the language doesn't exist, English is used.

> [!NOTE]
> The interface language is independent of your content: your `.md` files can be in any language.

## Add another interface language

The strings are in `tools/lib/i18n.mjs`. Copy the `en` block, change its code and translate the values:

```js
export const I18N = {
  en: { /* … */ },
  es: { /* … */ },
  fr: { search: 'Rechercher dans la documentation', /* … */ },
};
```

Any key missing in your language is shown in English, so you can translate progressively.

## A site in several languages

This repository publishes **English at the root and Spanish under `/es/`**. The rule is simple:

| Folder | Published at |
| ------ | ------------ |
| `docs/` (default language) | `/` |
| `docs-es/` | `/es/` |
| `docs-fr/` | `/fr/` |

To add a language, create `docs-xx/` with its own `config.json` (set `lang`) and `index.md`. That's all: the build finds it, and a language switcher appears in the sidebar footer. To remove a language, delete its folder.

### Link translated pages

By default the switcher sends visitors to the other language's home page. Give the same `id` in the front matter of the two versions of a page, and the switcher links them directly:

```markdown
---
id: installation
---
# Installation
```

Linked pages also get `<link rel="alternate" hreflang>` tags and are paired in the sitemap, which helps search engines show the right version to each visitor (this needs the [site URL](01-configuration.md)).

> [!TIP]
> Folder and file names can be translated (`/es/empezar/instalacion/`): pages are paired by `id`, not by path.

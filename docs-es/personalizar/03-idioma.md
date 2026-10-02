---
id: languages
description: Publica tu documentación en varios idiomas con selector de idioma, enlaces entre traducciones y etiquetas hreflang.
---
# Idioma

Hay dos cosas distintas: el **idioma de la interfaz** y el **idioma del contenido**.

## Idioma de la interfaz

La interfaz (buscador, botones, títulos de los avisos, «Editar en GitHub») está disponible en español e inglés. Se elige en el `config.json` de cada idioma:

```json
{ "site": { "lang": "en" } }
```

También se ajusta el atributo `lang` de la página. Si el idioma no existe, se usa inglés.

> [!NOTE]
> El idioma de la interfaz es independiente del contenido: tus `.md` pueden estar en cualquier idioma.

## Añadir otro idioma de interfaz

Los textos están en `tools/lib/i18n.mjs`. Copia el bloque `en`, cámbiale el código y traduce los valores:

```js
export const I18N = {
  en: { /* … */ },
  es: { /* … */ },
  fr: { search: 'Rechercher dans la documentation', /* … */ },
};
```

Cualquier clave que falte en tu idioma se muestra en inglés, así que puedes traducir de forma progresiva.

## Un sitio en varios idiomas

Este repositorio publica **el inglés en la raíz y el español bajo `/es/`**. La regla es sencilla:

| Carpeta | Se publica en |
| ------- | ------------- |
| `docs/` (idioma por defecto) | `/` |
| `docs-es/` | `/es/` |
| `docs-fr/` | `/fr/` |

Para añadir un idioma, crea `docs-xx/` con su propio `config.json` (define `lang`) y su `index.md`. Eso es todo: la compilación la encuentra y aparece un selector de idioma en el pie del menú. Para quitar un idioma, borra su carpeta.

### Enlazar páginas traducidas

Por defecto, el selector lleva a la portada del otro idioma. Si pones el mismo `id` en el front matter de las dos versiones de una página, el selector las enlaza directamente:

```markdown
---
id: instalacion
---
# Instalación
```

Las páginas enlazadas también reciben etiquetas `<link rel="alternate" hreflang>` y se emparejan en el sitemap, lo que ayuda a los buscadores a mostrar la versión correcta a cada visitante (esto necesita la [URL del sitio](01-configuracion.md)).

> [!TIP]
> Los nombres de carpetas y archivos pueden estar traducidos (`/es/empezar/instalacion/`): las páginas se emparejan por `id`, no por ruta.

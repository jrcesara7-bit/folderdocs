---
id: configuration
description: Todos los ajustes de folderdocs: título, idioma, enlace al repositorio, logo, URL del sitio, descripción SEO y campos del front matter.
---
# Configuración

Los datos del sitio están en el `config.json` de la carpeta de documentación, bajo la clave `site`:

```json
{
  "site": {
    "title": "Mi Proyecto",
    "subtitle": "Documentación oficial",
    "description": "Documentación de Mi Proyecto: guías, referencia y ejemplos.",
    "footer": "© 2026 Mi Proyecto",
    "version": "v1.0",
    "lang": "es",
    "url": "https://docs.ejemplo.com",
    "repo": "usuario/repositorio",
    "branch": "main",
    "contributeUrl": "",
    "logo": "assets/img/logo.svg",
    "image": "assets/img/social-preview.png",
    "rootSection": "General"
  }
}
```

| Clave | Qué hace |
| ----- | -------- |
| `title` | Nombre del sitio: cabecera del menú, títulos de página (`Página · Mi Proyecto`) y barra superior en móvil. |
| `subtitle` | Texto en negrita sobre las migas de pan. También forma parte del `<title>` de la portada. |
| `description` | Meta descripción de la portada (buscadores y vistas previas sociales). Las demás páginas usan su propio `description:` o su primer párrafo. |
| `footer` | Pie de página. |
| `version` | Etiqueta en la esquina inferior del menú. Déjala vacía para ocultarla. |
| `lang` | Idioma de la interfaz y del atributo `<html lang>`: `es` o `en`. Ver [Idioma](03-idioma.md). |
| `langLabel` | Texto de este idioma en el selector de idioma. Por defecto, las dos primeras letras de `lang` en mayúsculas. |
| `url` | Dirección pública del sitio, sin barra final. Hace falta para los enlaces canónicos, el sitemap y las vistas previas sociales. Ver más abajo. |
| `repo` | `usuario/repositorio`. Activa el enlace «Editar en GitHub» de cada página. Vacío = sin enlace. |
| `branch` | Rama usada en ese enlace. Por defecto `main`. |
| `contributeUrl` | Si no está vacío, muestra un segundo enlace bajo «Editar» (por ejemplo, tu guía de contribución). |
| `logo` | Ruta a una imagen para el menú, relativa a la raíz del sitio. Sin ella se muestra la inicial del título sobre un cuadro de color. |
| `image` | Imagen para las vistas previas sociales (Open Graph). Por defecto `assets/img/social-preview.png`; 1200×630 funciona mejor. |
| `rootSection` | Nombre de la sección que agrupa los `.md` sueltos en la raíz de `docs/`. |

## La URL del sitio

Los enlaces canónicos, `og:url`, el sitemap y las etiquetas `hreflang` necesitan la dirección absoluta de tu sitio. folderdocs la encuentra en este orden:

1. La variable de entorno `SITE_URL`.
2. `site.url` en el `config.json` del idioma **por defecto** (`docs/config.json`).
3. Automáticamente en GitHub Actions: `https://USUARIO.github.io/REPO` (o `https://USUARIO.github.io` para un repositorio `USUARIO.github.io`).

Si no se aplica ninguna (por ejemplo en una compilación local), esas etiquetas simplemente se omiten. **Define `site.url` si usas un dominio propio**, porque el valor automático apunta a `github.io`.

## Front matter de cada página

Cualquier archivo `.md` puede empezar con un bloque de front matter:

| Campo | Para qué sirve |
| ----- | -------------- |
| `title` | Título de la página en el menú, en las migas y en `<title>`. |
| `description` | Meta descripción. Por defecto, el primer párrafo recortado a 160 caracteres. |
| `order` | Posición entre sus hermanos. |
| `id` | Enlaza esta página con su traducción en otro idioma (mismo `id` = misma página). |
| `seoTitle` | Sustituye la etiqueta `<title>` completa, si quieres algo distinto de `Título · Sitio`. |

## Todo lo demás se genera

No hay ningún `index.html` que editar: títulos, descripciones, etiquetas Open Graph, el enlace al favicon y el sitemap se producen para cada página al compilar. Para cambiar el favicon, reemplaza `assets/img/favicon.svg`; para cambiar la plantilla de página, edita `tools/lib/template.mjs`.

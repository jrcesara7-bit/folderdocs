---
id: organize
description: Cómo las carpetas, los archivos, el front matter y _meta.json definen el menú, los títulos, el orden y las URL en folderdocs.
---
# Organizar el contenido

El menú lateral y las URL se generan a partir de las carpetas y archivos de `docs/`. No hay lista que mantener.

| Qué creas | Qué aparece en el menú |
| --------- | ---------------------- |
| Carpeta en `docs/` | Una **sección** (encabezado plegable) |
| Subcarpeta dentro de una sección | Un grupo desplegable |
| Archivo `.md` | Una página |
| `carpeta/index.md` | La página de esa carpeta (en una subcarpeta, el grupo se vuelve clicable; en una sección, aparece como primera página) |
| `docs/index.md` | La portada (no sale en el menú) |
| Archivos `.md` sueltos en `docs/` | Una sección «General» (configurable con `rootSection`) |
| Carpeta sin ningún `.md` | Nada: se ignora, por ejemplo `img/` |

## Títulos

Para una **página**, por orden de prioridad:

1. `title:` del front matter.
2. El primer encabezado `# …` del archivo.
3. El nombre del archivo, formateado.

Para una **carpeta**: `title` de su `_meta.json`; si no existe y es una subcarpeta con `index.md`, el título de esa página; si no, el nombre de la carpeta.

## Orden

1. `order:` en el front matter (páginas) o en `_meta.json` (carpetas).
2. Un prefijo numérico en el nombre: `01-instalacion.md`, `02-uso.md`.
3. Orden alfabético.

```markdown
---
title: Instalación
order: 1
---
```

```json
{ "title": "Primeros pasos", "order": 2 }
```

## URL

Cada página se publica en una URL limpia construida con sus carpetas y su nombre:

| Archivo | URL |
| ------- | --- |
| `docs/primeros-pasos/01-instalacion.md` | `/primeros-pasos/instalacion/` |
| `docs/guia/index.md` | `/guia/` |
| `docs/guía/Cómo empezar.md` | `/guia/como-empezar/` |

- El prefijo numérico de orden **se elimina** de la URL, así que puedes reordenar páginas sin cambiar sus direcciones.
- Los nombres se pasan a minúsculas, se quitan los acentos y los espacios se vuelven guiones.
- Si dos páginas acabaran en la misma URL, la compilación se detiene y te dice cuáles.
- Los demás idiomas viven bajo su propio prefijo, como `/es/`.

> [!IMPORTANT]
> Renombrar un archivo o una carpeta cambia su URL. Elige nombres con los que puedas vivir antes de publicar y compartir enlaces.

## Cuándo se actualiza el menú

El menú se construye junto con las páginas: `npm run dev` lo reconstruye cada vez que guardas, y `npm run build` (que GitHub Pages ejecuta por ti) lo reconstruye en cada despliegue. No hay `nav.json` ni otro archivo generado que subir.

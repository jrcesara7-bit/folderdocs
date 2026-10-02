# Otros hosts

El resultado es un sitio estático: sirve cualquier hosting capaz de entregar archivos.

## Construir el sitio

```bash
npm run build
```

Esto regenera todos los `nav.json` y deja en `_site/` una copia del sitio lista para subir.

## Netlify, Cloudflare Pages, Vercel

| Campo | Valor |
| ----- | ----- |
| Build command | `npm run build` |
| Output / publish directory | `_site` |

## Servidor propio (nginx, Apache…)

Copia el contenido de `_site/` a la carpeta pública. No necesita reglas de reescritura porque las rutas de la plantilla van tras `#`.

## Subcarpetas

Puede alojarse en una subcarpeta (`https://ejemplo.com/docs/`) sin cambios: todas las rutas son relativas.

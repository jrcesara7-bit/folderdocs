---
id: other-hosts
description: Construye el sitio estático con un comando y alójalo en Netlify, Cloudflare Pages, Vercel, nginx o cualquier servidor estático.
---
# Otros hosts

El resultado es un sitio estático: sirve cualquier hosting capaz de entregar archivos.

## Construir el sitio

```bash
npm run build
```

Esto deja en `_site/` una copia del sitio lista para subir. Añade `--strict` para fallar ante enlaces rotos, y `--out <carpeta>` para escribir en otro sitio.

## Indicar la URL del sitio

Para los enlaces canónicos, el sitemap y las vistas previas sociales, dile a la compilación dónde vivirá el sitio:

```bash
SITE_URL=https://docs.ejemplo.com npm run build
```

o define `site.url` en `docs/config.json`.

## Netlify, Cloudflare Pages, Vercel

| Campo | Valor |
| ----- | ----- |
| Build command | `npm run build` |
| Output / publish directory | `_site` |
| Variable de entorno | `SITE_URL` = tu dirección pública (opcional) |
| Versión de Node | 18 o superior |

## Servidor propio (nginx, Apache…)

Copia el contenido de `_site/` a la carpeta pública. Las páginas son `carpeta/index.html`, así que basta con la regla habitual de «servir index.html para un directorio». Usa `404.html` como página de error.

## Subcarpetas

Puede alojarse en una subcarpeta (`https://ejemplo.com/docs/`) sin cambios: todos los enlaces son relativos.

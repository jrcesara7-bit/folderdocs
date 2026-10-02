# Otros hosts

El resultado es un sitio estático: sirve cualquier hosting capaz de entregar archivos. Hay dos formas de dejarlo listo.

## Qué subir

Sube `index.html`, `assets/` y `docs/`. Antes, regenera el menú para que `docs/nav.json` esté al día:

```bash
npm run nav
```

## Netlify, Cloudflare Pages, Vercel

| Campo | Valor |
| ----- | ----- |
| Build command | `node tools/build-nav.mjs` |
| Output / publish directory | `.` (la raíz del repositorio) |

Si publicas la raíz completa también se servirán `tools/` y `tests/`: no contienen nada sensible, pero si prefieres evitarlo, copia solo `index.html`, `assets/` y `docs/` a una carpeta de salida.

## Servidor propio (nginx, Apache…)

Copia `index.html`, `assets/` y `docs/` a la carpeta pública. No necesita reglas de reescritura porque las rutas de la plantilla van tras `#`.

## Subcarpetas

Puede alojarse en una subcarpeta (`https://ejemplo.com/docs/`) sin cambios: todas las rutas son relativas.

# Plantilla de documentación

Sitio de documentación estático que **lee archivos Markdown** y los muestra con un tema
oscuro/claro inspirado en Godot Docs (Read the Docs). Sin build, sin Node: solo HTML + JS.

## Ver en local

Los navegadores bloquean `fetch` sobre `file://`, así que sirve la carpeta con el servidor incluido
(Node 18+, sin dependencias). Además regenera el menú en cada recarga:

```bash
node tools/serve.mjs      # http://localhost:8000
```

## Agregar documentación

Crea carpetas y archivos `.md` dentro de `docs/` y recarga: **el menú se genera solo**.

```text
docs/
├── index.md                    portada (no sale en el menú)
├── guia/                       → sección "Guia"
│   ├── _meta.json              { "title": "Guía", "order": 1 }   (opcional)
│   ├── instalacion.md          → página
│   └── avanzado/               → grupo desplegable
│       ├── index.md            → página del grupo
│       └── 01-plugins.md       → página (el prefijo numérico fija el orden)
```

Título: `title:` del front matter → primer `# Encabezado` → nombre del archivo.
Orden: `order:` → prefijo numérico → alfabético. Lo que empieza con `_` o `.` se ignora.
Detalles en `docs/manual/organizar-contenido.md`.

El menú se guarda en `docs/nav.json` (no lo edites a mano). Se regenera con `node tools/build-nav.mjs`
o, en GitHub, con la acción `.github/workflows/nav.yml` en cada push que toque `docs/`.

`docs/manual/guia-markdown.md` muestra todo lo soportado en una página: avisos (`> [!NOTE]`, `TIP`,
`IMPORTANT`, `WARNING`, `CAUTION`), código con resaltado y botón copiar, tablas, enlaces relativos entre
`.md`, imágenes relativas y recuadros de portada (`.tile`).

## Personalizar

- Nombre, subtítulo, repo (para "Editar en GitHub"), pie, logo y nombre de la sección de archivos sueltos (`rootSection`): `docs/config.json` → `site`.
- Colores y tipografía: variables al inicio de `assets/css/theme.css`.

## Publicar

Es un sitio estático: GitHub Pages (Settings → Pages → rama y carpeta raíz), Netlify, etc.
Las rutas usan `#/`, así que no requiere configuración de servidor.

## Dependencias incluidas (`assets/vendor/`)

[marked](https://github.com/markedjs/marked) (MIT) y [highlight.js](https://highlightjs.org) (BSD-3).

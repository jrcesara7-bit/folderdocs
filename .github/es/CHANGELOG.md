# Changelog

*[Read in English](../../CHANGELOG.md)*

Todos los cambios relevantes de este proyecto se documentan aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

## [2.0.0] - 2026-10-02

folderdocs ahora genera una **página HTML estática por cada archivo Markdown**, de modo que los buscadores pueden indexar cada página. Es una versión con cambios incompatibles: las URL basadas en hash (`#/guia/01-pagina`) se sustituyen por URL limpias (`/guia/pagina/`), y publicar requiere un paso de construcción (GitHub Pages lo ejecuta por ti).

### Añadido

- Generador de sitio estático (`npm run build`): una página HTML completa, legible sin JavaScript, por cada `.md` y por cada idioma.
- URL limpias: carpetas y nombres de archivo pasan a `/carpeta/pagina/`, sin prefijos numéricos de orden y sin acentos. Si dos URL coinciden, la compilación se detiene.
- SEO por página: `<title>`, meta descripción (del front matter `description:` o del primer párrafo), enlace canónico, etiquetas Open Graph y Twitter, JSON-LD de migas de pan, `sitemap.xml`, `robots.txt` y un `404.html` con `noindex`.
- Alternativas `hreflang` y un selector de idioma que enlaza traducciones, emparejando las páginas que comparten un `id:` en su front matter. Las carpetas de idioma (`docs-xx/`) se descubren solas y el selector se construye a partir de ellas.
- Detección automática de la URL del sitio en GitHub Actions, con `site.url` y `SITE_URL` para sustituirla.
- Comprobación de enlaces al compilar (páginas, imágenes y archivos), con `--strict` para que la compilación falle.
- Índice de búsqueda generado al compilar (`search-index.json`, uno por idioma).
- Menú con `<details>` nativo que funciona sin JavaScript, enlace «saltar al contenido» y diseño alternativo sin JavaScript.
- Servidor de desarrollo que reconstruye el sitio en memoria cada vez que cambia un archivo.
- Opciones nuevas de configuración: `description`, `url`, `image`, `langLabel`; campos nuevos de front matter: `description`, `id`, `seoTitle`.
- Patrones de archivos secretos en `.gitignore`.

### Cambiado

- El navegador ya no descarga ni ejecuta `marked` ni `highlight.js`; solo se usan al compilar (`tools/vendor/`). El script restante (`assets/js/site.js`) tiene unas 150 líneas.
- La documentación, las pruebas y el flujo de Pages se reescribieron para la nueva arquitectura.

### Eliminado

- El renderizador del navegador (`assets/js/app.js`), las páginas de entrada `index.html` escritas a mano y los `nav.json` generados. Los menús se construyen junto con las páginas.
- Las claves de configuración `languages` y `home` (los idiomas se detectan por las carpetas; la portada es siempre `index.md`).

### Migración desde 1.x

- Los enlaces como `#/guia/01-pagina` redirigen automáticamente a `/guia/pagina/` para quien abra un enlace antiguo en el sitio.
- Sustituye los `href` con `#/…` del HTML escrito a mano (como los recuadros de portada) por rutas relativas a archivos `.md`.
- Ejecuta `npm run build` (o `npm run dev`) en lugar de `npm run nav`.
- Elimina cualquier edición personalizada de `index.html`: los títulos, descripciones y etiquetas sociales ahora viven en `config.json` y en el front matter.

## [1.0.0] - 2026-10-02

Primera versión pública.

### Añadido

- Lector de Markdown en el navegador (`marked`) con extensiones de GitHub: tablas, listas de tareas, tachado.
- Menú lateral generado automáticamente a partir de las carpetas de `docs/` (`tools/build-nav.mjs`), con títulos desde front matter o `# H1`, orden por `order`, prefijo numérico o alfabético, y `_meta.json` por carpeta.
- Buscador de texto en el menú, con atajo `/`.
- Tema oscuro y claro, recordado entre visitas; diseño adaptable a móvil e impresión.
- Avisos con sintaxis de GitHub (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`).
- Resaltado de código (`highlight.js`) y botón de copiar.
- Enlaces e imágenes relativos entre archivos `.md`; anclas automáticas en encabezados.
- Recuadros de portada de colores.
- Enlace «Editar en GitHub», migas de pan y paginación anterior/siguiente.
- Interfaz en español e inglés (`site.lang`) y sitios multilingües: una carpeta de documentación por idioma (`docs/`, `docs-es/`) con selector de idioma.
- Servidor de desarrollo (`tools/serve.mjs`) que regenera los menús en cada recarga y un generador del sitio (`tools/build-site.mjs`).
- Flujos de GitHub Actions: pruebas, comprobación de `nav.json` y publicación en GitHub Pages.
- Pruebas del generador de menú y del generador del sitio (`npm test`).

[1.0.0]: https://github.com/jrcesara7-bit/folderdocs/releases/tag/v1.0.0
[Unreleased]: https://github.com/jrcesara7-bit/folderdocs/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/jrcesara7-bit/folderdocs/compare/v1.0.0...v2.0.0

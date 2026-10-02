# Changelog

*[Read in English](../../CHANGELOG.md)*

Todos los cambios relevantes de este proyecto se documentan aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

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

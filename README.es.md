<div align="center">

# folderdocs

**Plantilla de documentación en Markdown. Tus carpetas son el menú: escribe archivos `.md` y obtén un sitio con buscador y tema oscuro/claro. Sin build y sin dependencias que instalar.**

[![CI](https://github.com/jrcesara7-bit/folderdocs/actions/workflows/ci.yml/badge.svg)](https://github.com/jrcesara7-bit/folderdocs/actions/workflows/ci.yml)
[![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
![Node 18+](https://img.shields.io/badge/node-%E2%89%A518-339933)

[**Ver demo**](https://jrcesara7-bit.github.io/folderdocs/es/) · [Documentación](https://jrcesara7-bit.github.io/folderdocs/es/#/empezar/01-instalacion) · [Reportar un error](https://github.com/jrcesara7-bit/folderdocs/issues/new/choose) · [English](README.md)

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs-es/img/preview-light.png">
  <img alt="Captura de folderdocs: menú lateral con secciones, buscador y recuadros de colores en la portada" src="docs-es/img/preview-dark.png" width="900">
</picture>

</div>

## Para qué sirve

Es una plantilla para tener documentación presentable (de un proyecto, un producto, un equipo o tus apuntes) escribiendo solo `.md`. Creas una carpeta, añades un archivo, recargas: aparece en el menú. No hay lista que mantener, ni framework que aprender, ni paso de compilación.

La estética se inspira en la documentación de Godot y en el tema Read the Docs: menú lateral con secciones plegables, migas de pan, avisos de colores y paginación anterior/siguiente.

## Características

- **Menú automático**: cada carpeta es una sección, cada subcarpeta un grupo y cada `.md` una página. Títulos desde el front matter o el primer `# H1`; orden por `order`, prefijo numérico (`01-`) o alfabético.
- **Buscador** de texto en el menú lateral, sin servicios externos (atajo: `/`).
- **Tema oscuro y claro**, recordado entre visitas. Los colores son variables CSS.
- **Markdown ampliado**: tablas, listas de tareas, avisos como los de GitHub (`> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`), código resaltado con botón de copiar.
- **Enlaces e imágenes relativos** entre archivos `.md`, que también funcionan al verlos en GitHub.
- **Recuadros de colores** para la portada, escritos como HTML dentro del `.md`.
- **Multilingüe**: interfaz en español e inglés, y una carpeta de documentación por idioma con selector de idioma (la demo de este repositorio se publica en ambos).
- **Adaptable a móvil** y con hoja de estilos de impresión.
- **Enlace «Editar en GitHub»** en cada página.
- **Sin dependencias que instalar**: `marked` y `highlight.js` vienen incluidos en `assets/vendor/`. Node solo hace falta en local, para el servidor de desarrollo y los scripts de construcción.
- **Flujos de GitHub Actions** listos: pruebas, comprobación del menú y publicación en GitHub Pages.

## Inicio rápido

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
# 1. Usa la plantilla (botón "Use this template" en GitHub) o clónala
git clone https://github.com/jrcesara7-bit/folderdocs.git mi-documentacion
cd mi-documentacion

# 2. Arranca el servidor local (regenera el menú en cada recarga)
npm run dev
```

Abre <http://localhost:8000/es/> para la versión en español. Después:

1. Crea `docs-es/guia/hola.md` con `# Hola` y un párrafo.
2. Recarga el navegador: aparece en el menú, bajo **Guía**.
3. Edita `docs-es/config.json` con el nombre y el repositorio de tu proyecto.

> No abras `index.html` con doble clic: el navegador bloquea la lectura de archivos locales. Usa `npm run dev`.

¿Un solo idioma? Borra la carpeta del otro idioma (`docs/` o `docs-es/`) y su página de entrada (`index.html` o `es/`), y quita `languages` del `config.json`.

## Cómo se organiza el contenido

```text
docs-es/
├── index.md                    portada (no sale en el menú)
├── config.json                 nombre, idioma, repositorio…
├── guia/                       → sección «Guía»
│   ├── _meta.json              { "title": "Guía", "order": 1 }   (opcional)
│   ├── instalacion.md          → página
│   └── avanzado/               → grupo desplegable
│       ├── index.md            → página del propio grupo
│       └── 01-plugins.md       → el prefijo numérico fija el orden
└── _borrador/                  lo que empieza con _ o . se ignora
```

El menú se guarda en `nav.json` (generado; no se edita a mano). Detalles en la [guía de organización](https://jrcesara7-bit.github.io/folderdocs/es/#/guia/01-organizar-contenido).

## Personalización

| Qué | Dónde |
| --- | --- |
| Nombre, subtítulo, pie, idioma, repositorio, logo | `config.json` de la carpeta de documentación |
| Colores (tema oscuro y claro), tipografía, ancho | variables al inicio de `assets/css/theme.css` |
| Título, descripción y vista previa para redes | `index.html`, `es/index.html` y `assets/img/social-preview.png` |
| Textos de la interfaz o un idioma de interfaz nuevo | objeto `I18N` en `assets/js/app.js` |
| Un sitio en varios idiomas | [Guía de idiomas](https://jrcesara7-bit.github.io/folderdocs/es/#/personalizar/03-idioma) |

## Publicar

El flujo `.github/workflows/pages.yml` publica el sitio en GitHub Pages en cada push a `main`. Solo tienes que ir a **Settings → Pages → Source → GitHub Actions**. Para cualquier otro hosting estático (Netlify, Cloudflare Pages, nginx…), ejecuta `npm run build` y publica la carpeta `_site/`. Mira [Publicar](https://jrcesara7-bit.github.io/folderdocs/es/#/publicar/02-otros-hosts).

## Limitaciones

Se dicen aquí para que decidas con información:

- **SEO por página: no.** El contenido se pinta en el navegador y las direcciones usan `#/ruta`, así que los buscadores ven el sitio como una sola página. Para documentación pública que deba posicionar cada página, usa un generador que produzca un HTML por página (MkDocs, Docusaurus, VitePress, Astro Starlight…); tus `.md` se reutilizan casi sin cambios.
- Requiere JavaScript.
- Sin versionado de documentación. Los idiomas funcionan como un sitio por idioma.
- El HTML dentro de los `.md` no se filtra: no es apto para contenido de usuarios desconocidos.

Más contexto en [Por qué esta plantilla](https://jrcesara7-bit.github.io/folderdocs/es/#/acerca/01-por-que-esta-plantilla).

## Desarrollo y contribuciones

```bash
npm run dev     # servidor local con menús automáticos
npm run nav     # regenera todos los nav.json
npm run build   # ensambla el sitio publicable en _site/
npm test        # pruebas de las herramientas
```

Las contribuciones son bienvenidas: lee [CONTRIBUTING](.github/es/CONTRIBUTING.md) antes de abrir una solicitud de cambio. Los cambios por versión están en el [CHANGELOG](.github/es/CHANGELOG.md).

## Créditos y licencia

- [marked](https://github.com/markedjs/marked) (MIT) y [highlight.js](https://highlightjs.org) (BSD-3-Clause), incluidos en `assets/vendor/`.
- Estética inspirada en [Godot Docs](https://docs.godotengine.org) y Read the Docs; no se usan sus recursos gráficos.

Distribuido bajo la licencia [MIT](LICENSE).

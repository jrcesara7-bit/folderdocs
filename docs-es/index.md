# folderdocs

> [!NOTE]
> Este sitio es la demo de la plantilla y a la vez su documentación. Cada página es un archivo `.md` dentro de `docs-es/`: no hay HTML que escribir ni mantener.

Escribes Markdown y creas carpetas; folderdocs las convierte en un sitio de documentación estático y rápido: menú lateral, buscador, migas de pan, tema oscuro y claro, avisos y resaltado de código. Cada página es su propio archivo HTML con una URL limpia, así que los buscadores pueden indexarla, y funciona en cualquier hosting estático.

Elige el recuadro que mejor describa tu situación:

<div class="tiles">
  <a class="tile green" href="empezar/01-instalacion.md">Quiero usar la plantilla.<br><strong>Instalar y verla en local.</strong></a>
  <a class="tile teal" href="guia/01-organizar-contenido.md">Quiero escribir contenido.<br><strong>Carpetas, menú y Markdown.</strong></a>
  <a class="tile blue" href="personalizar/01-configuracion.md">Quiero que se vea como mi proyecto.<br><strong>Nombre, logo, colores e idioma.</strong></a>
  <a class="tile red" href="publicar/01-github-pages.md">Quiero publicarla.<br><strong>GitHub Pages y otros hosts.</strong></a>
</div>

## Qué incluye

- **Menú automático**: cada carpeta es una sección y cada `.md` una página. Sin listas que mantener.
- **Una página HTML por archivo Markdown**, con URLs limpias, títulos, descripciones, enlaces canónicos, sitemap y datos de migas de pan para los buscadores.
- **Se lee sin JavaScript**; el script solo añade el buscador, el cambio de tema, el menú móvil y los botones de copiar.
- **Buscador** en el menú lateral (atajo: `/`), construido a partir de un índice generado al compilar.
- **Tema oscuro y claro**, recordado entre visitas, y diseño adaptable a móvil.
- **Avisos**, tablas, código resaltado con botón de copiar, y enlaces relativos entre páginas que el build comprueba por ti.
- **Multilingüe**: una carpeta de documentación por idioma, con selector de idioma y enlaces `hreflang`.

## Antes de elegirla

folderdocs genera páginas estáticas con un solo comando (`npm run build`), y GitHub Pages lo ejecuta por ti. Buenas URLs y metadatos hacen que tus páginas se puedan indexar, pero no deciden tu posición. Lee [SEO y limitaciones](publicar/03-seo-y-limitaciones.md) para saber qué esperar, y la [comparación con otras herramientas](acerca/01-por-que-esta-plantilla.md).

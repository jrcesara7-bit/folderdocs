---
id: seo
description: Cómo ayuda folderdocs a posicionar tu documentación: una página HTML por archivo, URL canónicas, sitemap y expectativas realistas.
---
# SEO y limitaciones

## Qué hace la compilación por los buscadores

Cada archivo Markdown se convierte en su propia página HTML completa, así que los rastreadores ven tu contenido sin ejecutar JavaScript. Para cada página folderdocs genera:

- una **URL limpia y estable** (`/guia/sintaxis-markdown/`);
- un `<title>` (`Página · Sitio`) y una **meta descripción**, desde el front matter o el primer párrafo;
- un **enlace canónico** y etiquetas **Open Graph / Twitter** para buenas vistas previas;
- **datos estructurados de migas de pan** (JSON-LD) que coinciden con las migas visibles;
- enlaces `hreflang` entre traducciones (ver [Idioma](../personalizar/03-idioma.md));
- un **`sitemap.xml`** y un **`robots.txt`**, y un `404.html` marcado como `noindex`;
- texto alternativo descriptivo en imágenes, anclas en los encabezados y un enlace «saltar al contenido».

Los enlaces canónicos, el sitemap y `og:url` necesitan la [URL de tu sitio](../personalizar/01-configuracion.md), que los despliegues en GitHub Pages detectan automáticamente.

## Qué conviene que hagas

- Da a cada página un título claro y, a las importantes, un `description:` escrito a mano.
- Escribe un texto `alt` real en las imágenes.
- Define `site.url` si usas un dominio propio.
- Envía `https://tu-sitio/sitemap.xml` en [Google Search Console](https://search.google.com/search-console) y en Bing Webmaster Tools.
- Enlaza tu documentación desde tu README, la web de tu proyecto y otros sitios que la gente visite.

> [!IMPORTANT]
> Buenas URL y metadatos hacen que tus páginas se puedan **indexar**; no deciden en qué posición salen. La posición depende de la calidad de tu contenido, de los enlaces de otros sitios y de la antigüedad del sitio. Cuenta con que las páginas nuevas tarden semanas en aparecer.

## Otras limitaciones

- **Necesita un paso de construcción.** Previsualizar y publicar usan Node (`npm run dev`, `npm run build`); GitHub Pages lo ejecuta por ti. Tu servidor solo recibe archivos estáticos.
- **El buscador es de texto simple.** Funciona en el navegador con un índice generado al compilar, sin coincidencias aproximadas ni ordenación semántica. Sí necesita JavaScript; todo lo demás funciona sin él.
- **Sin versionado de documentación.** Los idiomas se resuelven con una carpeta por idioma.
- **El HTML dentro de los `.md` no se filtra.** Publica solo contenido en el que confíes.
- **El índice de búsqueda contiene el texto de cada página** (los primeros 20 000 caracteres de cada una). Va bien con cientos de páginas; para un sitio muy grande, usa un servicio de búsqueda dedicado.

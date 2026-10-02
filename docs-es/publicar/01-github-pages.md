---
id: github-pages
description: Publica tu sitio folderdocs en GitHub Pages con el flujo incluido, un dominio propio y la URL de sitio correcta.
---
# GitHub Pages

El repositorio incluye el flujo `.github/workflows/pages.yml`, que construye el sitio y lo publica en cada push a `main`.

## Activarlo

1. Sube tu repositorio a GitHub con la rama `main`.
2. Ve a **Settings → Pages**.
3. En **Build and deployment → Source**, elige **GitHub Actions**.
4. Haz un push a `main` (o lanza el flujo a mano desde la pestaña **Actions**).

Tu sitio quedará en `https://TU-USUARIO.github.io/TU-REPO/`.

## Antes de publicar

- En el `config.json` de cada idioma: `title`, `subtitle`, `description`, `repo` y `branch`.
- Sustituye `assets/img/social-preview.png` por tu imagen para redes (1200×630 recomendado).
- Sustituye `assets/img/favicon.svg` por tu icono.

> [!NOTE]
> El flujo detecta la URL de tu sitio automáticamente (`https://TU-USUARIO.github.io/TU-REPO`), así que los enlaces canónicos y el sitemap salen bien sin configurar nada. Con un dominio propio, define `site.url` como se explica abajo.

## Dominio propio

1. En **Settings → Pages → Custom domain** escribe tu dominio y crea el registro DNS que GitHub te indique.
2. Pon `"url": "https://tu-dominio.com"` en `docs/config.json`, para que los enlaces canónicos y el sitemap lo usen.

## Qué hace el flujo

Ejecuta `npm run build -- --strict`, que regenera todas las páginas y **se detiene con un error si un enlace apunta a una página o archivo que no existe**. Después publica `_site/`, que contiene solo lo que un navegador necesita: las páginas, `assets/`, las imágenes de tu documentación, el sitemap y `404.html`. Las herramientas, las pruebas y el resto del repositorio no se publican.

> [!TIP]
> Si algo falla, abre la pestaña **Actions** y revisa el registro del flujo «Deploy to GitHub Pages». Los enlaces rotos aparecen ahí con el archivo que los contiene.

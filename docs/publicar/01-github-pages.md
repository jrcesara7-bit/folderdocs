# GitHub Pages

El repositorio incluye el flujo `.github/workflows/pages.yml`, que regenera el menú y publica el sitio en cada push a `main`.

## Activarlo

1. Sube tu repositorio a GitHub con la rama `main`.
2. Ve a **Settings → Pages**.
3. En **Build and deployment → Source**, elige **GitHub Actions**.
4. Haz un push a `main` (o lanza el flujo a mano desde la pestaña **Actions**).

Tu sitio quedará en `https://TU-USUARIO.github.io/TU-REPO/`.

## Antes de publicar

- En `docs/config.json`: `repo` y `branch`.
- En `index.html`: `<title>`, descripción y URL de las etiquetas `og:`.
- Sustituye `assets/img/social-preview.png` por tu imagen para redes (1200×630 recomendado).

> [!NOTE]
> El sitio usa rutas relativas y rutas con `#/`, así que funciona igual en `usuario.github.io/repo/` que en un dominio propio, sin configuración adicional.

## Dominio propio

En **Settings → Pages → Custom domain** escribe tu dominio y crea el registro DNS que GitHub te indique. Actualiza después `og:url` y `og:image`.

## Qué se publica

El flujo copia solo lo necesario: `index.html`, `assets/` y `docs/`. Las herramientas, las pruebas y el resto del repositorio no se publican.

> [!TIP]
> Si algo falla, abre la pestaña **Actions** y revisa el registro del flujo «Publicar en GitHub Pages».

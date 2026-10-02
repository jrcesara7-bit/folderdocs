# Configuración

Los datos del sitio están en `docs/config.json`, dentro de la clave `site`:

```json
{
  "site": {
    "title": "Mi Proyecto",
    "subtitle": "Documentación oficial",
    "footer": "© 2026 Mi Proyecto",
    "version": "v1.0",
    "lang": "es",
    "home": "index",
    "repo": "usuario/repositorio",
    "branch": "main",
    "contributeUrl": "",
    "logo": "assets/img/logo.svg",
    "rootSection": "General"
  }
}
```

| Clave | Qué hace |
| ----- | -------- |
| `title` | Nombre del sitio: cabecera del menú, pestaña del navegador y barra superior en móvil. |
| `subtitle` | Texto en negrita sobre las migas de pan. |
| `footer` | Pie de página. |
| `version` | Etiqueta en la esquina inferior del menú. Déjala vacía para ocultarla. |
| `lang` | Idioma de la interfaz: `es` o `en`. Ver [Idioma](03-idioma.md). |
| `home` | Archivo de la portada, sin extensión. Por defecto `index`. |
| `repo` | `usuario/repositorio`. Activa el enlace «Editar en GitHub» de cada página. Vacío = sin enlace. |
| `branch` | Rama usada en ese enlace. Por defecto `main`. |
| `contributeUrl` | Si no está vacío, muestra un segundo enlace bajo «Editar» (por ejemplo, tu guía de contribución). |
| `logo` | Ruta a una imagen para el menú. Sin ella se muestra la inicial del título sobre un cuadro de color. |
| `rootSection` | Nombre de la sección que agrupa los `.md` sueltos en la raíz de `docs/`. |

## Fuera de `config.json`

Hay cuatro cosas que viven en `index.html` y no en la configuración, porque los buscadores y las redes sociales las leen **antes** de ejecutar JavaScript:

- `<title>` y `<meta name="description">`.
- Las etiquetas `og:` y `twitter:` (vista previa al compartir el enlace).
- `og:url` y `og:image`, que deben ser URL absolutas de tu sitio publicado.
- El favicon, en `assets/img/favicon.svg`.

> [!IMPORTANT]
> Cámbialas antes de publicar. Si no, tu sitio se anunciará con el nombre y la URL de la plantilla.

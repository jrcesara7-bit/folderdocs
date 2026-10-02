---
id: structure
description: Qué hace cada carpeta y archivo de folderdocs, y cuáles necesitas editar de verdad.
---
# Estructura del proyecto

```text
.
├── docs/                    ← tu documentación (idioma por defecto)
│   ├── config.json          nombre, idioma, repositorio…
│   ├── index.md             portada
│   └── …carpetas con .md
├── docs-es/                 versión en español de la documentación
├── assets/
│   ├── css/theme.css        el tema (los colores son variables)
│   ├── js/site.js           buscador, cambio de tema, menú móvil, botones de copiar
│   └── img/                 favicon e imagen para redes
├── tools/
│   ├── build-site.mjs       construye el sitio en _site/
│   ├── serve.mjs            servidor de desarrollo
│   ├── lib/                 el generador (Markdown, menú, plantilla de página)
│   └── vendor/              marked y highlight.js, solo se usan al compilar
├── tests/                   pruebas del generador
└── _site/                   resultado de la compilación (no se sube al repo)
```

## Lo que tocas a diario

La carpeta de documentación de tu idioma. El resto solo se modifica si quieres cambiar el comportamiento o el diseño. Si tu sitio tiene un solo idioma, puedes borrar la carpeta del otro.

## Qué es cada archivo de la carpeta de documentación

| Archivo | Para qué sirve |
| ------- | -------------- |
| `config.json` | Nombre del sitio, idioma, enlace del repositorio… Ver [Configuración](../personalizar/01-configuracion.md). |
| `index.md` | La portada. No aparece en el menú. |
| `*/_meta.json` | Opcional: título y orden de una carpeta. |
| todo lo demás | Páginas (`.md`) y los archivos que usan, como imágenes. |

> [!NOTE]
> En estas páginas, `docs/` se refiere a la carpeta de documentación de tu sitio. En este repositorio, la del español es `docs-es/`.

> [!NOTE]
> Los archivos y carpetas cuyo nombre empieza con `_` o `.` se ignoran al construir el sitio. Úsalo para borradores.

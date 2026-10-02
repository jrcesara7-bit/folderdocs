# Estructura del proyecto

```text
.
├── index.html               página única que carga todo (inglés)
├── es/index.html            la misma página para el sitio en español
├── assets/
│   ├── css/theme.css        tema (colores en variables)
│   ├── js/app.js            lector de Markdown, menú, búsqueda
│   ├── img/                 favicon e imagen para redes
│   └── vendor/              marked y highlight.js (incluidos)
├── docs/                    ← documentación en inglés
├── docs-es/                 ← documentación en español
│   ├── config.json          nombre, idioma, repositorio…
│   ├── nav.json             menú (generado, no se edita)
│   ├── index.md             portada
│   └── …carpetas con .md
├── tools/
│   ├── build-nav.mjs        genera cada nav.json
│   ├── build-site.mjs       ensambla el sitio en _site/
│   └── serve.mjs            servidor de desarrollo
└── tests/                   pruebas del generador de menú
```

## Lo único que tocas a diario

La carpeta de documentación de tu idioma (aquí `docs-es/`). El resto (`index.html`, `assets/`, `tools/`) solo se modifica si quieres cambiar el comportamiento o el diseño. Si tu sitio tiene un solo idioma, puedes borrar la otra carpeta de documentación y `es/`.

## Qué es cada archivo de `docs/`

| Archivo | Para qué sirve |
| ------- | -------------- |
| `config.json` | Nombre del sitio, idioma, enlace del repositorio… Ver [Configuración](../personalizar/01-configuracion.md). |
| `nav.json` | Menú lateral. Lo genera `tools/build-nav.mjs`; se sobrescribe. |
| `index.md` | La portada. No aparece en el menú ni en el buscador. |
| `*/_meta.json` | Opcional: título y orden de una carpeta. |

> [!NOTE]
> En estas páginas, `docs/` se refiere a la carpeta de documentación de tu sitio. En este repositorio, la del español es `docs-es/`.

> [!NOTE]
> Los archivos y carpetas cuyo nombre empieza con `_` o `.` se ignoran al generar el menú. Úsalo para borradores.

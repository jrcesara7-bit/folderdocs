# Estructura del proyecto

```text
.
├── index.html               página única que carga todo
├── assets/
│   ├── css/theme.css        tema (colores en variables)
│   ├── js/app.js            lector de Markdown, menú, búsqueda
│   ├── img/                 favicon e imagen para redes
│   └── vendor/              marked y highlight.js (incluidos)
├── docs/                    ← aquí vive tu documentación
│   ├── config.json          nombre, idioma, repositorio…
│   ├── nav.json             menú (generado, no se edita)
│   ├── index.md             portada
│   └── …carpetas con .md
├── tools/
│   ├── build-nav.mjs        genera docs/nav.json
│   └── serve.mjs            servidor de desarrollo
└── tests/                   pruebas del generador de menú
```

## Lo único que tocas a diario

La carpeta `docs/`. El resto (`index.html`, `assets/`, `tools/`) solo se modifica si quieres cambiar el comportamiento o el diseño.

## Qué es cada archivo de `docs/`

| Archivo | Para qué sirve |
| ------- | -------------- |
| `config.json` | Nombre del sitio, idioma, enlace del repositorio… Ver [Configuración](../personalizar/01-configuracion.md). |
| `nav.json` | Menú lateral. Lo genera `tools/build-nav.mjs`; se sobrescribe. |
| `index.md` | La portada. No aparece en el menú ni en el buscador. |
| `*/_meta.json` | Opcional: título y orden de una carpeta. |

> [!NOTE]
> Los archivos y carpetas cuyo nombre empieza con `_` o `.` se ignoran al generar el menú. Úsalo para borradores.

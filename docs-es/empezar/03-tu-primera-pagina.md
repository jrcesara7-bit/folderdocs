---
id: first-page
description: Crea tu primera página de documentación y tu primera sección del menú añadiendo archivos Markdown.
---
# Tu primera página

1. Crea el archivo `docs/guia/hola.md`:

```markdown
---
description: Mi primera página de documentación.
---
# Hola, mundo

Bienvenido a mi documentación.

> [!TIP]
> Los avisos usan la sintaxis de GitHub.
```

2. Guarda y refresca el navegador. Aparece en el menú bajo **Guía**, con el título del primer `# Encabezado`, y vive en `/guia/hola/`.

No editaste ninguna lista ni ningún HTML: el menú se genera a partir de lo que hay en `docs/`.

## Una sección nueva

Crea una carpeta con al menos un `.md`:

```text
docs/api/
├── index.md              ← primera página de la sección, en /api/
└── autenticacion.md      ← en /api/autenticacion/
```

Aparece como la sección **Api**. Para llamarla «API» o fijar su posición, añade `docs/api/_meta.json`:

```json
{ "title": "API", "order": 6 }
```

## Un título, descripción y orden propios

Con *front matter* al inicio del archivo:

```markdown
---
title: Cómo empezar
description: Un resumen corto que los buscadores muestran bajo el título.
order: 1
---
# Contenido…
```

Más detalles en [Organizar el contenido](../guia/01-organizar-contenido.md).

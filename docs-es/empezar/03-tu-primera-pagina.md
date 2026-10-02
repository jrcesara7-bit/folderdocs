# Tu primera página

1. Crea el archivo `docs/guia/hola.md`:

```markdown
# Hola, mundo

Mi primera página de documentación.

> [!TIP]
> Los avisos usan la sintaxis de GitHub.
```

2. Guarda y recarga el navegador. Aparece en el menú bajo **Guía**, con el título del primer `# Encabezado`.

No editaste ninguna lista ni ningún HTML: el menú se genera a partir de lo que hay en `docs/`.

## Una sección nueva

Crea una carpeta con al menos un `.md`:

```text
docs/api/
├── index.md              ← portada de la sección
└── autenticacion.md
```

Aparece como la sección **Api**. Para llamarla «API» o fijar su posición, añade `docs/api/_meta.json`:

```json
{ "title": "API", "order": 6 }
```

## Un título y orden propios

Con *front matter* al inicio del archivo:

```markdown
---
title: Cómo empezar
order: 1
---
# Contenido…
```

Más detalles en [Organizar el contenido](../guia/01-organizar-contenido.md).

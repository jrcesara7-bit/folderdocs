# Organizar el contenido

El menú lateral se genera a partir de las carpetas y archivos de `docs/`. No hay lista que mantener.

| Qué creas | Qué aparece en el menú |
| --------- | ---------------------- |
| Carpeta en `docs/` | Una **sección** (encabezado plegable) |
| Subcarpeta dentro de una sección | Un grupo desplegable |
| Archivo `.md` | Una página |
| `carpeta/index.md` | La página de esa carpeta (en una subcarpeta, el grupo se vuelve clicable; en una sección, aparece como primera página) |
| `docs/index.md` | La portada (no sale en el menú) |
| Archivos `.md` sueltos en `docs/` | Una sección «General» (configurable con `rootSection`) |
| Carpeta sin ningún `.md` | Nada: se ignora, por ejemplo `img/` |

## Títulos

Para una **página**, por orden de prioridad:

1. `title:` del front matter.
2. El primer encabezado `# …` del archivo.
3. El nombre del archivo, formateado.

Para una **carpeta**: `title` de su `_meta.json`; si no existe y es una subcarpeta con `index.md`, el título de esa página; si no, el nombre de la carpeta.

## Orden

1. `order:` en el front matter (páginas) o en `_meta.json` (carpetas).
2. Un prefijo numérico en el nombre: `01-instalacion.md`, `02-uso.md`. El prefijo no se muestra.
3. Orden alfabético.

```markdown
---
title: Instalación
order: 1
---
```

```json
{ "title": "Primeros pasos", "order": 2 }
```

> [!NOTE]
> El prefijo numérico forma parte de la URL (`#/empezar/01-instalacion`). Si prefieres URLs sin números, usa `order:` en lugar del prefijo.

## Cuándo se actualiza el menú

El menú se guarda en `docs/nav.json`, que genera `tools/build-nav.mjs`:

- **En local**: `npm run dev` lo regenera en cada recarga.
- **A mano**: `npm run nav`.
- **Al publicar con GitHub Pages**: el flujo incluido lo regenera en cada despliegue.

> [!IMPORTANT]
> No edites `docs/nav.json` a mano: se sobrescribe. Si lo subes al repositorio desactualizado, la integración continua te avisa.

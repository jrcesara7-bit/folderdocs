---
id: theme
description: Cambia los colores, el acento, los recuadros, el resaltado de código y la tipografía de tu sitio con variables CSS.
---
# Tema y colores

Todo el diseño está en `assets/css/theme.css`, y los colores son variables CSS al principio del archivo. No hace falta tocar ninguna otra regla para cambiar la paleta.

## Variables principales

```css
:root,
:root[data-theme="dark"] {
  --bg-page: #1c1e20;       /* fondo exterior */
  --bg-sidebar: #25282c;    /* menú lateral */
  --bg-content: #2c3034;    /* columna de contenido */
  --text: #d8dbde;
  --accent: #ff5d7d;        /* títulos de sección del menú */
  --link: #62b4f5;
}
```

El tema claro se define en el bloque `:root[data-theme="light"]`, con las mismas variables.

## Cambiar el color de acento

Sustituye `--accent` en ambos temas. Afecta a los títulos de sección, al elemento activo del menú, al cuadro del logo y a las coincidencias del buscador.

## Recuadros de portada

Las variables `--tile-green`, `--tile-teal`, `--tile-blue` y `--tile-red` definen los cuatro colores. Para añadir uno nuevo:

```css
:root { --tile-orange: #b45309; }
.doc .tile.orange { background: var(--tile-orange); }
```

## Colores de los avisos

Cada tipo tiene tres variables (`--note-bg`, `--note-head`, `--note-text`, y lo mismo para `tip`, `important`, `warning` y `caution`).

## Resaltado de código

Se controla con las variables `--hl-*` (comentarios, palabras clave, cadenas, números…), una paleta por tema.

## Tema inicial

El tema por defecto es el oscuro. Para que arranque en claro, cambia `data-theme="dark"` por `data-theme="light"` en la etiqueta `<html>` que produce `tools/lib/template.mjs`. La elección del visitante se guarda en su navegador y tiene prioridad.

## Ancho y tipografía

El ancho máximo del sitio es `max-width: 1310px` en `.layout`. La tipografía usa fuentes del sistema (no se descarga nada); cámbiala en la regla `body`.

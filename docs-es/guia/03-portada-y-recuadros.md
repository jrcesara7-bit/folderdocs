---
id: tiles
description: Crea una portada con recuadros de colores que guían a cada tipo de lector a la sección correcta de tu documentación.
---
# Portada y recuadros

La portada es `docs/index.md`. Es una página normal, pero admite **recuadros de colores** para guiar a cada tipo de lector.

```html
<div class="tiles">
  <a class="tile green" href="../empezar/01-instalacion.md">Nunca lo he usado.<br><strong>Quiero empezar.</strong></a>
  <a class="tile teal"  href="../guia/01-organizar-contenido.md">Ya lo instalé.<br><strong>Quiero escribir.</strong></a>
  <a class="tile blue"  href="../personalizar/01-configuracion.md">Ya lo uso.<br><strong>Quiero personalizarlo.</strong></a>
  <a class="tile red"   href="../publicar/01-github-pages.md">Está listo.<br><strong>Quiero publicarlo.</strong></a>
</div>
```

<div class="tiles">
  <a class="tile green" href="../empezar/01-instalacion.md">Nunca lo he usado.<br><strong>Quiero empezar.</strong></a>
  <a class="tile teal"  href="../guia/01-organizar-contenido.md">Ya lo instalé.<br><strong>Quiero escribir.</strong></a>
  <a class="tile blue"  href="../personalizar/01-configuracion.md">Ya lo uso.<br><strong>Quiero personalizarlo.</strong></a>
  <a class="tile red"   href="../publicar/01-github-pages.md">Está listo.<br><strong>Quiero publicarlo.</strong></a>
</div>

## Reglas

- Colores disponibles: `green` (por defecto), `teal`, `blue` y `red`. Se definen en `assets/css/theme.css`.
- Las rutas de arriba están escritas para una página dentro de `docs/guia/`; en `docs/index.md` quita el `../` inicial.
- El `href` de un recuadro es una ruta relativa a un archivo `.md`, igual que un enlace Markdown. La compilación la convierte en la URL de la página y te avisa si el archivo no existe.
- En pantallas estrechas los recuadros pasan a una sola columna.
- Dentro de un bloque HTML, Markdown **no** se interpreta: usa `<strong>` y `<br>`, no `**` ni saltos de línea.

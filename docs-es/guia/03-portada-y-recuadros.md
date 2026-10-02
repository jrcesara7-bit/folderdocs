# Portada y recuadros

La portada es `docs/index.md`. Es una página normal, pero admite **recuadros de colores** para guiar a cada tipo de lector.

```html
<div class="tiles">
  <a class="tile green" href="#/empezar/01-instalacion">Nunca lo he usado.<br><strong>Quiero empezar.</strong></a>
  <a class="tile teal"  href="#/guia/01-organizar-contenido">Ya lo instalé.<br><strong>Quiero escribir.</strong></a>
  <a class="tile blue"  href="#/personalizar/01-configuracion">Ya lo uso.<br><strong>Quiero personalizarlo.</strong></a>
  <a class="tile red"   href="#/publicar/01-github-pages">Está listo.<br><strong>Quiero publicarlo.</strong></a>
</div>
```

<div class="tiles">
  <a class="tile green" href="#/empezar/01-instalacion">Nunca lo he usado.<br><strong>Quiero empezar.</strong></a>
  <a class="tile teal"  href="#/guia/01-organizar-contenido">Ya lo instalé.<br><strong>Quiero escribir.</strong></a>
  <a class="tile blue"  href="#/personalizar/01-configuracion">Ya lo uso.<br><strong>Quiero personalizarlo.</strong></a>
  <a class="tile red"   href="#/publicar/01-github-pages">Está listo.<br><strong>Quiero publicarlo.</strong></a>
</div>

## Reglas

- Colores disponibles: `green` (por defecto), `teal`, `blue` y `red`. Se definen en `assets/css/theme.css`.
- En HTML escrito a mano, los enlaces internos usan la forma `#/ruta/sin/extension` (la misma que ves en la barra de direcciones).
- En pantallas estrechas los recuadros pasan a una sola columna.
- Dentro de un bloque HTML, Markdown **no** se interpreta: usa `<strong>` y `<br>`, no `**` ni saltos de línea.

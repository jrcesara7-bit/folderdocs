# Preguntas frecuentes

## ¿Por qué me aparece un error al abrir `index.html`?

Los navegadores bloquean `fetch` sobre `file://`. Usa `npm run dev` (o `node tools/serve.mjs`) y abre <http://localhost:8000>.

## ¿Por qué no sale mi página nueva en el menú?

Comprueba que:

- el archivo termina en `.md` y está dentro de `docs/`;
- ni el archivo ni ninguna carpeta del camino empiezan por `_` o `.`;
- recargaste con el servidor de `npm run dev`, o ejecutaste `npm run nav` si usas otro servidor.

## ¿Puedo cambiar el orden de las secciones?

Sí: `order` en el `_meta.json` de cada carpeta. Ver [Organizar el contenido](../guia/01-organizar-contenido.md).

## ¿Cómo oculto una página?

Renombra el archivo con un guion bajo inicial (`_borrador.md`) o muévelo a una carpeta que empiece por `_`. No aparecerá en el menú ni en el buscador, aunque seguirá siendo accesible si alguien conoce la dirección exacta.

## ¿Puedo usar mi propio logo?

Sí: copia la imagen a `assets/img/` y pon su ruta en `logo` dentro de `docs/config.json`.

## ¿Funciona en móvil?

Sí. En pantallas estrechas el menú pasa a un panel lateral que se abre con el botón ☰.

## ¿Se puede imprimir o exportar a PDF?

Usa la función de imprimir del navegador: la hoja de estilos oculta el menú y los controles al imprimir. Se imprime la página que estés viendo.

## ¿Dónde reporto un problema o propongo una mejora?

En las [incidencias del repositorio](https://github.com/jrcesara7-bit/plantilla-documentacion/issues). La guía para contribuir está en `CONTRIBUTING.md`.

---
id: faq
description: Respuestas a preguntas frecuentes sobre folderdocs: menú, URL de las páginas, ocultar páginas, logo, idiomas, impresión y SEO.
---
# Preguntas frecuentes

## ¿Por qué se rompen los enlaces al abrir los HTML directamente?

Las páginas se enlazan por carpeta (`../guia/intro/`), algo que los navegadores no pueden resolver desde `file://`. Usa `npm run dev` para previsualizar, o sirve `_site/` con cualquier servidor estático tras `npm run build`.

## ¿Por qué no sale mi página nueva en el menú?

Comprueba que:

- el archivo termina en `.md` y está dentro de `docs/`;
- ni el archivo ni ninguna carpeta del camino empiezan por `_` o `.`;
- refrescaste la página de `npm run dev` después de guardar.

## ¿Por qué la URL de una página es distinta del nombre del archivo?

Las URL se limpian: se elimina el prefijo numérico (`01-`) y los nombres se pasan a minúsculas sin acentos. `docs/primeros-pasos/01-instalacion.md` se publica en `/primeros-pasos/instalacion/`. Ver [Organizar el contenido](../guia/01-organizar-contenido.md).

## ¿Puedo cambiar el orden de las secciones?

Sí: `order` en el `_meta.json` de cada carpeta. Ver [Organizar el contenido](../guia/01-organizar-contenido.md).

## ¿Cómo oculto una página?

Renombra el archivo con un guion bajo inicial (`_borrador.md`) o muévelo a una carpeta que empiece por `_`. No se construirá, así que no saldrá en el menú, ni en el buscador ni en el sitemap.

## ¿Cómo indico la dirección del sitio para el sitemap?

En GitHub Pages se detecta sola. Con un dominio propio u otro hosting, define `site.url` en `docs/config.json` o la variable de entorno `SITE_URL`. Ver [Configuración](../personalizar/01-configuracion.md#la-url-del-sitio).

## ¿Puedo usar mi propio logo?

Sí: copia la imagen a `assets/img/` y pon su ruta en `logo` dentro del `config.json`.

## ¿Funciona en móvil?

Sí. En pantallas estrechas el menú pasa a un panel lateral que se abre con el botón ☰.

## ¿Se puede imprimir o exportar a PDF?

Usa la función de imprimir del navegador: la hoja de estilos oculta el menú y los controles al imprimir. Se imprime la página que estés viendo.

## ¿Puedo tener la documentación en varios idiomas?

Sí, con una carpeta por idioma y un selector de idioma. Ver [Idioma](../personalizar/03-idioma.md).

## ¿Dónde reporto un problema o propongo una mejora?

En las [incidencias del repositorio](https://github.com/jrcesara7-bit/folderdocs/issues). La guía para contribuir está en `CONTRIBUTING.md`.

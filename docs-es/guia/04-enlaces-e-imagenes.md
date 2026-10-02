---
id: links
description: Enlaza entre páginas y añade imágenes y archivos descargables con rutas relativas que también funcionan en GitHub.
---
# Enlaces e imágenes

## Enlaces entre páginas

Escribe rutas relativas al archivo actual, con la extensión `.md`. Así también funcionan al verlos en GitHub:

```markdown
[Instalación](../empezar/01-instalacion.md)
[Una sección de esta página](#imagenes)
[Una sección de otra página](02-sintaxis-markdown.md#avisos)
```

[Ejemplo: ir a la sintaxis](02-sintaxis-markdown.md#avisos).

Un enlace a una carpeta que tenga `index.md` (por ejemplo `../api/`) abre esa página.

> [!TIP]
> La compilación comprueba todos los enlaces internos. Un enlace a una página o archivo que no existe aparece como aviso, y `npm run build -- --strict` (que usa el flujo de GitHub Pages) se detiene con un error en lugar de publicar un enlace roto.

## Enlaces externos

Los enlaces a otras webs se abren en una pestaña nueva y llevan un pequeño icono: [Markdown en MDN](https://developer.mozilla.org/es/docs/Learn/Common_questions/Writing_a_simple_page_in_HTML).

## Imágenes

Guarda las imágenes dentro de `docs/` (por ejemplo `docs/img/`) y refiérelas con una ruta relativa al `.md`:

```markdown
![Descripción de la imagen](../img/captura.png)
```

Las imágenes se copian al sitio y se cargan de forma diferida. Nunca desbordan la columna.

> [!TIP]
> Escribe siempre el texto alternativo: ayuda a la accesibilidad y a los buscadores, y se muestra si la imagen no carga.

## Archivos para descargar

Un enlace relativo a un archivo que no sea `.md` (por ejemplo un PDF) apunta al archivo copiado:

```markdown
[Descargar manual](../archivos/manual.pdf)
```

## Anclas de encabezados

Cada encabezado recibe un identificador automático (minúsculas, sin tildes, guiones). Al pasar el ratón sobre un título aparece `¶` para copiar el enlace directo a esa sección.

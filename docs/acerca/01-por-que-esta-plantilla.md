# Por qué esta plantilla

Hay muy buenas herramientas de documentación. Esta ocupa un espacio concreto: **tener un sitio de documentación presentable escribiendo solo Markdown, sin instalar ni compilar nada**.

## Lo que busca

- Que crear una página sea crear un archivo.
- Que el menú no se mantenga a mano.
- Que se pueda leer y modificar entero en una tarde: son tres archivos propios (`app.js`, `theme.css`, `build-nav.mjs`).
- Que se vea cuidado desde el primer día, con un estilo cercano a Read the Docs.

## Comparación con otras opciones

| | Plantilla Docs | Docsify | MkDocs | Docusaurus / VitePress |
| --- | --- | --- | --- | --- |
| Paso de compilación | No | No | Sí | Sí |
| Necesita instalar | Node (solo para el servidor local) | Nada (CDN) o npm | Python | Node + dependencias |
| Menú | Automático desde carpetas | Manual (`_sidebar.md`) | Automático o manual | Automático o manual |
| Una página HTML por documento (SEO) | No | No | Sí | Sí |
| Ecosistema de temas y plugins | No | Sí | Muy amplio | Muy amplio |
| Documentación versionada / multiidioma | No | Limitado | Sí | Sí |

Las filas de las otras herramientas son una orientación general: consulta su documentación para el detalle actual.

## Cuándo elegirla

- Quieres la solución más ligera posible y no te importa que las páginas no se indexen una a una.
- Quieres entender y modificar el código sin aprender un framework.
- Quieres un punto de partida limpio para un proyecto personal o de equipo.

## Cuándo no

- Documentación pública cuyo tráfico depende de buscadores.
- Necesitas versiones de la documentación, varios idiomas integrados o un ecosistema de plugins.

## Créditos

- [marked](https://github.com/markedjs/marked) (MIT) convierte el Markdown.
- [highlight.js](https://highlightjs.org) (BSD-3-Clause) colorea el código.
- La estética está inspirada en la documentación de Godot y en el tema Read the Docs. No se usa ningún recurso gráfico de ellos.

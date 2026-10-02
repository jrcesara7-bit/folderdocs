---
id: why
description: Cómo se compara folderdocs con Docsify, MkDocs, Docusaurus y VitePress, y cuándo conviene cada una.
---
# Por qué folderdocs

Hay muy buenas herramientas de documentación. Esta ocupa un espacio concreto: **un sitio de documentación presentable y amigable con los buscadores, hecho solo con archivos Markdown y carpetas, con casi nada que configurar**.

## Lo que busca

- Que crear una página sea crear un archivo; el menú y las URL siguen tus carpetas.
- Que se pueda leer y modificar entero en una tarde: el generador son unos pocos archivos pequeños en `tools/lib/`, más una hoja de estilos y un script corto.
- Que se vea cuidado desde el primer día, con un estilo cercano a Read the Docs.
- Que envíe al navegador HTML terminado, de modo que las páginas son rápidas y se leen incluso sin JavaScript.

## Comparación con otras opciones

| | folderdocs | Docsify | MkDocs | Docusaurus / VitePress |
| --- | --- | --- | --- | --- |
| Cómo se construyen las páginas | HTML estático al compilar | En el navegador | HTML estático al compilar | HTML estático al compilar |
| Necesita instalar | Node | Nada (CDN) o npm | Python | Node + dependencias |
| Menú | Automático desde carpetas | Manual (`_sidebar.md`) | Automático o manual | Automático o manual |
| Una página HTML por documento (SEO) | Sí | No | Sí | Sí |
| Ecosistema de temas y plugins | No | Sí | Muy amplio | Muy amplio |
| Documentación versionada | No | Limitado | Sí | Sí |
| Multiidioma | Una carpeta por idioma, con selector incluido | Limitado | Sí | Sí |
| Dependencias que instalar | Ninguna (las librerías van incluidas) | Ninguna | Varias | Muchas |

Las filas de las otras herramientas son una orientación general: consulta su documentación para el detalle actual.

## Cuándo elegirla

- Quieres un generador ligero y legible, con buenos valores por defecto y sin framework que aprender.
- Quieres entender y modificar el código tú mismo.
- Quieres un punto de partida limpio para un sitio personal, de equipo o de un proyecto pequeño.

## Cuándo no

- Necesitas versiones de la documentación, un ecosistema de plugins o componentes integrados avanzados (pestañas, diagramas, consolas de API…). Mira MkDocs Material, Docusaurus o VitePress.
- Necesitas una búsqueda que escale a miles de páginas o tolere erratas.

## Créditos

- [marked](https://github.com/markedjs/marked) (MIT) convierte el Markdown.
- [highlight.js](https://highlightjs.org) (BSD-3-Clause) colorea el código.
- La estética está inspirada en la documentación de Godot y en el tema Read the Docs. No se usa ningún recurso gráfico de ellos.

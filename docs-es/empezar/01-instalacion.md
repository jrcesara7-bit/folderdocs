---
id: install
description: Instala folderdocs, la plantilla de documentación en Markdown: clónala, arranca el servidor local y ve tu sitio en un minuto.
---
# Instalación

folderdocs es una carpeta de archivos Markdown más un pequeño script de construcción. Necesitas **Node.js 18 o superior** para previsualizar y compilar el sitio; el resultado publicado son archivos estáticos, así que tu servidor no necesita Node.

## Opción A: usar como plantilla de GitHub

1. Abre el [repositorio](https://github.com/jrcesara7-bit/folderdocs) y pulsa **Use this template** → **Create a new repository**.
2. Clona tu copia:

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

## Opción B: clonar y empezar de cero

```bash
git clone https://github.com/jrcesara7-bit/folderdocs.git mi-documentacion
cd mi-documentacion
rm -rf .git && git init
```

## Ver el sitio en local

```bash
npm run dev        # o: node tools/serve.mjs
```

Abre <http://localhost:8000> (el español está en <http://localhost:8000/es/>). El servidor construye el sitio en memoria y lo reconstruye cada vez que guardas un archivo, así que basta con refrescar el navegador.

> [!WARNING]
> No abras los archivos HTML generados con doble clic (`file://`): los enlaces entre páginas no se resolverían. Usa siempre `npm run dev` para previsualizar y `npm run build` para generar los archivos que publicas.

> [!TIP]
> El puerto se cambia así: `node tools/serve.mjs 3000`.

Siguiente paso: [la estructura del proyecto](02-estructura-del-proyecto.md).

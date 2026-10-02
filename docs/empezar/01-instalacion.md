# Instalación

La plantilla es una carpeta con archivos estáticos. Solo necesitas **Node.js 18 o superior** para el servidor de desarrollo, que además regenera el menú; para publicar no hace falta Node en el servidor.

## Opción A: usar como plantilla de GitHub

1. Abre el [repositorio](https://github.com/jrcesara7-bit/plantilla-documentacion) y pulsa **Use this template** → **Create a new repository**.
2. Clona tu copia:

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

## Opción B: clonar y empezar de cero

```bash
git clone https://github.com/jrcesara7-bit/plantilla-documentacion.git mi-documentacion
cd mi-documentacion
rm -rf .git && git init
```

## Ver el sitio en local

```bash
npm run dev        # o: node tools/serve.mjs
```

Abre <http://localhost:8000>. Cada vez que recargues, el menú se regenera a partir de las carpetas de `docs/`.

> [!WARNING]
> No abras `index.html` con doble clic. Los navegadores bloquean la lectura de archivos locales (`file://`) y verías un error. Usa siempre el servidor local.

> [!TIP]
> El puerto se cambia así: `node tools/serve.mjs 3000`.

Siguiente paso: [la estructura del proyecto](02-estructura-del-proyecto.md).

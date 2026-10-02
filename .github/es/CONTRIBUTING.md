# Contribuir

*[Read in English](../../CONTRIBUTING.md)*

Gracias por querer mejorar esta plantilla. Las contribuciones pequeñas y enfocadas son las más fáciles de revisar.

## Antes de empezar

- Para dudas de uso, usa [Discussions](https://github.com/jrcesara7-bit/folderdocs/discussions).
- Para errores y propuestas, abre una [incidencia](https://github.com/jrcesara7-bit/folderdocs/issues/new/choose) y describe el caso. Si el cambio es grande, conviene comentarlo antes de escribir código.
- Es un proyecto pequeño y mantenido en el tiempo libre: puede tardar en responder.

## Principios del proyecto

Una propuesta encaja mejor si respeta esto:

1. **Poco que aprender y nada que instalar**: un comando para previsualizar, otro para construir, sin dependencias que `npm install`.
2. **Sin dependencias nuevas.** `marked` y `highlight.js` son las únicas, copiadas en `tools/vendor/` y usadas solo al construir.
3. **Pocas piezas propias**: el generador de `tools/lib/`, `theme.css` y `site.js` deben poder leerse enteros.
4. **Los colores van en variables** de `theme.css`, para ambos temas.

## Preparar el entorno

Necesitas Node.js 18 o superior.

```bash
git clone https://github.com/TU-USUARIO/folderdocs.git
cd folderdocs
npm run dev        # http://localhost:8000
npm test
```

## Enviar un cambio

1. Crea una rama a partir de `main`: `git checkout -b mi-cambio`.
2. Haz el cambio, con pruebas si toca `tools/`.
3. Ejecuta `npm test` y `npm run build -- --strict`.
4. Prueba en el navegador (`npm run dev`), en tema oscuro y claro, y en ancho móvil si el cambio es visual.
5. Añade una línea en `CHANGELOG.md`, bajo `[Sin publicar]`.
6. Abre la solicitud de cambio y rellena la plantilla.

## Documentación en dos idiomas

El inglés (`docs/`) es la versión principal y el español (`docs-es/`) su traducción. Si cambias una página, actualiza también el otro idioma o indica en la solicitud de cambio que la traducción queda pendiente.

## Estilo

- JavaScript sin transpilar: ES modules en `tools/` y un IIFE pequeño en `assets/js/site.js`. Las páginas generadas deben funcionar sin JavaScript; `site.js` solo las mejora.
- Respeta `.editorconfig` (UTF-8, LF, 2 espacios).
- Comentarios para explicar el *porqué*, no el *qué*.
- Mensajes de commit en imperativo y concretos: «Corrige el orden de carpetas con prefijo numérico».

## Dependencias incluidas

Para actualizar `marked` o `highlight.js`, reemplaza el archivo de `tools/vendor/` por la versión nueva desde su paquete oficial, comprueba que la demo sigue funcionando y anota la versión en el commit.

## Licencia

Al contribuir aceptas que tu aportación se publique bajo la licencia [MIT](../../LICENSE) del proyecto.

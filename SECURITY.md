# Política de seguridad

## Reportar una vulnerabilidad

No abras una incidencia pública. Usa el aviso privado de GitHub:
**Security → Report a vulnerability** en este repositorio.

Intentaré responder en unos días. Esto es un proyecto mantenido por una sola persona, así que no hay plazos garantizados, pero se atienden con prioridad.

## Qué se considera en alcance

- Ejecución de código o inyección de HTML/JavaScript provocada por la plantilla en sí (`assets/js/app.js`, `tools/`).
- Lectura de archivos fuera del proyecto en `tools/serve.mjs`.

## Fuera de alcance

- El HTML que escribes tú dentro de tus `.md` se inserta sin filtrar **por diseño** (lo necesitan los recuadros de portada). Publica solo contenido en el que confíes y revisa los cambios de colaboradores externos.
- `tools/serve.mjs` es un servidor de **desarrollo**: no lo expongas a Internet.
- Vulnerabilidades en `marked` o `highlight.js` (copiados en `assets/vendor/`): repórtalas a esos proyectos. Si afectan a la plantilla, avísame para actualizar la copia incluida.

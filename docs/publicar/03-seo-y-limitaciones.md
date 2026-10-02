# SEO y limitaciones

Conviene saberlo antes de elegir esta plantilla.

## Cómo se publica el contenido

El navegador descarga `index.html`, y un script lee el `.md` de la página pedida y lo convierte en HTML. La dirección de cada página usa un fragmento (`#/guia/02-sintaxis-markdown`).

## Qué implica para los buscadores

> [!WARNING]
> Los buscadores tratan todo lo que va tras `#` como la misma URL. Para ellos, el sitio es **una sola página**, así que las páginas de tu documentación no se indexan ni aparecen por separado en los resultados.

Lo que sí funciona:

- La portada se indexa con el título y la descripción de `index.html`.
- Compartir enlaces en redes muestra la vista previa de `og:title`, `og:description` y `og:image` (la del sitio entero, no la de cada página).
- Dentro del sitio, el buscador del menú encuentra cualquier página.

## Cuándo es un buen encaje

- Documentación de un proyecto o librería que la gente alcanza desde el README o el repositorio.
- Manuales internos, de equipo o de producto.
- Apuntes, guías personales y wikis pequeñas.
- Prototipos de documentación que luego puedes migrar.

## Cuándo elegir otra herramienta

Si necesitas que **cada página** salga en Google (documentación pública que capta tráfico orgánico), usa un generador que produzca un HTML por página: MkDocs, Docusaurus, VitePress, Astro Starlight… Tus `.md` se reutilizan casi sin cambios.

## Otras limitaciones

- Requiere JavaScript activado.
- La portada (`index.md`) no entra en el buscador.
- Sin versionado de documentación ni selector de idioma (ver [Idioma](../personalizar/03-idioma.md)).
- El buscador es de texto simple: no hace coincidencias aproximadas ni ordena por relevancia semántica.
- El HTML de los `.md` no se filtra: no es apto para recibir contenido de usuarios desconocidos.

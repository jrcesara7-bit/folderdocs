# Idioma

La interfaz (buscador, botones, títulos de los avisos, mensajes de error) está disponible en español e inglés. Se elige en `docs/config.json`:

```json
{ "site": { "lang": "en" } }
```

También se ajusta el atributo `lang` del documento. Si el idioma no existe, se usa inglés.

> [!NOTE]
> El idioma de la interfaz es independiente del contenido: tus `.md` pueden estar en cualquier idioma.

## Añadir otro idioma

Los textos están en el objeto `I18N` al inicio de `assets/js/app.js`. Copia el bloque `en`, cámbiale el código y traduce los valores:

```js
const I18N = {
  es: { /* … */ },
  en: { /* … */ },
  fr: { search: 'Rechercher dans la documentation', /* … */ },
};
```

Cualquier clave que falte en tu idioma se muestra en inglés, así que puedes traducir de forma progresiva.

## Un sitio en varios idiomas

Este repositorio publica **el inglés en la raíz y el español en `/es/`**, y tú puedes hacer lo mismo:

1. Mantén una carpeta de documentación por idioma: `docs/` (inglés) y `docs-es/` (español). Cada una tiene su propio `config.json`, `nav.json` y páginas.
2. Añade una página de entrada por cada idioma extra: `es/index.html`, una copia de `index.html` que apunta a la otra carpeta mediante el atributo `data-docs`:

```html
<html lang="es" data-theme="dark" data-docs="../docs-es">
```

   Ajusta las rutas de los recursos en esa copia (`../assets/…`).
3. Añade la lista `languages` a cada `config.json` para que aparezca un selector en el pie del menú. Los `href` son relativos al `index.html` de cada idioma:

```json
// docs/config.json (inglés, servido en /)
"languages": [{ "label": "EN", "href": "./" }, { "label": "ES", "href": "es/" }]

// docs-es/config.json (español, servido en /es/)
"languages": [{ "label": "EN", "href": "../" }, { "label": "ES", "href": "./" }]
```

4. Las herramientas encuentran todas las carpetas llamadas `docs` o `docs-*` y cada carpeta de entrada de idioma, así que `npm run dev`, `npm run nav` y `npm run build` atienden todos los idiomas sin configuración extra.

> [!TIP]
> Para añadir francés, crea `docs-fr/` y `fr/index.html` del mismo modo. Para quitar un idioma, borra sus dos carpetas y su entrada en `languages`.

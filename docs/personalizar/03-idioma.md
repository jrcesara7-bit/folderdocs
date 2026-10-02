# Idioma

La interfaz (buscador, botones, títulos de los avisos, mensajes de error) está disponible en español e inglés. Se elige en `docs/config.json`:

```json
{ "site": { "lang": "en" } }
```

También se ajusta el atributo `lang` del documento. Si el idioma no existe, se usa español.

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

Cualquier clave que falte en tu idioma se muestra en español, así que puedes traducir de forma progresiva.

## Sitios con varios idiomas

La plantilla no tiene selector de idioma. Si necesitas documentación en dos idiomas, lo más simple es **un sitio por idioma** (dos copias del repositorio, o una carpeta aparte con su propio `index.html`).

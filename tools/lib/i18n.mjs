/* Interface strings. To add a language, copy a block and use its code in `site.lang`
 * of that language's config.json. Missing strings fall back to English. */
export const I18N = {
  en: {
    siteName: 'Documentation', home: 'Home', skip: 'Skip to content',
    search: 'Search the docs', searchLabel: 'Search', noResults: 'No results.',
    menu: 'Open menu', theme: 'Toggle theme', contents: 'Contents', language: 'Language',
    edit: '✎ Edit on GitHub', contribute: 'Learn how to contribute!', anchor: 'Link to this section',
    copy: 'Copy', copied: 'Copied!', copyError: 'Error',
    note: 'Note', tip: 'Tip', important: 'Important', warning: 'Warning', caution: 'Caution',
    notFound: 'Page not found',
    notFoundBody: 'The page you are looking for does not exist or has moved.',
    backHome: 'Back to home',
    prev: 'Previous', next: 'Next',
  },
  es: {
    siteName: 'Documentación', home: 'Inicio', skip: 'Saltar al contenido',
    search: 'Buscar en la documentación', searchLabel: 'Buscar', noResults: 'Sin resultados.',
    menu: 'Abrir menú', theme: 'Cambiar tema', contents: 'Contenido', language: 'Idioma',
    edit: '✎ Editar en GitHub', contribute: '¡Aprende cómo contribuir!', anchor: 'Enlace a esta sección',
    copy: 'Copiar', copied: '¡Copiado!', copyError: 'Error',
    note: 'Nota', tip: 'Consejo', important: 'Importante', warning: 'Advertencia', caution: 'Precaución',
    notFound: 'Página no encontrada',
    notFoundBody: 'La página que buscas no existe o ha cambiado de dirección.',
    backHome: 'Volver al inicio',
    prev: 'Anterior', next: 'Siguiente',
  },
};

/** Returns a translator `t(key)` for a language code such as "en", "es" or "es-MX". */
export function translator(lang) {
  const code = String(lang || 'en').toLowerCase().split('-')[0];
  const strings = I18N[code] || I18N.en;
  return (key) => (strings[key] !== undefined ? strings[key] : I18N.en[key]);
}

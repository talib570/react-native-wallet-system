import i18n from 'i18n-js';
// Set the key-value pairs for the different languages you want to support.

// Set the locale once at the beginning of your app.

export default function initialize(locale , shouldSupportFallbacks) {
    i18n.translations = {
        "en-US": require('./translations/en.json'),
        "fr-FR": require('./translations/fr.json'),
    };
    i18n.locale = locale;
    i18n.fallbacks = shouldSupportFallbacks;
  }
export function getString(key) {
    return i18n.t(key);
}
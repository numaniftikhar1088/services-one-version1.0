import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

const fallbackLng = ["en"];
const availableLanguages = ["en", "es", "pt","fr"];

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng,
    detection: {
      checkWhitelist: true,
    },
    backend: {
      loadPath: "https://truemedpo.blob.core.windows.net/locales/{{lng}}_translation.json",
      crossDomain: true,
    },
    debug: false,
    whitelist: availableLanguages,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

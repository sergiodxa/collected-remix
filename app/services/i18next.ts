import i18next, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";

export function init(options?: InitOptions) {
  return i18next.use(initReactI18next).init({
    ...options,
    supportedLngs: ["es", "en"],
    defaultNS: "common",
    fallbackLng: "en",
    react: { useSuspense: false },
  });
}

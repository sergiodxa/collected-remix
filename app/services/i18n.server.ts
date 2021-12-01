import { createCookie } from "remix";
import { Backend, RemixI18Next } from "remix-i18next";

class InMemoryBackend implements Backend {
  constructor(
    private readonly data: {
      [locale: string]: {
        [namespace: string]: {
          [key: string]: string;
        };
      };
    }
  ) {}

  async getTranslations(namespace: string, locale: string) {
    return this.data[locale][namespace];
  }
}

let backend = new InMemoryBackend({
  en: {
    common: {},
  },
  es: {
    common: {
      "Collected notes": "Collected notes",
      "Sign in to your account": "Iniciar sesión en su cuenta",
      "Email address": "Dirección de correo",
      Token: "Token",
      "Get your Collected Notes token": "Obtener su token de Collected Notes",
      "Sign In": "Iniciar sesión",
      Features: "Características",
      Blog: "Blog",
      Pricing: "Precio",
      About: "Acerca de",
      "Sign Out": "Cerrar sesión",
      "<1>Your Markdown</1> <2>notes on the internet</2>":
        "<1>Sus notas en Markdown</1> <2>en Internet</2>",
      "A fully native app that allows you to publish your notes on the internet instantly. Plus an API and much more.":
        "Una aplicación nativa que le permite publicar sus notas en Internet de forma instantánea. Además, una API y mucho más.",
      "Read full story": "Leer historia completa",
      Previous: "Anterior",
      Next: "Siguiente",
      "Sign in to Collected Notes": "Iniciar sesión en Collected Notes",
      "Your Markdown notes on the internet":
        "Sus notas en Markdown en Internet",
    },
  },
});

export let cookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  secrets: [process.env.SESSION_SECRET ?? "s3cr3t"],
});

export let i18n = new RemixI18Next(backend, {
  fallbackLng: "en",
  supportedLanguages: ["es", "en"],
  cookie,
});

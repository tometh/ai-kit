export * from "./types";
export { TranslationProvider } from "./components/TranslationProvider";
export { useTranslation } from "./hooks/useTranslation";
export { loadLocales } from "./utils/loadLocales";
export { createResourcesFromModules } from "./utils/createResourcesFromModules";
export { Trans } from "react-i18next";

export type Language = "en" | "zh" | "ja" | "ko" | "fr" | "de" | "es";

export interface TranslationConfig {
  model: "chatgpt" | "grok" | "deepseek";
  apiKey: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  baseUrl?: string;
}

export interface TranslationResult {
  text: string;
  from: Language;
  to: Language;
}

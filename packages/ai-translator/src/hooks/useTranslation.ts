import { useContext, useCallback } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import { TranslationContext } from "../components/TranslationProvider";
import { Language, TranslationResult } from "../types";

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  const { t, i18n } = useI18nTranslation();

  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  const { translate: translateText, isLoading } = context;

  const setLanguage = useCallback(
    (language: Language) => {
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  return {
    t,
    translate: translateText,
    currentLanguage: i18n.language as Language,
    setLanguage,
    isLoading,
    i18nReady: true,
  };
};

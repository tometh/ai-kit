import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  TranslationProviderProps,
  TranslationContextType,
  Language,
  TranslationResult,
  TranslationConfig,
} from "../types";
import { TranslationService } from "../services/TranslationService";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nextProvider } from "react-i18next";

export const TranslationContext = createContext<TranslationContextType | null>(
  null
);

const LANGUAGE_STORAGE_KEY = "ai-translator-language";

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  config,
  children,
  resources,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    config.targetLanguage
  );
  const [isLoading, setIsLoading] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
  const translationService = new TranslationService({
    ...config,
    targetLanguage: currentLanguage,
  });

  useEffect(() => {
    // 从 localStorage 获取保存的语言，如果没有则使用配置中的目标语言
    const savedLanguage = localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    ) as Language;
    const initialLanguage = savedLanguage || config.targetLanguage;

    i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage,
        fallbackLng: config.sourceLanguage,
        interpolation: {
          escapeValue: false,
        },
      })
      .then(() => {
        setI18nReady(true);
      });
  }, [config.sourceLanguage, config.targetLanguage, resources]);

  // 监听语言变化并保存到 localStorage
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const translate = useCallback(
    async (text: string): Promise<TranslationResult> => {
      setIsLoading(true);
      try {
        const result = await translationService.translate(text);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [translationService]
  );

  const setLanguage = useCallback(
    (lang: Language) => {
      setCurrentLanguage(lang);
      i18n.changeLanguage(lang);
      translationService.updateConfig({
        ...config,
        targetLanguage: lang,
      });
    },
    [config]
  );

  const value: TranslationContextType = {
    translate,
    currentLanguage,
    setLanguage,
    isLoading,
    t: i18n.t,
    i18nReady,
  };

  if (!i18nReady) {
    return null;
  }

  return (
    <TranslationContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </TranslationContext.Provider>
  );
};

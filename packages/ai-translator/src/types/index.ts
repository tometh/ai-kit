export type TranslationModel = "grok" | "chatgpt" | "deepseek";
export type Language = "en" | "zh" | "ja" | "ko";

export interface TranslationConfig {
  model: TranslationModel;
  apiKey: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  baseUrl?: string;
}

export interface TranslationResult {
  text: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  model: TranslationModel;
  timestamp: number;
}

export interface TranslationContextType {
  translate: (text: string) => Promise<TranslationResult>;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
  t: (key: string, options?: any) => string;
  i18nReady: boolean;
}

export interface TranslationProviderProps {
  config: TranslationConfig;
  children: React.ReactNode;
  resources: any;
}

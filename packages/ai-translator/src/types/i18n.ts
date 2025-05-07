/**
 * Translation key metadata type
 */
export interface TranslationMetadata {
  /** Pluralization count variable name */
  count?: string;
  /** Context information */
  context?: string;
  /** Namespace */
  ns?: string;
  /** Default value */
  defaultValue?: string;
  /** Interpolation variables */
  interpolation?: Record<string, string>;
}

/**
 * Extracted translation key information
 */
export interface ExtractedKey {
  /** Translation key */
  key: string;
  /** Metadata */
  metadata?: TranslationMetadata;
  /** File path */
  filePath?: string;
  /** Line number */
  line?: number;
  /** Column number */
  column?: number;
}

/**
 * Translation options
 */
export interface TranslationOptions {
  /** Namespace */
  ns?: string;
  /** Default value */
  defaultValue?: string;
  /** Context */
  context?: string;
  /** Pluralization */
  count?: number;
  /** Interpolation variables */
  [key: string]: any;
}

/**
 * Translation function type
 */
export interface TranslationFunction {
  (key: string, options?: TranslationOptions): string;
  (key: string, defaultValue?: string, options?: TranslationOptions): string;
}

/**
 * Translation resource type
 */
export interface TranslationResources {
  [key: string]:
    | string
    | {
        [namespace: string]: {
          [key: string]: string;
        };
      };
}

/**
 * Translation configuration options
 */
export interface TranslationConfig {
  /** Default language */
  defaultLanguage: string;
  /** Supported language list */
  supportedLanguages: string[];
  /** Default namespace */
  defaultNamespace: string;
  /** Resource file path */
  resourcesPath: string;
  /** Whether to enable debug mode */
  debug?: boolean;
  /** Whether to enable fallback language */
  fallbackLng?: string;
  /** Whether to enable namespace */
  ns?: string[];
  /** Whether to enable context */
  context?: boolean;
  /** Whether to enable pluralization */
  plural?: boolean;
  /** Whether to enable interpolation */
  interpolation?: {
    prefix?: string;
    suffix?: string;
  };
}

export type Language =
  | "en"
  | "zh"
  | "zh-TW"
  | "ja"
  | "ko"
  | "fr"
  | "de"
  | "es"
  | "it"
  | "pt"
  | "ru"
  | "ar"
  | "tr"
  | "vi"
  | "th"
  | "id"
  | "hi"
  | "ms"
  | "fa"
  | "he"
  | "pl"
  | "nl"
  | "sv"
  | "fi"
  | "da"
  | "no"
  | "cs"
  | "el"
  | "hu"
  | "ro";

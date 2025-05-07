# ai-translator

## Repository

- [GitHub Repository](https://github.com/tometh/ai-kit/tree/main/packages/ai-translator)

## Introduction

`ai-translator` is a React internationalization translation toolkit based on multiple AI models (such as ChatGPT, Grok, and DeepSeek), supporting multi-language batch translation, automatic extraction of translation keys, command-line batch processing, type safety, and high extensibility.

---

## Features

- Supports multiple AI translation models (ChatGPT, Grok, DeepSeek)
- Supports mutual translation for 30+ commonly used languages
- Supports automatic extraction of translation keys from React components and `t()` functions
- Provides CLI tools for batch translation and key extraction
- Type-safe and easily extensible
- Supports multiple runtime environments (Node.js, Vite, Webpack)

---

## Installation

```bash
npm install ai-translator
# or
pnpm add ai-translator
```

---

## Usage in React

```tsx
import { TranslationProvider, useTranslation } from "ai-translator";

function App() {
  return (
    <TranslationProvider
      config={{
        model: "chatgpt", // Supports chatgpt/grok/deepseek
        apiKey: "your-api-key",
        sourceLanguage: "en",
        targetLanguage: "zh",
      }}
    >
      <YourComponent />
    </TranslationProvider>
  );
}

function YourComponent() {
  const { translate, currentLanguage, setLanguage, isLoading } =
    useTranslation();

  const handleTranslate = async () => {
    const result = await translate("Hello, world!");
    console.log(result.text); // 你好，世界！
  };

  return (
    <div>
      <button onClick={handleTranslate} disabled={isLoading}>
        {isLoading ? "Translating..." : "Translate"}
      </button>
    </div>
  );
}
```

---

## CLI Usage

### Extract Translation Keys and Auto-Translate

```bash
npx ai-translator extract -i "src/**/*.{ts,tsx,js,jsx}" -o locales/en.json --translate -l zh ja ko fr de es ...
```

### Directly Translate Files or Directories

```bash
npx ai-translator translate -f ./locales/en.json -m chatgpt -s en -t zh ja ko
npx ai-translator translate -d ./locales -m deepseek -s en -t fr de es
```

### Extract and Translate in One Step

```bash
npx ai-translator i18n -i "src/**/*.{ts,tsx,js,jsx}" -o locales/en.json -m grok -s en -t zh ja ko fr de es
```

---

## Supported Languages

- English (en), Simplified Chinese (zh), Traditional Chinese (zh-TW), Japanese (ja), Korean (ko)
- French (fr), German (de), Spanish (es), Italian (it), Portuguese (pt)
- Russian (ru), Arabic (ar), Turkish (tr), Vietnamese (vi), Thai (th)
- Indonesian (id), Hindi (hi), Malay (ms), Persian (fa), Hebrew (he)
- Polish (pl), Dutch (nl), Swedish (sv), Finnish (fi), Danish (da)
- Norwegian (no), Czech (cs), Greek (el), Hungarian (hu), Romanian (ro)

---

## API Reference

### TranslationProvider Props

| Prop   | Type              | Required | Description               |
| ------ | ----------------- | -------- | ------------------------- |
| config | TranslationConfig | Yes      | Translation configuration |

### TranslationConfig

| Prop           | Type                              | Required | Description          |
| -------------- | --------------------------------- | -------- | -------------------- |
| model          | 'grok' \| 'chatgpt' \| 'deepseek' | Yes      | AI translation model |
| apiKey         | string                            | Yes      | API key              |
| sourceLanguage | string                            | Yes      | Source language      |
| targetLanguage | string                            | Yes      | Target language      |
| baseUrl        | string                            | No       | API base URL         |

### useTranslation Hook

Returns:

| Prop            | Type                                         | Description         |
| --------------- | -------------------------------------------- | ------------------- |
| translate       | (text: string) => Promise<TranslationResult> | Translate text      |
| currentLanguage | Language                                     | Current language    |
| setLanguage     | (lang: Language) => void                     | Set language        |
| isLoading       | boolean                                      | Whether translating |

---

## Environment Variables

- `AI_TRANSLATOR_API_KEY`: API key for AI model

---

## License

MIT

---

For detailed documentation, secondary development, or enterprise customization, please contact the imtom.eth@gmail.com.

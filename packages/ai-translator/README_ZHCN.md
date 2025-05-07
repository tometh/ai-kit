# ai-translator

## 简介

`ai-translator` 是一个基于多种 AI 大模型（如 ChatGPT、Grok、DeepSeek）的 React 国际化翻译工具包，支持多语言批量翻译、自动提取翻译 key、命令行批量处理、类型安全和高度可扩展。

---

## Features / 特性

- 支持多种 AI 翻译模型（ChatGPT、Grok、DeepSeek）
- 支持 30+ 种常用语言互译
- 支持 React 组件和 t() 函数的 key 自动提取
- 提供 CLI 命令行工具，支持批量翻译和 key 提取
- 类型安全，易于扩展
- 支持多种运行环境（Node.js、Vite、Webpack）

---

## Installation / 安装

```bash
npm install ai-translator
# 或
pnpm add ai-translator
```

---

## Usage in React / React 组件用法

```tsx
import { TranslationProvider, useTranslation } from "ai-translator";

function App() {
  return (
    <TranslationProvider
      config={{
        model: "chatgpt", // 支持 chatgpt/grok/deepseek
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

## CLI Usage / 命令行用法

### 提取翻译 key 并自动翻译

```bash
npx ai-translator extract -i "src/**/*.{ts,tsx,js,jsx}" -o locales/en.json --translate -l zh ja ko fr de es ...
```

### 直接翻译文件或目录

```bash
npx ai-translator translate -f ./locales/en.json -m chatgpt -s en -t zh ja ko
npx ai-translator translate -d ./locales -m deepseek -s en -t fr de es
```

### 一步提取并翻译

```bash
npx ai-translator i18n -i "src/**/*.{ts,tsx,js,jsx}" -o locales/en.json -m grok -s en -t zh ja ko fr de es
```

---

## Supported Languages / 支持的语言

- 英语（en）、简体中文（zh）、繁体中文（zh-TW）、日语（ja）、韩语（ko）
- 法语（fr）、德语（de）、西班牙语（es）、意大利语（it）、葡萄牙语（pt）
- 俄语（ru）、阿拉伯语（ar）、土耳其语（tr）、越南语（vi）、泰语（th）
- 印尼语（id）、印地语（hi）、马来语（ms）、波斯语（fa）、希伯来语（he）
- 波兰语（pl）、荷兰语（nl）、瑞典语（sv）、芬兰语（fi）、丹麦语（da）
- 挪威语（no）、捷克语（cs）、希腊语（el）、匈牙利语（hu）、罗马尼亚语（ro）

---

## API Reference / API 参考

### TranslationProvider Props

| 属性/Prop | 类型/Type         | 必填/Required | 说明/Description            |
| --------- | ----------------- | ------------- | --------------------------- |
| config    | TranslationConfig | 是/Yes        | 翻译配置/Translation config |

### TranslationConfig

| 属性/Prop      | 类型/Type                         | 必填/Required | 说明/Description                 |
| -------------- | --------------------------------- | ------------- | -------------------------------- |
| model          | 'grok' \| 'chatgpt' \| 'deepseek' | 是/Yes        | AI 翻译模型/AI translation model |
| apiKey         | string                            | 是/Yes        | API 密钥/API key                 |
| sourceLanguage | string                            | 是/Yes        | 源语言/Source language           |
| targetLanguage | string                            | 是/Yes        | 目标语言/Target language         |
| baseUrl        | string                            | 否/No         | API 基础 URL/Base URL            |

### useTranslation Hook

返回/Returns:

| 属性/Prop       | 类型/Type                                    | 说明/Description        |
| --------------- | -------------------------------------------- | ----------------------- |
| translate       | (text: string) => Promise<TranslationResult> | 翻译文本/Translate text |
| currentLanguage | Language                                     | 当前语言/Current lang   |
| setLanguage     | (lang: Language) => void                     | 设置语言/Set language   |
| isLoading       | boolean                                      | 是否正在翻译/Loading    |

---

## 环境变量 / Environment Variables

- `AI_TRANSLATOR_API_KEY`: AI 模型的 API 密钥 / API key for AI model

---

## License / 许可证

MIT

---

如需详细文档、二次开发或企业定制，请联系 CARV 团队。

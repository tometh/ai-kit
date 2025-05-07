import { TranslationConfig, TranslationResult } from "../types";
import OpenAI from "openai";

export class TranslationService {
  private config: TranslationConfig;
  private openai: OpenAI;

  constructor(config: TranslationConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
      dangerouslyAllowBrowser: true,
    });
  }

  updateConfig(config: TranslationConfig) {
    this.config = config;
  }

  async translate(text: string): Promise<TranslationResult> {
    const { model } = this.config;

    switch (model) {
      case "chatgpt":
        return this.translateWithChatGPT(text);
      case "grok":
        return this.translateWithGrok(text);
      case "deepseek":
        return this.translateWithDeepSeek(text);
      default:
        throw new Error(`Unsupported translation model: ${model}`);
    }
  }

  private async translateWithChatGPT(text: string): Promise<TranslationResult> {
    const prompt = `Translate the following text from ${this.config.sourceLanguage} to ${this.config.targetLanguage}. Keep the original meaning and style:\n\n${text}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Please provide only the translated text without any additional explanations or notes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return {
      text: response.choices[0].message.content || "",
      sourceLanguage: this.config.sourceLanguage,
      targetLanguage: this.config.targetLanguage,
      model: "chatgpt",
      timestamp: Date.now(),
    };
  }

  private async translateWithGrok(text: string): Promise<TranslationResult> {
    const response = await fetch("https://api.x.ai/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3",
        messages: [
          {
            role: "system",
            content:
              "You are a professional translator. Please provide only the translated text without any additional explanations or notes.",
          },
          {
            role: "user",
            content: `请将下列内容从${this.config.sourceLanguage}翻译为${this.config.targetLanguage}，保持原意和风格：\n\n${text}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 100000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return {
      text: content,
      sourceLanguage: this.config.sourceLanguage,
      targetLanguage: this.config.targetLanguage,
      model: "grok",
      timestamp: Date.now(),
    };
  }

  private async translateWithDeepSeek(
    text: string
  ): Promise<TranslationResult> {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a professional translator. Please provide only the translated text without any additional explanations or notes.",
          },
          {
            role: "user",
            content: `请将下列内容从${this.config.sourceLanguage}翻译为${this.config.targetLanguage}，保持原意和风格：\n\n${text}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return {
      text: content,
      sourceLanguage: this.config.sourceLanguage,
      targetLanguage: this.config.targetLanguage,
      model: "deepseek",
      timestamp: Date.now(),
    };
  }
}

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { TranslationService } from "../services/TranslationService";
import { TranslationConfig, Language, TranslationModel } from "../types";
import { extractI18nKeys } from "../utils/extractI18nKeys";

const program = new Command();

program
  .name("ai-translator")
  .description("CLI tool for AI-powered translation")
  .version("0.1.0");

// 常用语言列表
const COMMON_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "hi", name: "Hindi" },
  { code: "ms", name: "Malay" },
  { code: "fa", name: "Persian" },
  { code: "he", name: "Hebrew" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "fi", name: "Finnish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "cs", name: "Czech" },
  { code: "el", name: "Greek" },
  { code: "hu", name: "Hungarian" },
  { code: "ro", name: "Romanian" },
];

program
  .command("extract")
  .description(
    "Extract translation keys from source code using custom AST parser"
  )
  .option(
    "-i, --input <glob>",
    "Glob pattern for source files",
    "examples/ai-translator/src/**/*.{js,jsx,ts,tsx}"
  )
  .option(
    "-o, --output <file>",
    "Output JSON file",
    "examples/ai-translator/locales/en.json"
  )
  .option(
    "-t, --translate",
    "Automatically translate to other languages after extraction",
    false
  )
  .option(
    "-l, --languages <langs...>",
    "Target languages for translation",
    COMMON_LANGUAGES.map((l) => l.code)
  )
  .action(async (options) => {
    try {
      console.log(
        chalk.blue("Extracting translation keys using custom AST parser...")
      );
      const extractedKeys = await extractI18nKeys(
        options.input,
        options.output
      );
      console.log(chalk.green("Extraction completed!"));

      // 如果指定了 --translate 选项，自动执行翻译
      if (options.translate && extractedKeys.keys.length > 0) {
        console.log(chalk.blue("\nStarting automatic translation..."));
        const config = await promptForConfig({
          model: "chatgpt",
          source: "en",
          target: options.languages,
        });

        console.log(
          chalk.yellow(`Target languages: ${options.languages.join(", ")}`)
        );
        for (const targetLang of options.languages) {
          console.log(chalk.cyan(`\nTranslating to ${targetLang}...`));
          const targetConfig = { ...config, targetLanguage: targetLang };
          await translateFile(options.output, targetConfig);
        }
        console.log(chalk.green("\nTranslation completed successfully!"));
      }
    } catch (error) {
      console.error(chalk.red("Extraction failed:"), error);
      process.exit(1);
    }
  });

program
  .command("translate")
  .description("Translate files using AI models")
  .option("-f, --file <path>", "Path to the file to translate")
  .option("-d, --dir <path>", "Directory containing files to translate")
  .option("-m, --model <model>", "Translation model (grok, chatgpt, deepseek)")
  .option("-s, --source <lang>", "Source language")
  .option("-t, --target <langs...>", "Target languages (e.g., zh ja ko)")
  .option("-r, --recursive", "Recursively search directories")
  .option(
    "-p, --pattern <pattern>",
    "File pattern to match (default: **/*.{json,ts,tsx,js,jsx})"
  )
  .action(async (options) => {
    try {
      const config = await promptForConfig(options);
      const files = await getFilesToTranslate(options);
      const targetLanguages =
        options.target || (await promptForTargetLanguages());

      console.log(chalk.blue("Starting translation process..."));
      console.log(chalk.yellow(`Found ${files.length} files to translate`));
      console.log(
        chalk.yellow(`Target languages: ${targetLanguages.join(", ")}`)
      );

      for (const file of files) {
        console.log(chalk.yellow(`\nProcessing ${file}...`));
        for (const targetLang of targetLanguages) {
          const targetConfig = { ...config, targetLanguage: targetLang };
          console.log(chalk.cyan(`Translating to ${targetLang}...`));
          await translateFile(file, targetConfig);
        }
      }

      console.log(chalk.green("\nTranslation completed successfully!"));
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program
  .command("i18n")
  .description("Extract and translate i18n keys in one command")
  .option(
    "-i, --input <glob>",
    "Glob pattern for source files",
    "src/**/*.{js,jsx,ts,tsx}"
  )
  .option("-o, --output <file>", "Output JSON file", "locales/en.json")
  .option(
    "-m, --model <model>",
    "Translation model (grok, chatgpt, deepseek)",
    "chatgpt"
  )
  .option("-s, --source <lang>", "Source language", "en")
  .option(
    "-t, --target <langs...>",
    "Target languages",
    COMMON_LANGUAGES.map((l) => l.code)
  )
  .action(async (options) => {
    try {
      // 1. 提取翻译 key
      console.log(chalk.blue("Step 1: Extracting translation keys..."));
      const extractedKeys = await extractI18nKeys(
        options.input,
        options.output
      );
      console.log(chalk.green("Extraction completed!"));

      if (extractedKeys.keys.length === 0) {
        console.log(chalk.yellow("No translation keys found."));
        return;
      }

      // 2. 执行翻译
      console.log(chalk.blue("\nStep 2: Starting translation..."));
      const config = await promptForConfig({
        model: options.model,
        source: options.source,
        target: options.target,
      });

      console.log(
        chalk.yellow(`Target languages: ${options.target.join(", ")}`)
      );
      for (const targetLang of options.target) {
        console.log(chalk.cyan(`\nTranslating to ${targetLang}...`));
        const targetConfig = { ...config, targetLanguage: targetLang };
        await translateFile(options.output, targetConfig);
      }
      console.log(chalk.green("\nTranslation completed successfully!"));
    } catch (error) {
      console.error(chalk.red("i18n process failed:"), error);
      process.exit(1);
    }
  });

// 修改 promptForConfig 里的语言选项
async function promptForConfig(options: any): Promise<TranslationConfig> {
  const questions = [
    {
      type: "input",
      name: "apiKey",
      message: "Enter your API key:",
      when: !process.env.AI_TRANSLATOR_API_KEY,
    },
    {
      type: "list",
      name: "model",
      message: "Select translation model:",
      choices: ["grok", "chatgpt", "deepseek"],
      when: !options.model,
    },
    {
      type: "list",
      name: "sourceLanguage",
      message: "Select source language:",
      choices: COMMON_LANGUAGES.map((l) => ({ name: l.name, value: l.code })),
      when: !options.source,
    },
  ];

  const answers = await inquirer.prompt(questions);

  return {
    model: (options.model || answers.model) as TranslationModel,
    apiKey: process.env.AI_TRANSLATOR_API_KEY || answers.apiKey,
    sourceLanguage: (options.source || answers.sourceLanguage) as Language,
    targetLanguage: "en", // 临时值，实际目标语言会在循环中设置
  };
}

// 修改 promptForTargetLanguages
async function promptForTargetLanguages(): Promise<Language[]> {
  const { langs } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "langs",
      message: "Select target languages:",
      choices: COMMON_LANGUAGES.map((l) => ({ name: l.name, value: l.code })),
      default: ["zh", "ja", "ko"],
    },
  ]);
  return langs;
}

async function getFilesToTranslate(options: any): Promise<string[]> {
  if (options.file) {
    return [options.file];
  }

  const dir = options.dir || process.cwd();
  const pattern = options.pattern || "**/*.{json,ts,tsx,js,jsx}";
  const files: string[] = [];

  async function scanDirectory(dirPath: string) {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && options.recursive) {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && matchesPattern(entry.name, pattern)) {
        files.push(fullPath);
      }
    }
  }

  await scanDirectory(dir);
  return files;
}

function matchesPattern(filename: string, pattern: string): boolean {
  const patternExts = pattern.split(",").map((p) => p.trim().replace("*.", ""));
  return patternExts.some((ext) => filename.endsWith(ext));
}

async function translateFile(
  filePath: string,
  config: TranslationConfig
): Promise<void> {
  const content = await fs.promises.readFile(filePath, "utf-8");
  let data: any;

  try {
    if (filePath.endsWith(".json")) {
      data = JSON.parse(content);
    } else {
      // 对于非JSON文件，提取需要翻译的文本
      data = extractTranslatableText(content);
    }
  } catch (error) {
    console.error(chalk.red(`Error parsing file ${filePath}:`), error);
    return;
  }

  const translationService = new TranslationService(config);
  const translatedData = await translateObject(data, translationService);

  // 生成翻译文件路径
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dirName = path.dirname(filePath);
  const outputPath = path.join(
    dirName,
    `${baseName}.${config.targetLanguage}${ext}`
  );

  // 保存翻译结果
  if (filePath.endsWith(".json")) {
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(translatedData, null, 2)
    );
  } else {
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(translatedData, null, 2)
    );
  }

  console.log(chalk.green(`Created translation file: ${outputPath}`));
}

function extractTranslatableText(content: string): any {
  // 提取需要翻译的文本
  // 这里可以根据项目需求自定义提取规则
  const textMatches = content.match(/(['"])(.*?)\1/g) || [];
  return textMatches.map((match) => match.slice(1, -1));
}

async function translateObject(
  obj: any,
  translationService: TranslationService
): Promise<any> {
  if (typeof obj === "string") {
    return (await translationService.translate(obj)).text;
  }

  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map((item) => translateObject(item, translationService))
    );
  }

  if (typeof obj === "object" && obj !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await translateObject(value, translationService);
    }
    return result;
  }

  return obj;
}

program.parse();

import { globSync } from "glob";
import fs from "fs";
import path from "path";
import { JSXExtractor } from "./jsx-extractor";
import { TFunctionExtractor } from "./t-function-extractor";
import type { ExtractorResult } from "../../types/extractor";
import type { TranslationResources } from "../../types/i18n";

export { extractI18nKeys };

async function extractI18nKeys(
  inputGlob: string,
  outputFile: string
): Promise<ExtractorResult> {
  const files = globSync(inputGlob);
  const keys = new Set<string>();
  const jsxExtractor = new JSXExtractor();
  const tFunctionExtractor = new TFunctionExtractor();
  const errors: ExtractorResult["errors"] = [];
  const startTime = Date.now();

  for (const file of files) {
    const sourceCode = fs.readFileSync(file, "utf-8");

    // 提取 JSX 中的翻译键
    const jsxResult = await jsxExtractor.extract({
      filePath: file,
      sourceCode,
    });
    jsxResult.keys.forEach(({ key }) => keys.add(key));
    if (jsxResult.errors) {
      errors.push(...jsxResult.errors);
    }

    // 提取 t() 函数调用中的翻译键
    const tFunctionResult = await tFunctionExtractor.extract({
      filePath: file,
      sourceCode,
    });
    tFunctionResult.keys.forEach(({ key, metadata = {} }) => {
      let fullKey = key;
      if (metadata?.count) fullKey += `, count={{${metadata.count}}}`;
      if (metadata?.context) fullKey += `, context=${metadata.context}`;
      if (metadata?.ns) fullKey += `, ns=${metadata.ns}`;
      keys.add(fullKey);
    });
    if (tFunctionResult.errors) {
      errors.push(...tFunctionResult.errors);
    }
  }

  // 确保 locales 目录存在
  const localesDir = path.dirname(outputFile);
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }

  // 读取现有的翻译文件
  let resources: TranslationResources = {};
  if (fs.existsSync(outputFile)) {
    resources = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
  }

  // 添加新的翻译键
  const newKeys = Array.from(keys);
  newKeys.forEach((k) => {
    if (!resources[k]) {
      resources[k] = k;
    }
  });

  // 写入更新后的翻译文件
  fs.writeFileSync(outputFile, JSON.stringify(resources, null, 2));

  return {
    keys: newKeys.map((key) => ({ key })),
    errors: errors.length > 0 ? errors : undefined,
    stats: {
      filesProcessed: files.length,
      keysExtracted: newKeys.length,
      processingTime: Date.now() - startTime,
      errorCount: errors.length,
    },
  };
}

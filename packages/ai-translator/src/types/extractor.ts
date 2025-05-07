import type { ExtractedKey } from "./i18n";
import type { ASTLocation } from "./ast";

export type { ExtractedKey };

/**
 * 提取器选项
 */
export interface ExtractorOptions {
  /** 文件路径 */
  filePath: string;
  /** 源代码 */
  sourceCode: string;
  /** 是否包含位置信息 */
  includeLocations?: boolean;
  /** 是否包含注释 */
  includeComments?: boolean;
  /** 是否递归提取 */
  recursive?: boolean;
}

/**
 * 提取器结果
 */
export interface ExtractorResult {
  /** 提取的键列表 */
  keys: ExtractedKey[];
  /** 提取过程中遇到的错误 */
  errors?: ExtractorError[];
  /** 提取的统计信息 */
  stats?: ExtractorStats;
}

/**
 * 提取器错误
 */
export interface ExtractorError {
  /** 错误类型 */
  type: "syntax" | "parse" | "extract" | "unknown";
  /** 错误消息 */
  message: string;
  /** 错误位置 */
  location?: ASTLocation;
  /** 原始代码 */
  code?: string;
}

/**
 * 提取器统计信息
 */
export interface ExtractorStats {
  /** 处理的文件数 */
  filesProcessed: number;
  /** 提取的键数 */
  keysExtracted: number;
  /** 处理时间（毫秒） */
  processingTime: number;
  /** 错误数 */
  errorCount: number;
}

/**
 * 提取器接口
 */
export interface Extractor {
  /** 提取方法 */
  extract(options: ExtractorOptions): Promise<ExtractorResult>;
  /** 提取器名称 */
  name: string;
  /** 提取器描述 */
  description: string;
  /** 支持的文件类型 */
  supportedFileTypes: string[];
}

/**
 * 提取器工厂选项
 */
export interface ExtractorFactoryOptions {
  /** 是否启用所有提取器 */
  enableAll?: boolean;
  /** 启用的提取器列表 */
  enabledExtractors?: string[];
  /** 提取器配置 */
  config?: Record<string, any>;
}

/**
 * 提取器工厂
 */
export interface ExtractorFactory {
  /** 创建提取器 */
  createExtractor(name: string, options?: any): Extractor;
  /** 获取所有提取器 */
  getAllExtractors(): Extractor[];
  /** 获取启用的提取器 */
  getEnabledExtractors(): Extractor[];
  /** 注册提取器 */
  registerExtractor(extractor: Extractor): void;
  /** 注销提取器 */
  unregisterExtractor(name: string): void;
}

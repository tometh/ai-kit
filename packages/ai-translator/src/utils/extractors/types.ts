import type { NodePath } from "@babel/traverse";
import type {
  CallExpression,
  JSXElement,
  ObjectExpression,
  StringLiteral,
} from "@babel/types";

export interface ExtractedKey {
  key: string;
  metadata?: {
    count?: string;
    context?: string;
  };
}

export interface ExtractorOptions {
  filePath: string;
  sourceCode: string;
}

export interface BaseExtractor {
  extract(options: ExtractorOptions): ExtractedKey[];
}

export type CallExpressionPath = NodePath<CallExpression>;
export type JSXElementPath = NodePath<JSXElement>;
export type ObjectExpressionPath = NodePath<ObjectExpression>;
export type StringLiteralPath = NodePath<StringLiteral>;

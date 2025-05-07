import type { NodePath } from "@babel/traverse";
import type {
  CallExpression,
  JSXElement,
  ObjectExpression,
  StringLiteral,
  TemplateLiteral,
  MemberExpression,
  Identifier,
} from "@babel/types";

/**
 * AST node path type
 */
export type CallExpressionPath = NodePath<CallExpression>;
export type ObjectExpressionPath = NodePath<ObjectExpression>;
export type StringLiteralPath = NodePath<StringLiteral>;
export type JSXElementPath = NodePath<JSXElement>;
export type TemplateLiteralPath = NodePath<TemplateLiteral>;
export type MemberExpressionPath = NodePath<MemberExpression>;
export type IdentifierPath = NodePath<Identifier>;

/**
 * AST parse options
 */
export interface ASTParseOptions {
  /** Source code type */
  sourceType: "module" | "script";
  /** Plugin list */
  plugins: string[];
  /** Enable strict mode */
  strictMode?: boolean;
  /** Enable TypeScript */
  typescript?: boolean;
  /** Enable JSX */
  jsx?: boolean;
}

/**
 * AST traverse options
 */
export interface ASTTraverseOptions {
  /** Recursive traversal */
  recursive?: boolean;
  /** Include comments */
  includeComments?: boolean;
  /** Include locations */
  includeLocations?: boolean;
}

/**
 * AST node location information
 */
export interface ASTLocation {
  /** File path */
  filePath: string;
  /** Start line number */
  startLine: number;
  /** Start column number */
  startColumn: number;
  /** End line number */
  endLine: number;
  /** End column number */
  endColumn: number;
}

/**
 * AST node information
 */
export interface ASTNodeInfo {
  /** Node type */
  type: string;
  /** Location information */
  location?: ASTLocation;
  /** Original code */
  code?: string;
}

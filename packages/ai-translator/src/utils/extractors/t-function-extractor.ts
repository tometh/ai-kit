import * as t from "@babel/types";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import type {
  ExtractedKey,
  ExtractorOptions,
  ExtractorResult,
  ExtractorError,
  Extractor,
} from "../../types/extractor";
import type { CallExpressionPath } from "../../types/ast";
import type { TranslationMetadata } from "../../types/i18n";

const realTraverse = (traverse as any).default || traverse;

export class TFunctionExtractor implements Extractor {
  name = "t-function-extractor";
  description = "Extracts translation keys from t() function calls";
  supportedFileTypes = [".js", ".jsx", ".ts", ".tsx"];

  private extractOptionsMetadata(
    options: t.ObjectExpression
  ): TranslationMetadata {
    const metadata: TranslationMetadata = {};

    for (const prop of options.properties) {
      if (!t.isObjectProperty(prop)) continue;

      const key = t.isIdentifier(prop.key)
        ? prop.key.name
        : t.isStringLiteral(prop.key)
        ? prop.key.value
        : null;

      if (!key) continue;

      if (key === "count" && t.isIdentifier(prop.value)) {
        metadata.count = prop.value.name;
      } else if (key === "context" && t.isStringLiteral(prop.value)) {
        metadata.context = prop.value.value;
      } else if (key === "ns" && t.isStringLiteral(prop.value)) {
        metadata.ns = prop.value.value;
      } else if (key === "defaultValue" && t.isStringLiteral(prop.value)) {
        metadata.defaultValue = prop.value.value;
      }
    }

    return metadata;
  }

  private generateMemberExpressionPath(node: t.MemberExpression): string {
    let path = "";
    if (t.isMemberExpression(node.object)) {
      path = this.generateMemberExpressionPath(node.object) + ".";
    } else if (t.isIdentifier(node.object)) {
      path = node.object.name + ".";
    }
    if (t.isIdentifier(node.property)) {
      path += node.property.name;
    }
    return path;
  }

  async extract(options: ExtractorOptions): Promise<ExtractorResult> {
    const { sourceCode, filePath, includeLocations = false } = options;
    const keys: ExtractedKey[] = [];
    const errors: ExtractorError[] = [];
    const startTime = Date.now();

    try {
      const ast = parse(sourceCode, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      realTraverse(ast, {
        CallExpression(path: CallExpressionPath) {
          if (
            path.node.callee.type === "Identifier" &&
            path.node.callee.name === "t" &&
            path.node.arguments.length
          ) {
            const [keyArg, optionsArg] = path.node.arguments;
            let key = "";
            let metadata: TranslationMetadata = {};

            if (t.isStringLiteral(keyArg)) {
              key = keyArg.value;
            } else if (t.isTemplateLiteral(keyArg)) {
              keyArg.quasis.forEach((quasi, i) => {
                key += quasi.value.raw;
                if (i < keyArg.expressions.length) {
                  const expr = keyArg.expressions[i];
                  if (t.isIdentifier(expr)) {
                    key += `{{${expr.name}}}`;
                  } else if (t.isMemberExpression(expr)) {
                    key += `{{${new TFunctionExtractor().generateMemberExpressionPath(
                      expr
                    )}}}`;
                  }
                }
              });
            }

            if (optionsArg && t.isObjectExpression(optionsArg)) {
              metadata = new TFunctionExtractor().extractOptionsMetadata(
                optionsArg
              );
            }

            if (key) {
              keys.push({
                key,
                metadata,
                filePath,
                line: path.node.loc?.start.line,
                column: path.node.loc?.start.column,
              });
            }
          }
        },
      });
    } catch (error) {
      errors.push({
        type: "parse",
        message: error instanceof Error ? error.message : "Unknown error",
        location: includeLocations
          ? {
              filePath,
              startLine: 0,
              startColumn: 0,
              endLine: 0,
              endColumn: 0,
            }
          : undefined,
      });
    }

    return {
      keys,
      errors: errors.length > 0 ? errors : undefined,
      stats: {
        filesProcessed: 1,
        keysExtracted: keys.length,
        processingTime: Date.now() - startTime,
        errorCount: errors.length,
      },
    };
  }
}

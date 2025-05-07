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
import type { JSXElementPath } from "../../types/ast";
import type { TranslationMetadata } from "../../types/i18n";

const realTraverse = (traverse as any).default || traverse;

export class JSXExtractor implements Extractor {
  name = "jsx-extractor";
  description = "Extracts translation keys from JSX/Trans components";
  supportedFileTypes = [".jsx", ".tsx"];

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
        JSXElement(path: JSXElementPath) {
          const node = path.node;
          if (
            t.isJSXIdentifier(node.openingElement.name) &&
            node.openingElement.name.name === "Trans"
          ) {
            const i18nKey = node.openingElement.attributes.find(
              (attr): attr is t.JSXAttribute =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === "i18nKey"
            );

            const metadata: TranslationMetadata = {};

            if (i18nKey && i18nKey.value && t.isStringLiteral(i18nKey.value)) {
              keys.push({
                key: i18nKey.value.value,
                metadata,
                filePath,
                line: node.loc?.start.line,
                column: node.loc?.start.column,
              });
            } else {
              const text = this.extractTextFromJSX(node);
              if (text) {
                keys.push({
                  key: text,
                  metadata,
                  filePath,
                  line: node.loc?.start.line,
                  column: node.loc?.start.column,
                });
              }
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

  // private extractTextFromJSX(node: t.JSXElement): string {
  //   let text = "";
  //   let lastWasText = false;

  //   for (const child of node.children) {
  //     if (t.isJSXText(child)) {
  //       const trimmed = child.value.trim();
  //       if (trimmed) {
  //         if (lastWasText) text += " ";
  //         text += trimmed;
  //         lastWasText = true;
  //       }
  //     } else if (t.isJSXElement(child)) {
  //       const childText = this.extractTextFromJSX(child);
  //       if (childText) {
  //         if (lastWasText) text += " ";
  //         text += childText;
  //         lastWasText = true;
  //       }
  //     } else if (t.isJSXExpressionContainer(child)) {
  //       if (t.isIdentifier(child.expression)) {
  //         if (lastWasText) text += " ";
  //         text += `{{${child.expression.name}}}`;
  //         lastWasText = true;
  //       } else if (t.isMemberExpression(child.expression)) {
  //         if (lastWasText) text += " ";
  //         text += `{{${this.generateMemberExpressionPath(child.expression)}}}`;
  //         lastWasText = true;
  //       }
  //     }
  //   }

  //   return text;
  // }

  // private generateMemberExpressionPath(node: t.MemberExpression): string {
  //   let path = "";
  //   if (t.isMemberExpression(node.object)) {
  //     path = this.generateMemberExpressionPath(node.object) + ".";
  //   } else if (t.isIdentifier(node.object)) {
  //     path = node.object.name + ".";
  //   }
  //   if (t.isIdentifier(node.property)) {
  //     path += node.property.name;
  //   }
  //   return path;
  // }
}

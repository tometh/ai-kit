// loadLocales utility for multi-environment adaptation
// Supports Vite(import.meta.glob), Webpack(require.context), Node(fs+path)

// Dynamic require in Node.js environment
function loadLocalesNode(localesDir: string): Record<string, any> {
  try {
    // Only available in Node environment
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require("path");
    const resources: Record<string, any> = {};
    if (!fs.existsSync(localesDir)) return resources;
    fs.readdirSync(localesDir).forEach((file: string) => {
      if (file.endsWith(".json")) {
        const lang = file.match(/([a-zA-Z-]+)\.json$/)?.[1];
        if (lang) {
          const content = JSON.parse(
            fs.readFileSync(path.join(localesDir, file), "utf-8")
          );
          resources[lang] = { translation: content };
        }
      }
    });
    return resources;
  } catch {
    return {};
  }
}

export function loadLocales(localesDir = "/locales"): Record<string, any> {
  // Vite 环境（必须用静态字符串）
  if (
    typeof import.meta !== "undefined" &&
    typeof (import.meta as any).glob === "function"
  ) {
    const modules = (import.meta as any).glob("/locales/*.json", {
      eager: true,
    });
    const resources: Record<string, any> = {};
    for (const path in modules) {
      const lang = path.match(/([a-zA-Z-]+)\.json$/)?.[1];
      if (lang) {
        resources[lang] = {
          translation: modules[path].default || modules[path],
        };
      }
    }
    return resources;
  }

  // Webpack 环境
  if (
    typeof require !== "undefined" &&
    typeof (require as any).context === "function"
  ) {
    try {
      const context = (require as any).context(localesDir, false, /\.json$/);
      const resources: Record<string, any> = {};
      context.keys().forEach((key: string) => {
        const lang = key.match(/([a-zA-Z-]+)\.json$/)?.[1];
        if (lang) {
          resources[lang] = { translation: context(key) };
        }
      });
      return resources;
    } catch {}
  }

  // Node.js 环境
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    // 默认 localesDir 需传绝对路径
    return loadLocalesNode(localesDir);
  }

  // 其他环境返回空对象
  return {};
}

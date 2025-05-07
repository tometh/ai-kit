// Convert the result of import.meta.glob('/locales/*.json', { eager: true }) to i18next resources object
export function createResourcesFromModules(modules: Record<string, any>) {
  const resources: Record<string, any> = {};
  for (const path in modules) {
    const lang = path.match(/([a-zA-Z-]+)\.json$/)?.[1];
    if (lang) {
      resources[lang] = { translation: modules[path].default || modules[path] };
    }
  }
  return resources;
}

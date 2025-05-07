import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TranslationProvider } from "ai-translator";
import { createResourcesFromModules } from "ai-translator";

const modules = import.meta.glob("/locales/*.json", { eager: true });
const resources = createResourcesFromModules(modules);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TranslationProvider
      config={{
        model: "chatgpt",
        apiKey: import.meta.env.VITE_AI_TRANSLATOR_API_KEY || "",
        sourceLanguage: "en",
        targetLanguage: "zh",
      }}
      resources={resources}
    >
      <App />
    </TranslationProvider>
  </React.StrictMode>
);

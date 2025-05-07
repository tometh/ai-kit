import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "ai-translator";

const App: React.FC = () => {
  const { t, currentLanguage, setLanguage, isLoading, translate, i18nReady } =
    useTranslation();
  const [translatedText, setTranslatedText] = useState<string>("");
  const name = "Tom";

  // 添加一个提示，显示当前语言是从本地存储加载的
  const [showLanguageHint, setShowLanguageHint] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("ai-translator-language");
    if (savedLanguage) {
      setShowLanguageHint(true);
      // 3秒后隐藏提示
      const timer = setTimeout(() => setShowLanguageHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!i18nReady) {
    return <div>加载中...</div>;
  }

  const handleTranslate = async () => {
    const text = t("welcome");
    const result = await translate(text);
    setTranslatedText(result.text);
  };

  const features = t("features.items", { returnObjects: true });
  const featuresArray = Array.isArray(features) ? features : [];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {showLanguageHint && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#e6f7ff",
            border: "1px solid #91d5ff",
            borderRadius: "4px",
            color: "#1890ff",
          }}
        >
          已从本地存储恢复上次使用的语言设置
        </div>
      )}

      <h1>{t("welcome")}</h1>
      <p>{t("Hello World")}</p>
      <p>{t(`Hello {{name}}`, { name })}</p>

      <div>
        <Trans>Welcome to our website</Trans>
      </div>

      <div>
        <Trans i18nKey="nested.jsx">
          Click <strong>here</strong> to continue
        </Trans>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>{t("features.title")}</h2>
        <ul>
          {featuresArray.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleTranslate}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? t("buttons.loading") : t("buttons.translate")}
        </button>
      </div>

      {translatedText && (
        <div
          style={{
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "20px",
          }}
        >
          <h3>翻译结果：</h3>
          <p>{translatedText}</p>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as any)}
          style={{ padding: "5px 10px" }}
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
      </div>
    </div>
  );
};

export default App;

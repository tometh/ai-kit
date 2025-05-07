import React from "react";
import { Trans as I18nTrans } from "react-i18next";

export interface TransProps {
  i18nKey?: string;
  children: React.ReactNode;
}

export const Trans: React.FC<TransProps> = ({ i18nKey, children }) => {
  return <I18nTrans i18nKey={i18nKey}>{children}</I18nTrans>;
};

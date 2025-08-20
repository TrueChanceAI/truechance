"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getTranslation } from "@/constants/translations";

interface TranslationContextType {
  currentLang: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
}) => {
  const [currentLang, setCurrentLang] = useState<string>(() => {
    if (typeof window === "undefined") return "en";
    const savedLang = localStorage.getItem("lang") || "en";
    return savedLang;
  });
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // Apply DOM direction and font whenever language changes
  useEffect(() => {
    applyLanguageSettings(currentLang);
  }, [currentLang]);

  const applyLanguageSettings = (lang: string) => {
    const html = document.documentElement;
    const body = document.body;

    if (lang === "ar") {
      html.setAttribute("dir", "rtl");
      html.setAttribute("lang", "ar");
      body.style.fontFamily = "'Cairo', sans-serif";
      setIsRTL(true);
    } else {
      html.setAttribute("dir", "ltr");
      html.setAttribute("lang", "en");
      body.style.fontFamily = "'Inter', sans-serif";
      setIsRTL(false);
    }
  };

  const setLanguage = (lang: string) => {
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
  };

  const t = (key: string): string => {
    return getTranslation(currentLang, key);
  };

  const value: TranslationContextType = {
    currentLang,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

"use client";
import { useTranslation } from "@/lib/contexts/TranslationContext";

export const useLanguage = () => {
  const { currentLang, setLanguage, t } = useTranslation();

  return {
    currentLang,
    setLanguage,
    t,
  };
};

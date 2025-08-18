"use client";
import { useState, useEffect } from "react";
import { getTranslation } from "@/constants/translations";

export const useLanguage = () => {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Get language from localStorage on mount
    const savedLang = localStorage.getItem("lang") || "en";
    setCurrentLang(savedLang);
  }, []);

  const t = (key: string): string => {
    return getTranslation(currentLang, key);
  };

  const setLanguage = (lang: string) => {
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
  };

  return {
    currentLang,
    setLanguage,
    t
  };
}; 
"use client";

import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";
import Link from "next/link";

export default function FounderPage() {
  const { t, currentLang } = useLanguage();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/20 to-slate-800/20 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/10 shadow-lg text-center overflow-visible">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-[1.15] pb-1">
              {t("founder.hero.title")}
            </h1>

            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {t("founder.about.title")}
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              {t("founder.about.content")}
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t("founder.story.title")}
            </h2>
            <div className="text-lg text-zinc-300 leading-relaxed whitespace-pre-line">
              {t("founder.story.content")}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("founder.vision.title")}
            </h2>
            <div className="text-lg text-zinc-300 leading-relaxed whitespace-pre-line">
              {t("founder.vision.content")}
            </div>
          </div>
        </div>
      </div>

      {/* Founder Profile Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/20 to-slate-800/20 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/10 shadow-lg">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-lg mx-auto relative">
                  <Image
                    src="/founder-pic.jpeg"
                    alt={
                      currentLang === "ar" ? "أحمد الغامدي" : "Ahmed Alghamdi"
                    }
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentLang === "ar" ? "أحمد الغامدي" : "Ahmed Alghamdi"}
              </h2>

              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-6">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <p className="text-blue-400 font-medium text-lg">
                  {currentLang === "ar"
                    ? "المؤسس والرئيس التنفيذي"
                    : "Founder & CEO"}
                </p>
              </div>

              {/* Stats - Subtle */}
              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">2000+</div>
                  <div className="text-sm text-zinc-400">
                    {currentLang === "ar" ? "مقابلة" : "Interviews"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">300+</div>
                  <div className="text-sm text-zinc-400">
                    {currentLang === "ar" ? "توظيف" : "Hired"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">25K+</div>
                  <div className="text-sm text-zinc-400">
                    {currentLang === "ar" ? "سيرة ذاتية" : "Resumes"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.linkedin.com/in/ahmad-alghamdi-b0854711b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  {currentLang === "ar" ? "LinkedIn" : "LinkedIn"}
                </a>

                <a
                  href="mailto:truechanceksa@gmail.com"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-transparent border border-slate-600 text-slate-300 font-medium rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 hover:bg-blue-500/10"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {currentLang === "ar" ? "تواصل" : "Contact"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/20 to-slate-800/20 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-slate-700/10 shadow-lg text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {currentLang === "ar"
                ? "ابدأ رحلتك معنا اليوم"
                : "Start Your Journey With Us Today"}
            </h2>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
              {currentLang === "ar"
                ? "انضم إلى آلاف المرشحين الذين وجدوا فرصتهم الحقيقية من خلال منصتنا"
                : "Join thousands of candidates who found their true opportunity through our platform"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload-resume"
                className="group inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1"
              >
                <svg
                  className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                {currentLang === "ar"
                  ? "ابدأ المقابلة الآن"
                  : "Start Interview Now"}
              </Link>

              <Link
                href="/about"
                className="group inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-purple-500 text-purple-300 font-semibold rounded-lg hover:border-purple-400 hover:text-purple-200 hover:bg-purple-500/10 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {currentLang === "ar" ? "تعرف على المزيد" : "Learn More"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-16">
        <p className="text-zinc-500 text-sm">
          {currentLang === "ar"
            ? "© 2025 TrueChance. جميع الحقوق محفوظة."
            : "© 2025 TrueChance. All rights reserved."}
        </p>
      </div>
    </div>
  );
}

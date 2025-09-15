"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { AuthModal } from "@/components/AuthModal";
import { event as gaEvent } from "@/lib/gtag";

function HomeContent() {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const router = useRouter();
  const { t, currentLang } = useLanguage();
  const user = useSelector((state: RootState) => state.me.user);

  const handleStart = () => {
    // Example: log a GA custom event for button click
    gaEvent({
      action: "click_start_upload",
      category: "engagement",
      label: "home_upload_button",
    });
    console.log("handleStart clicked, user:", user);
    if (!user) {
      // Show auth modal if not authenticated - default to signin
      console.log("No user, showing auth modal in signin mode");
      setAuthMode("signin");
      setShowAuthModal(true);
    } else {
      // Continue with upload flow if authenticated
      console.log("User authenticated, starting upload flow");
      startUploadFlow();
    }
  };

  const startUploadFlow = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/upload-resume");
    }, 600);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-0">
        {/* Remove the logo and TrueChance text above the robot image */}
        <Image
          src="/robot.png"
          alt="AI Interview Robot"
          width={200}
          height={200}
          className="mb-4 sm:mb-6 mt-2 w-48 h-48 sm:w-64 sm:h-64"
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center px-2">
          {t("home.title")}
        </h1>
        <p className="text-base sm:text-lg mb-4 sm:mb-6 text-center max-w-xl px-4">
          {t("home.subtitle")}
        </p>
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 min-w-[280px] sm:min-w-[320px] relative shadow-xl mx-4">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 mb-4"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#6b7280"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#9333ea"
                />
              </svg>
              <span className="text-base sm:text-lg font-medium text-white text-center">
                {t("home.redirectingText")}
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          className="inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg text-sm text-center bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-200"
          onClick={handleStart}
          disabled={loading}
        >
          {t("home.uploadButton")}
        </button>
      </div>

      {/* Meet the Founder Section */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="bg-gradient-to-br from-slate-900/20 to-slate-800/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/20 shadow-xl">
          <div
            className={`${
              currentLang === "ar" ? "text-right" : "text-center"
            } mb-6`}
          >
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mr-3"></div>
              {t("founder.hero.subtitle")}
            </div> */}

            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {t("founder.hero.title")}
            </h2>

            <div
              className={`w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full ${
                currentLang === "ar" ? "ml-auto" : "mx-auto"
              }`}
            ></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start content-start">
            {/* Stats & Experience */}
            <div
              className={`space-y-6 ${
                currentLang === "ar"
                  ? "text-center lg:text-right"
                  : "text-center lg:text-left"
              } lg:order-2`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/15 h-24 px-4 overflow-hidden">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400 leading-none whitespace-nowrap">
                    2000+
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {t("founder.stats.interviews")}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/15 h-24 px-4 overflow-hidden">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400 leading-none whitespace-nowrap">
                    300+
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {t("founder.stats.hired")}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/15 h-24 px-4 overflow-hidden">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 leading-none whitespace-nowrap">
                    25K+
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {t("founder.stats.resumes")}
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Founder Profile & CTA (no photo) */}
            <div className="space-y-4 lg:order-1">
              <div
                className={`${
                  currentLang === "ar"
                    ? "text-center lg:text-right"
                    : "text-center lg:text-left"
                }`}
              >
                <p className="text-xs uppercase tracking-wide text-zinc-400 mb-1">
                  {currentLang === "ar" ? "المؤسس" : "Founder"}
                </p>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  {currentLang === "ar" ? "أحمد الغامدي" : "Ahmed Alghamdi"}
                </h3>
                <p className="text-blue-300 font-medium mt-1">
                  {currentLang === "ar" ? "الرئيس التنفيذي" : "CEO"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center lg:items-start justify-start lg:justify-start">
                <a
                  href="https://www.linkedin.com/in/ahmad-alghamdi-b0854711b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-transparent border border-slate-600 text-slate-300 font-medium rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 hover:bg-blue-500/10"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  {t("founder.connectLinkedIn")}
                </a>
              </div>
            </div>
          </div>
          {/* Content below with Read Full Story */}
          <div
            className={`mt-6 pt-6 border-t border-slate-700/30 ${
              currentLang === "ar"
                ? "text-center lg:text-right"
                : "text-center lg:text-left"
            } space-y-3`}
          >
            <h3 className="text-xl font-semibold text-emerald-400">
              {t("founder.about.title")}
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base max-w-prose mx-auto lg:mx-0">
              {t("founder.about.content")}
            </p>
            <h3 className="text-xl font-semibold text-blue-400">
              {t("founder.story.title")}
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base max-w-prose mx-auto lg:mx-0">
              {t("founder.story.content").split("\n")[0]}...
            </p>
            <Link
              href="/founder"
              className="inline-flex items-center text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
            >
              {t("founder.readFullStory")}
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}

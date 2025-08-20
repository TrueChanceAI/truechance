"use client";
import Agent from "@/components/Agent";
import { useEffect, useState } from "react";
import { getInterviewerConfig } from "@/constants";
import Cookies from "js-cookie";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

// Custom ProtectedRoute that checks both authentication and interview token
function InterviewProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasValidToken, setHasValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (user && !loading) {
      // Check for interview token in both cookies and sessionStorage
      const cookieToken = Cookies.get("interviewToken");
      const sessionToken = sessionStorage.getItem("interviewToken");

      // Also check for the required resume data
      const storedQuestions = sessionStorage.getItem("interviewQuestions");
      const storedLanguage = sessionStorage.getItem("interviewLanguage");
      const storedName = sessionStorage.getItem("candidateName");
      const storedEmail = sessionStorage.getItem("resumeEmail");
      const storedResumeFile = sessionStorage.getItem("resumeFileContent");

      console.log("Token validation:", {
        cookieToken: !!cookieToken,
        sessionToken: !!sessionToken,
        hasQuestions: !!storedQuestions,
        hasLanguage: !!storedLanguage,
        hasName: !!storedName,
        hasEmail: !!storedEmail,
        hasResumeFile: !!storedResumeFile,
      });

      console.log("SessionStorage contents:", {
        resumeEmail: storedEmail,
        candidateName: storedName,
        resumeFileLength: storedResumeFile ? storedResumeFile.length : 0,
      });

      // Must have both valid token AND resume data
      if (
        !cookieToken ||
        !sessionToken ||
        !storedQuestions ||
        !storedLanguage ||
        !storedName
      ) {
        console.log("Missing required data, redirecting to upload-resume");
        // Missing token or resume data, redirect immediately
        router.push("/upload-resume");
        return;
      }

      // Validate the questions data
      try {
        const parsedQuestions = JSON.parse(storedQuestions);
        if (
          !parsedQuestions ||
          !Array.isArray(parsedQuestions) ||
          parsedQuestions.length === 0
        ) {
          console.log("Invalid questions data, redirecting to upload-resume");
          // Invalid or empty questions, redirect
          router.push("/upload-resume");
          return;
        }

        console.log("All validations passed, allowing interview access");
        // All validations passed
        setHasValidToken(true);
        setIsCheckingToken(false);
      } catch (error) {
        console.log("JSON parsing error, redirecting to upload-resume");
        // Invalid JSON, redirect
        router.push("/upload-resume");
      }
    }
  }, [user, loading, router]);

  if (loading || isCheckingToken) {
    return (
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
            {loading
              ? "Checking authentication..."
              : "Validating interview access..."}
          </span>
        </div>
      </div>
    );
  }

  if (!user || !hasValidToken) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

function InterviewPageContent() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [language, setLanguage] = useState("en");
  const [showWarning, setShowWarning] = useState(false);
  const [interviewerConfig, setInterviewerConfig] = useState(
    getInterviewerConfig("en")
  );
  const [candidateName, setCandidateName] = useState("Candidate");
  const { t } = useLanguage();

  useEffect(() => {
    // Load the resume data that we already validated
    const storedQuestions = sessionStorage.getItem("interviewQuestions");
    const storedLanguage = sessionStorage.getItem("interviewLanguage");
    const storedName = sessionStorage.getItem("candidateName");

    if (storedQuestions && storedLanguage && storedName) {
      setQuestions(JSON.parse(storedQuestions));
      setLanguage(storedLanguage);
      setCandidateName(storedName);
      setInterviewerConfig(getInterviewerConfig(storedLanguage, storedName));
    }
  }, []);

  useEffect(() => {
    // Clear the interviewToken cookie AFTER the interview content has loaded
    // This prevents the token from being cleared before validation
    const timer = setTimeout(() => {
      Cookies.remove("interviewToken");
      console.log("Interview token cleared after successful load");
    }, 1000); // Small delay to ensure everything is loaded

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Consistency check: if questions exist, check if they match the selected language
    if (questions.length > 0 && language) {
      // Simple heuristic: check if first question contains Arabic characters if language is ar
      const isArabic = /[\u0600-\u06FF]/.test(questions[0]);
      if ((language === "ar" && !isArabic) || (language !== "ar" && isArabic)) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
  }, [questions, language]);

  return (
    <div className="px-4 sm:px-0">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        {t("interview.title")}
      </h3>
      <Agent
        questions={questions}
        type="interview"
        userName={candidateName}
        interviewerConfig={interviewerConfig}
      />
    </div>
  );
}

export default function InterviewPage() {
  return (
    <InterviewProtectedRoute>
      <InterviewPageContent />
    </InterviewProtectedRoute>
  );
}

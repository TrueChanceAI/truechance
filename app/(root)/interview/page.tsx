"use client";
import Agent from "@/components/Agent";
import { useEffect, useState } from "react";
import { getInterviewerConfig } from "@/constants";
import Cookies from "js-cookie";
import { useLanguage } from "@/hooks/useLanguage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetInterviewById } from "@/hooks/interview";

// Custom ProtectedRoute that checks both authentication and interview token
function InterviewProtectedRoute({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");

  const user = useSelector((s: RootState) => s.me.user);
  const router = useRouter();
  const [hasValidToken, setHasValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const {
    interview,
    isLoading: isLoadingInterview,
    isError: isErrorInterview,
  } = useGetInterviewById(interviewId as string);

  if (isLoadingInterview || isCheckingToken) {
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
            {isLoadingInterview
              ? "Checking authentication..."
              : "Validating interview access..."}
          </span>
        </div>
      </div>
    );
  }

  if (!user || !interview) {
    return null; // Will redirect in useEffect
  }

  if (isErrorInterview) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 min-w-[280px] sm:min-w-[320px] relative shadow-xl mx-4">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white text-center">
            Error Loading Interview
          </h2>
          <p className="text-sm text-gray-300 text-center">
            There was a problem loading the interview. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function InterviewPageContent() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { interview } = useGetInterviewById(interviewId as string);

  const { t } = useLanguage();

  return (
    <div className="px-4 sm:px-0">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        {t("interview.title")}
      </h3>
      <Agent
        questions={interview?.interview_questions}
        type="interview"
        userName={interview?.candidate_name || ""}
        interviewerConfig={getInterviewerConfig(
          interview?.language,
          interview?.candidate_name
        )}
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

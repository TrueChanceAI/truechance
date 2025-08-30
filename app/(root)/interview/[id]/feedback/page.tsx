"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import { useGetInterviewById } from "@/hooks/interview";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Feedback = () => {
  const params = useParams();
  const id = params.id as string;

  const { interview, isLoading, isError } = useGetInterviewById(id);

  // Language support
  const isRTL = interview?.language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Translation helper function
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  if (isLoading) {
    return (
      <section className="section-feedback flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-0">
        <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-purple-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-white">
            {t("Loading feedback...", "جاري تحميل التقييم...")}
          </span>
        </div>
      </section>
    );
  }

  if (isError || !interview || !interview.feedback) {
    return (
      <section className="section-feedback flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-red-400 text-center">
          {t("Feedback Not Found", "التقييم غير موجود")}
        </h1>
        <p className="mb-6 text-base sm:text-lg text-center text-light-100 max-w-xl px-4">
          {t(
            "Sorry, we couldn't find feedback for this interview. It may not have been generated yet, or there was an error. Please try again later or contact support if the problem persists.",
            "عذراً، لم نتمكن من العثور على تقييم لهذه المقابلة. قد لا يكون قد تم إنشاؤه بعد، أو حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم إذا استمرت المشكلة."
          )}
        </p>
        <Button className="btn-primary">
          <Link href="/">
            {t("Return to Dashboard", "العودة إلى لوحة التحكم")}
          </Link>
        </Button>
      </section>
    );
  }

  // Extract feedback data
  const feedback = interview.feedback;
  const feedbackEntries = Object.entries(feedback);

  return (
    <ProtectedRoute>
      <section className="section-feedback px-4 sm:px-0" dir={dir}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {t("Interview Feedback", "تقييم المقابلة")}
          </h1>
          <div className="flex gap-3">
            <Button className="btn-outline">
              <Link href={`/interview/${id}`}>
                {t("View Details", "عرض التفاصيل")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            {/* Candidate Name */}
            <div className="flex flex-row gap-2 items-center justify-center sm:justify-start">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {interview.candidate_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-light-100">
                {t("Candidate:", "المرشح:")} {interview.candidate_name}
              </span>
            </div>

            {/* Interview Date */}
            <div className="flex flex-row gap-2 items-center justify-center sm:justify-start">
              <span className="text-light-100">
                {t("Date:", "التاريخ:")}{" "}
                {dayjs(interview.created_at).format(
                  isRTL ? "MMM D, YYYY" : "MMM D, YYYY"
                )}
              </span>
            </div>

            {/* Interview Duration */}
            {interview.duration && (
              <div className="flex flex-row gap-2 items-center justify-center sm:justify-start">
                <span className="text-light-100">
                  {t("Duration:", "المدة:")} {interview.duration}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbackEntries.map(([key, value]) => {
            const formattedKey = key
              .replace(/_/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <div
                key={key}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 hover:border-purple-500/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-primary-200 mb-3">
                  {formattedKey}
                </h3>
                <p className="text-light-100 leading-relaxed">
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Feedback;

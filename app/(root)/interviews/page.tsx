"use client";

import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import { useGetAllInterviews } from "@/hooks/interview";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";

export default function InterviewsPage() {
  const router = useRouter();
  const { interviews, isLoading, isError } = useGetAllInterviews();

  // Language support - we'll use the first interview's language or default to English
  const firstInterview = interviews?.[0];
  const isRTL = firstInterview?.language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Translation helper function
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
            {t("Loading interviews...", "جاري تحميل المقابلات...")}
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-semibold text-red-400">
            {t("Failed to load interviews", "فشل في تحميل المقابلات")}
          </h1>
          <Button className="btn-primary" onClick={() => router.refresh()}>
            {t("Retry", "إعادة المحاولة")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <section className="px-4 sm:px-0" dir={dir}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {t("Your Interviews", "مقابلاتك")}
          </h1>
          <Button
            className="btn-primary"
            onClick={() => router.push("/upload-resume")}
          >
            {t("New Interview", "مقابلة جديدة")}
          </Button>
        </div>

        {!interviews || interviews.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 text-center">
            <p className="text-light-100 mb-4">
              {t("No interviews yet.", "لا توجد مقابلات بعد.")}
            </p>
            <Button
              className="btn-primary"
              onClick={() => router.push("/upload-resume")}
            >
              {t("Create Interview", "إنشاء مقابلة")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {interviews.map((it) => {
              const isConducted = it.is_conducted;
              const interviewLanguage =
                it.language === "ar"
                  ? isRTL
                    ? "العربية"
                    : "Arabic"
                  : it.language || (isRTL ? "الإنجليزية" : "English");

              return (
                <div
                  key={it.id}
                  className="bg-zinc-900 rounded-xl p-4 sm:p-5 border border-zinc-700 flex flex-col gap-2 sm:gap-3"
                >
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <Image
                        src="/covers/logo.svg"
                        alt="cover"
                        width={36}
                        height={36}
                        className="rounded-full size-[36px] object-cover"
                      />
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold truncate">
                          {t("Interview", "مقابلة")} {it.candidate_name}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">
                          {interviewLanguage} •{" "}
                          {it.created_at
                            ? dayjs(it.created_at).format("MMM D, YYYY h:mm A")
                            : t("N/A", "غير متوفر")}
                          {it.total_time_spent_minutes && (
                            <span className="ml-2">
                              • {t("Time spent", "الوقت المستغرق")}:{" "}
                              {Math.round(it.total_time_spent_minutes)}m
                              {it.max_allowed_minutes && (
                                <span> / {it.max_allowed_minutes}m</span>
                              )}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap max-sm:text-[10px] max-sm:px-1.5 max-sm:py-0.5 ${
                        isConducted
                          ? "text-green-300 bg-green-900/30"
                          : "text-yellow-300 bg-yellow-900/30"
                      }`}
                    >
                      {isConducted
                        ? t("Completed", "مكتمل")
                        : t("Not Conducted", "لم يتم إجراؤها")}
                    </span>
                  </div>

                  {it.skills && (
                    <p className="text-xs text-zinc-400 truncate">
                      {it.skills}
                    </p>
                  )}

                  <div className="flex gap-2 sm:gap-3 mt-2">
                    {isConducted ? (
                      <>
                        <Button
                          className="btn-primary flex-1"
                          onClick={() => router.push(`/interview/${it.id}`)}
                        >
                          {t("View Details", "عرض التفاصيل")}
                        </Button>
                        <Button
                          className="btn-secondary flex-1"
                          onClick={() =>
                            router.push(`/interview/${it.id}/feedback`)
                          }
                        >
                          {t("View Feedback", "عرض التقييم")}
                        </Button>
                      </>
                    ) : (
                      <>
                        {it.payment_id ? (
                          <Button
                            className="btn-primary flex-1"
                            onClick={() =>
                              router.push(
                                `/interview?paymentId=${it.payment_id}&interviewId=${it.id}`
                              )
                            }
                          >
                            {t("Start Interview", "بدء المقابلة")}
                          </Button>
                        ) : (
                          <Button
                            className="btn-secondary flex-1"
                            onClick={() => router.push(`/interview/${it.id}`)}
                          >
                            {t("View Details", "عرض التفاصيل")}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}

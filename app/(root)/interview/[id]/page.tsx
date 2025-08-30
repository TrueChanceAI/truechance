"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetInterviewById } from "@/hooks/interview";
import { getRandomInterviewCover } from "@/lib/utils";
import { getInterviewerConfig } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { generateInterviewPdf } from "@/lib/utils";

function InterviewContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const user = useSelector((s: RootState) => s.me.user);

  const { interview, isLoading, isError } = useGetInterviewById(id);

  // Language support
  const isRTL = interview?.language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Translation helper function
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
            {t("Loading interview...", "جاري تحميل المقابلة...")}
          </span>
        </div>
      </div>
    );
  }

  if (isError || !interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-semibold text-red-400">
            {t("Interview Not Found", "المقابلة غير موجودة")}
          </h1>
          <p className="text-light-100 text-center">
            {t(
              "The interview you're looking for doesn't exist.",
              "المقابلة التي تبحث عنها غير موجودة."
            )}
          </p>
          <Button className="btn-primary" onClick={() => router.push("/")}>
            {t("Back to Dashboard", "العودة إلى لوحة التحكم")}
          </Button>
        </div>
      </div>
    );
  }

  const isConducted = interview.is_conducted;
  const hasPaymentId = interview.payment_id;
  const uniqueSkills: string[] = (() => {
    if (!interview.skills) return [];
    const items = interview.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of items) {
      const key = s.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(s);
      }
    }
    return result;
  })();

  const handleGenerateReport = async () => {
    try {
      await generateInterviewPdf(interview, {
        includeFeedback: true,
        filenamePrefix: t("Interview", "مقابلة"),
      });
    } catch (err) {
      console.error(t("Failed to generate PDF", "فشل في إنشاء ملف PDF"), err);
    }
  };

  const handleStartInterview = () => {
    if (hasPaymentId) {
      router.push(`/interview?paymentId=${hasPaymentId}&interviewId=${id}`);
    }
  };

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        dir={dir}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              {t("Interview Details", "تفاصيل المقابلة")}
            </h1>
          </div>

          {/* Interview Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20">
            {/* Candidate Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {interview.candidate_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {t("Candidate:", "المرشح:")} {interview.candidate_name}
                </h2>
                <p className="text-gray-300">
                  {t("Created on", "تم إنشاؤها في")}{" "}
                  {dayjs(interview.created_at).format(
                    isRTL ? "MMM D, YYYY h:mm A" : "MMM D, YYYY h:mm A"
                  )}
                </p>
              </div>
            </div>

            {/* Interview Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">
                    {t("Duration", "المدة")}
                  </label>
                  <p className="text-white text-lg">
                    {interview.duration || t("N/A", "غير متوفر")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">
                    {t("Language", "اللغة")}
                  </label>
                  <p className="text-white text-lg">
                    {interview.language === "ar"
                      ? t("Arabic", "العربية")
                      : interview.language || t("English", "الإنجليزية")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">
                    {t("Status", "الحالة")}
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isConducted
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {isConducted
                      ? t("✅ Completed", "✅ مكتمل")
                      : t("⏳ Not Conducted", "⏳ لم يتم إجراؤها")}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">
                    {t("Payment Status", "حالة الدفع")}
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      interview.payment_status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {interview.payment_status === "completed"
                      ? t("✅ Completed", "✅ مكتمل")
                      : t("❌ Pending", "❌ معلق")}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            {uniqueSkills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t("Skills & Technologies", "المهارات والتقنيات")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isConducted && hasPaymentId ? (
                <Button
                  className="btn-primary text-lg px-8 py-3"
                  onClick={handleStartInterview}
                >
                  {t("Start Interview", "بدء المقابلة")}
                </Button>
              ) : (
                <Button
                  className="btn-secondary text-lg px-8 py-3"
                  onClick={() => router.push(`/interview/${id}/feedback`)}
                >
                  {t("View Feedback", "عرض التقييم")}
                </Button>
              )}

              <Button
                className="btn-outline text-lg px-8 py-3"
                onClick={() => router.push("/interviews")}
              >
                {t("Back to Interviews", "العودة إلى المقابلات")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function InterviewDetails() {
  return <InterviewContent />;
}

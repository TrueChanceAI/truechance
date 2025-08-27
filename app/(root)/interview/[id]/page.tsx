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
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Agent from "@/components/Agent";
import { generateInterviewPdf } from "@/lib/utils";

function InterviewContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const user = useSelector((s: RootState) => s.me.user);

  const { interview, isLoading, isError } = useGetInterviewById(id);

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
          <span className="text-white">Loading interview...</span>
        </div>
      </div>
    );
  }

  if (isError || !interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-semibold text-red-400">
            Interview Not Found
          </h1>
          <p className="text-light-100 text-center">
            The interview you're looking for doesn't exist.
          </p>
          <Button className="btn-primary" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isConducted = Boolean(interview.is_conducted);
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
        filenamePrefix: "Interview",
      });
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex flex-row gap-3 sm:gap-4 items-center">
              {/* <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={40}
                height={40}
                className="rounded-full object-cover size-[40px] flex-shrink-0"
              /> */}
              <h3 className="capitalize text-lg sm:text-xl font-semibold">
                {interview.candidate_name} Interview
              </h3>
            </div>

            <DisplayTechIcons techStack={interview.skills.split(", ")} />
          </div>
          <div className="flex items-start sm:items-center">
            <Button className="btn-secondary" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </div>
        </div>

        {/* Interview Details Section */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 mb-6">
          <h2 className="text-xl font-semibold text-primary-200 mb-4">
            Interview Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-light-100">Candidate:</span>
                <span className="text-primary-200 font-semibold">
                  {interview.candidate_name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Image
                  src="/calendar.svg"
                  width={18}
                  height={18}
                  alt="calendar"
                />
                <span className="text-light-100">Created:</span>
                <span className="text-primary-200 font-semibold">
                  {interview.created_at
                    ? dayjs(interview.created_at).format("MMM D, YYYY h:mm A")
                    : "N/A"}
                </span>
              </div>

              {isConducted && interview.duration && (
                <div className="flex items-center gap-3">
                  <Image
                    src="/calendar.svg"
                    width={18}
                    height={18}
                    alt="duration"
                  />
                  <span className="text-light-100">Duration:</span>
                  <span className="text-primary-200 font-semibold">
                    {interview.duration}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Image src="/globe.svg" width={18} height={18} alt="language" />
                <span className="text-light-100">Language:</span>
                <span className="text-primary-200 font-semibold capitalize">
                  {interview.language || "English"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Image src="/star.svg" width={18} height={18} alt="status" />
                <span className="text-light-100">Status:</span>
                <span
                  className={`font-semibold ${
                    isConducted ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {isConducted ? "Completed" : "Not Conducted"}
                </span>
              </div>

              {hasPaymentId && (
                <div className="flex items-center gap-3">
                  <Image src="/file.svg" width={18} height={18} alt="payment" />
                  <span className="text-light-100">Payment Status:</span>
                  <span
                    className={`font-semibold text-sm ${
                      interview.payment_status === "completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {interview.payment_status === "completed"
                      ? "Paid"
                      : interview.payment_status}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Image src="/file.svg" width={18} height={18} alt="payment" />
                <span className="text-light-100">Payment ID:</span>
                <span className="text-primary-200 font-semibold text-sm">
                  {interview.payment_id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {uniqueSkills.length > 0 && (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 mb-6">
            <h2 className="text-xl font-semibold text-primary-200 mb-4">
              Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {uniqueSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Section */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700">
          <h2 className="text-xl font-semibold text-primary-200 mb-4">
            Actions
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            {isConducted ? (
              <>
                <Button
                  className="btn-primary flex-1"
                  onClick={() => router.push(`/interview/${id}/feedback`)}
                >
                  View Feedback
                </Button>
                <Button
                  className="btn-secondary flex-1"
                  onClick={() => router.push("/")}
                >
                  Back to Dashboard
                </Button>
              </>
            ) : (
              <>
                {hasPaymentId ? (
                  <Button
                    className="btn-primary flex-1"
                    onClick={() =>
                      router.push(
                        `/interview?paymentId=${interview.payment_id}&interviewId=${id}`
                      )
                    }
                  >
                    Start Interview
                  </Button>
                ) : (
                  <div className="text-center w-full">
                    <p className="text-light-100 mb-4">
                      This interview requires payment to proceed.
                    </p>
                    <Button
                      className="btn-primary"
                      onClick={() => router.push("/upload-resume")}
                    >
                      Create New Interview
                    </Button>
                  </div>
                )}
                <Button
                  className="btn-secondary flex-1"
                  onClick={() => router.push("/")}
                >
                  Back to Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function InterviewDetails() {
  return <InterviewContent />;
}

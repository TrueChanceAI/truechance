"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import { useGetInterviewById } from "@/hooks/interview";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { generateInterviewPdf } from "@/lib/utils";

const Feedback = () => {
  const params = useParams();
  const id = params.id as string;

  const { interview, isLoading, isError } = useGetInterviewById(id);

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
          <span className="text-white">Loading feedback...</span>
        </div>
      </section>
    );
  }

  if (isError || !interview || !interview.feedback) {
    return (
      <section className="section-feedback flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-red-400 text-center">
          Feedback Not Found
        </h1>
        <p className="mb-6 text-base sm:text-lg text-center text-light-100 max-w-xl px-4">
          Sorry, we couldn't find feedback for this interview. It may not have
          been generated yet, or there was an error. Please try again later or
          contact support if the problem persists.
        </p>
        <Button className="btn-primary">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </section>
    );
  }

  // Extract feedback data
  const feedback = interview.feedback;
  const feedbackEntries = Object.entries(feedback);

  const handleGenerateReport = async () => {
    try {
      await generateInterviewPdf(interview, {
        includeFeedback: true,
        filenamePrefix: "Interview_Feedback",
      });
    } catch (err) {
      console.error("Failed to generate feedback PDF", err);
    }
  };

  return (
    <ProtectedRoute>
      <section className="section-feedback px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Interview Feedback
          </h1>
          <Button className="btn-secondary" onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            {/* Candidate Name */}
            <div className="flex flex-row gap-2 items-center justify-center sm:justify-start">
              <Image
                src="/profile.svg"
                width={18}
                height={18}
                className="sm:w-[22px] sm:h-[22px]"
                alt="profile"
              />
              <p className="text-sm sm:text-base">
                Candidate:{" "}
                <span className="text-primary-200 font-bold">
                  {interview.candidate_name}
                </span>
              </p>
            </div>

            {/* Duration */}
            <div className="flex flex-row gap-2 items-center justify-center sm:justify-start">
              <Image
                src="/calendar.svg"
                width={18}
                height={18}
                className="sm:w-[22px] sm:h-[22px]"
                alt="calendar"
              />
              <p className="text-sm sm:text-base">
                Duration:{" "}
                <span className="text-primary-200 font-bold">
                  {interview.duration}
                </span>
              </p>
            </div>

            {/* Date */}
            <div className="flex flex-row gap-2 items-center justify-center sm:justify-start">
              <Image
                src="/calendar.svg"
                width={18}
                height={18}
                className="sm:w-[22px] sm:h-[22px]"
                alt="calendar"
              />
              <p className="text-sm sm:text-base">
                {interview.created_at
                  ? dayjs(interview.created_at).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* Feedback Sections */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {feedbackEntries.map(([key, value], index) => (
              <div
                key={key}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-primary-200 mb-3 capitalize">
                  {key.replace(/_/g, " ")}
                </h3>
                <p className="text-light-100 leading-relaxed text-sm">
                  {value as string}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="buttons mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="btn-primary max-w-xs">
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center"
            >
              <p className="text-sm font-semibold text-black text-center">
                View Details
              </p>
            </Link>
          </Button>
          <Button className="btn-secondary max-w-xs">
            <Link href="/" className="flex w-full justify-center">
              <p className="text-sm font-semibold text-primary-200 text-center">
                Back to Dashboard
              </p>
            </Link>
          </Button>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Feedback;

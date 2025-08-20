"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const LANGUAGES = [
  { code: "en", labelEn: "English", labelAr: "الإنجليزية" },
  { code: "ar", labelEn: "Arabic", labelAr: "العربية" },
];

function UploadResumeContent() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showStartCard, setShowStartCard] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [resumeText, setResumeText] = useState(""); // Add resumeText to component state
  const { t, currentLang } = useLanguage();
  const { user, getToken } = useAuth();

  const progressSteps = t("upload.progressSteps");
  const [loadingStartInterview, setLoadingStartInterview] = useState(false);

  // Initialize email with user's email when component loads
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setShowModal(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
      setShowModal(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!acceptedTerms) {
      setError(t("upload.termsErrorText"));
      return;
    }
    if (!user) {
      setError("You must be authenticated to upload a resume.");
      return;
    }

    setError("");
    setShowProgress(true);
    setProgressStep(0);

    // Get the authentication token first (needed for all API calls)
    let token: string;
    try {
      const authToken = await getToken();
      if (!authToken) {
        throw new Error("Authentication token not available");
      }
      token = authToken;

      // Debug: Log token details
      console.log("🔐 Token received:", {
        tokenLength: token.length,
        tokenStart: token.substring(0, 20) + "...",
        tokenEnd: "..." + token.substring(token.length - 20),
      });
    } catch (err: any) {
      setError(t("auth.authenticationFailed"));
      setShowProgress(false);
      return;
    }

    // Simulate progress
    for (let i = 0; i < progressSteps.length; i++) {
      setProgressStep(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, 1200));
    }

    // Actually extract resume text
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    let extractedText = ""; // Declare at function level
    let extractedName = ""; // Also declare candidate name at function level

    try {
      const res = await fetch("/api/extract-resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to extract resume text.");
      const data = await res.json();
      extractedText = data.text || ""; // Assign to function-level variable
      extractedName = data.name || ""; // Assign to function-level variable
      setResumeText(extractedText); // Store in component state
      setCandidateName(extractedName); // Store in component state
    } catch (err: any) {
      setError(err.message || "Failed to extract resume text.");
      setShowProgress(false);
      return;
    }

    // Generate questions based on resume
    try {
      console.log("=== DEBUG: Generate Questions Request ===");
      console.log("extractedText:", extractedText);
      console.log("language:", language);
      console.log("extractedName:", extractedName);
      console.log("Full request body:", {
        resume: extractedText,
        language,
        candidateName: extractedName,
      });

      const questionRes = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resume: extractedText, // Use extractedText directly instead of resumeText state
          language,
          candidateName: extractedName, // Use extractedName instead of candidateName state
        }),
      });
      console.log("=== DEBUG: Generate Questions Response ===");
      console.log("Response status:", questionRes.status);
      console.log("Response ok:", questionRes.ok);

      if (!questionRes.ok) {
        const errorText = await questionRes.text();
        console.log("Error response text:", errorText);
        throw new Error("Failed to generate questions.");
      }
      const data = await questionRes.json();
      console.log("Questions received:", data.questions);
      if (data.questions) {
        sessionStorage.setItem(
          "interviewQuestions",
          JSON.stringify(data.questions)
        );
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating questions.");
      setShowProgress(false);
      return;
    }

    // Save data to Supabase
    try {
      console.log("=== DEBUG: Saving to Supabase ===");
      console.log("🔐 Auth context user email:", user?.email);
      console.log("📧 Form email field value:", email);
      console.log("Data being sent:", {
        email,
        resumeText: extractedText
          ? `${extractedText.substring(0, 50)}...`
          : "undefined",
        candidateName: extractedName,
        language,
        resumeTextLength: extractedText ? extractedText.length : 0,
        hasFile: !!file,
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
      });

      // Convert file to base64 for sending to API
      const fileReader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
      });

      // Extract base64 data (remove data:application/pdf;base64, prefix)
      const base64Data = fileData.split(",")[1];

      console.log("=== DEBUG: File Conversion ===");
      console.log("Original file size:", file.size);
      console.log("Base64 data length:", base64Data.length);
      console.log("File type:", file.type);
      console.log("File name:", file.name);

      const saveRes = await fetch("/api/save-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          resumeText: extractedText, // Use extractedText instead of resumeText state
          candidateName: extractedName || "Unknown Candidate", // Use extractedName instead of candidateName state
          language,
          resumeFile: base64Data,
          resumeFileName: file.name,
          resumeFileType: file.type,
          // Add authenticated user's email for ownership verification
          authenticatedUserEmail: user?.email,
        }),
      });

      if (!saveRes.ok) {
        const errorText = await saveRes.text();
        console.log("Supabase save error:", errorText);
        // Don't throw error here - just log it, as the main flow should continue
      } else {
        const saveData = await saveRes.json();
        console.log("✅ Data saved to Supabase successfully");

        // Store the interview_id for later use in save-interview
        if (saveData.interview_id) {
          sessionStorage.setItem("initialInterviewId", saveData.interview_id);
          console.log("🔑 Stored initial interview_id:", saveData.interview_id);
        }

        // Add a small delay to ensure the database transaction is committed
        console.log("⏳ Waiting for database transaction to commit...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        console.log("✅ Database transaction should be committed now");
      }
    } catch (err: any) {
      console.log("⚠️ Warning: Failed to save to Supabase:", err.message);
      // Don't throw error here - just log it, as the main flow should continue
    }

    setShowProgress(false);
    setShowStartCard(true);
  };

  const handleStartInterview = async () => {
    setLoadingStartInterview(true);
    const token =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    // Debug: Log what we're storing in sessionStorage
    console.log("🔍 Storing in sessionStorage:", {
      email: email,
      candidateName: candidateName,
      resumeTextLength: resumeText ? resumeText.length : 0,
    });

    // Store all required data in sessionStorage for the interview page
    sessionStorage.setItem("interviewToken", token);
    sessionStorage.setItem("interviewLanguage", language);
    sessionStorage.setItem("candidateName", candidateName);
    sessionStorage.setItem("resumeEmail", email); // Store email from the form
    sessionStorage.setItem("extractedCandidateName", candidateName); // Store the extracted name for consistency

    // Store resume file content for interview completion
    if (file) {
      try {
        const fileData = await new Promise<string>((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = () => resolve(fileReader.result as string);
          fileReader.onerror = reject;
          fileReader.readAsDataURL(file);
        });

        const base64Data = fileData.split(",")[1];
        sessionStorage.setItem("resumeFileContent", base64Data);
        sessionStorage.setItem("resumeFileName", file.name);
        sessionStorage.setItem("resumeFileType", file.type);
        sessionStorage.setItem("resumeText", resumeText); // Use resumeText from component state
        console.log("✅ Resume data stored in sessionStorage for interview");
      } catch (error) {
        console.error(
          "❌ Failed to store resume data in sessionStorage:",
          error
        );
      }
    }

    // Also store in cookies for the interview page validation
    Cookies.set("interviewToken", token, { path: "/", sameSite: "strict" });

    // Small delay to ensure sessionStorage is set before redirecting
    setTimeout(() => {
      console.log("🔍 Final sessionStorage check before redirect:", {
        resumeEmail: sessionStorage.getItem("resumeEmail"),
        candidateName: sessionStorage.getItem("candidateName"),
        hasResumeFile: !!sessionStorage.getItem("resumeFileContent"),
      });
      router.push(`/interview?token=${token}`);
    }, 200);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-start justify-center bg-transparent p-4 pt-0">
        <div
          className="w-full max-w-md p-4 border border-zinc-700 rounded-lg shadow-sm sm:p-6 md:p-8 bg-zinc-900 mt-4"
          style={{
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-xl font-medium text-white text-center">
              {t("upload.title")}
            </h1>
            <p className="text-zinc-400 text-center">{t("upload.subtitle")}</p>

            {/* Drag and drop or browse area always visible */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-zinc-500 rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-colors"
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => handleDragOver(e)}
              >
                <div className="flex flex-col items-center justify-center pt-4 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  {file ? (
                    <span className="text-sm font-semibold text-zinc-300 mb-2">
                      {file.name}
                    </span>
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-zinc-400 text-center">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-zinc-500 text-center">
                        PDF only (max 10MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="resume-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
              className="block w-full p-2.5 text-sm rounded-lg border border-zinc-700 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {currentLang === "ar" ? lang.labelAr : lang.labelEn}
                </option>
              ))}
            </select>

            {/* Email Field - Editable with user's email pre-filled */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                {t("profile.email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-2.5 text-sm rounded-lg border border-zinc-700 bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t("upload.emailPlaceholder")}
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="w-full">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-purple-600 bg-zinc-800 border-zinc-600 rounded focus:ring-purple-500 focus:ring-2"
                  disabled={loading}
                />
                <label
                  htmlFor="terms-checkbox"
                  className="text-sm text-zinc-300 leading-relaxed"
                >
                  {currentLang === "ar" ? (
                    <>
                      أوافق على{" "}
                      <a
                        href="/terms-ar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        الشروط والأحكام
                      </a>{" "}
                      وأوافق على معالجة بياناتي لأغراض المقابلة.
                    </>
                  ) : (
                    <>
                      I accept the{" "}
                      <a
                        href="/terms-en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        Terms and Conditions
                      </a>{" "}
                      and agree to the processing of my data for interview
                      purposes.
                    </>
                  )}
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !acceptedTerms}
            >
              {loading ? t("upload.extractingText") : t("upload.uploadButton")}
            </button>
          </form>
        </div>

        {/* Progress Modal */}
        {showProgress && (
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
                {progressSteps[progressStep]}
              </span>
            </div>
          </div>
        )}

        {/* Start Interview Card */}
        {showStartCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 min-w-[280px] sm:min-w-[320px] relative shadow-xl mx-4">
              <span
                className="text-base sm:text-lg font-medium text-white text-center mb-2"
                style={{
                  fontFamily:
                    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                }}
              >
                {t("upload.readyToStartText")}
              </span>

              <button
                className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                onClick={handleStartInterview}
                disabled={loadingStartInterview}
              >
                {loadingStartInterview ? (
                  <svg
                    aria-hidden="true"
                    className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 mr-2"
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
                ) : (
                  t("upload.startInterviewText")
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function UploadResumePage() {
  return <UploadResumeContent />;
}

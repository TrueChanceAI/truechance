"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { map } from "zod";
import dayjs from "dayjs";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { useLanguage } from "@/hooks/useLanguage";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useAnalyzeTone,
  useGenerateInterviewFeedback,
  useUpdateInterview,
  useUpdateInterviewConducted,
} from "@/hooks/interview";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
  words?: Array<{ word: string; start: number; end: number }>;
  timestamp?: string; // Added timestamp for duration calculation
}

// Add language to AgentProps
type AgentProps = {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: string;
  questions?: string[];
  language?: string;
  interviewerConfig?: CreateAssistantDTO;
};

// 45 minutes in milliseconds
const TIME_LIMIT = 45 * 60 * 1000;

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  language: propLanguage,
  interviewerConfig,
}: AgentProps & {
  language?: string;
  interviewerConfig: CreateAssistantDTO;
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const sessionToken = useSelector((s: RootState) => s.me.sessionToken);

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [pauseAnalysis, setPauseAnalysis] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [tone, setTone] = useState<any>("");
  const [feedback, setFeedback] = useState<any>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showAnalysisSpinner, setShowAnalysisSpinner] = useState(false);
  const [showFeedbackCard, setShowFeedbackCard] = useState(false);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [interviewStartTime, setInterviewStartTime] = useState<number | null>(
    null
  );
  const [loadingReturnDashboard, setLoadingReturnDashboard] = useState(false);
  const [loadingCall, setLoadingCall] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const timeLimitRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;
  // New state for session tracking
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // API hooks
  const { analyzeTone } = useAnalyzeTone();
  const { generateInterviewFeedback } = useGenerateInterviewFeedback();
  const { updateInterview } = useUpdateInterview();
  const { updateInterviewConducted } = useUpdateInterviewConducted();

  useEffect(() => {
    const onCallStart = () => {
      console.log("📞 Call started - Setting up 1-minute timer...");
      setCallStatus(CallStatus.ACTIVE);
      setInterviewStartTime(Date.now());
      setSessionStartTime(Date.now()); // Track session start time

      // Start the timer when the call begins
      timeLimitRef.current = setTimeout(() => {
        console.log("⏰ Timer fired - 1 minute reached!");

        // Use appropriate language message
        const endMessage =
          language === "ar"
            ? "يبدو أننا انتهينا من الوقت الآن. شكرًا جزيلًا على هذه المحادثة — لقد كانت ممتعة، وأتمنى لك كل التوفيق في المستقبل."
            : "It looks like we're out of time for now. Thank you so much for the conversation — I really appreciated it, and I wish you the best going forward.";

        vapi.say(endMessage, true);
      }, TIME_LIMIT);
    };

    const onCallEnd = () => {
      console.log("Call ended unexpectedly", {
        callStatus,
        messages: messages.length,
      });
      setCallStatus(CallStatus.FINISHED);

      // Clear the timer if call ends before time limit
      if (timeLimitRef.current) {
        clearTimeout(timeLimitRef.current);
        timeLimitRef.current = null;
      }

      // Track session end time for duration calculation
      if (sessionStartTime) {
        const sessionEndTime = Date.now();
        const sessionDurationMinutes =
          (sessionEndTime - sessionStartTime) / (1000 * 60);
        console.log(
          `📊 Session ended. Duration: ${sessionDurationMinutes.toFixed(
            2
          )} minutes`
        );
      }
    };

    const onMessage = (message: any) => {
      console.log("Received message:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        // Save words array if available
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
          words: message.words || [],
          timestamp: message.timestamp, // Store timestamp
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.error("VAPI Error:", error);

      // Handle specific error types
      if (error?.type === "ejected" && error?.msg === "Meeting has ended") {
        console.log("Meeting ended normally, ignoring error");
        return;
      }

      // Handle Daily.co connection errors with retry logic
      if (
        error?.type === "daily-call-join-error" ||
        error?.type === "start-method-error" ||
        error?.errorMsg === "Meeting has ended"
      ) {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          const retryMessage = `Connection failed (attempt ${retryCountRef.current}/${maxRetries}). Retrying...`;
          console.log(retryMessage);
          setConnectionStatus(retryMessage);

          // Set a delay before attempting to reconnect
          setTimeout(() => {
            if (callStatus === CallStatus.CONNECTING) {
              console.log("Attempting to restart call...");
              setConnectionStatus("Reconnecting...");
              handleCall();
            }
          }, 2000 * retryCountRef.current); // Exponential backoff

          return;
        } else {
          console.error("Max retries reached, stopping connection attempts");
          setCallStatus(CallStatus.INACTIVE);
          setLoadingCall(false);
          setConnectionStatus("Connection failed after multiple attempts");
          alert(
            "Failed to establish interview connection after multiple attempts. Please check your internet connection and try again."
          );
          retryCountRef.current = 0; // Reset for next attempt
          return;
        }
      }

      // For other errors, don't automatically end the call
      // Let the user decide what to do
      console.error("Unhandled VAPI error:", error);
      setConnectionStatus("Connection error occurred");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);

      // Clear timer on cleanup
      if (timeLimitRef.current) {
        clearTimeout(timeLimitRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      // Only save feedback if interviewId and userId are present
      if (interviewId && userId) {
        const { success, feedbackId: id } = await createFeedback({
          interviewId,
          userId,
          transcript: messages,
          feedbackId,
        });

        console.log("Feedback creation result:", { success, id, interviewId });

        if (success && id) {
          console.log(
            "Redirecting to feedback page for interviewId:",
            interviewId
          );
          router.push(`/interview/${interviewId}/feedback`);
          return;
        } else {
          console.log("Error saving feedback");
        }
      } else {
        console.log("Missing interviewId or userId", { interviewId, userId });
      }
      // Do not redirect to home automatically; let user view analysis first
    };

    if (callStatus === CallStatus.FINISHED) {
      setShowAnalysisSpinner(true);
      const doAnalysisAndShowFeedback = async () => {
        const toneResult = await analyzePausesAndTone(messages);
        if (type === "generate") {
          // Save data after tone analysis is complete with the tone result
          await saveToSupabase(
            messages,
            { raw: "Generated interview completed." },
            toneResult
          );
          router.push("/");
        } else {
          await generateFeedback(messages, toneResult);
          setShowAnalysisSpinner(false);
          setShowFeedbackCard(true);
        }
      };
      doAnalysisAndShowFeedback();
    }
    if (callStatus === CallStatus.ACTIVE) {
      setLoadingCall(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  // Analyze pauses and tone
  async function analyzePausesAndTone(messages: SavedMessage[]) {
    setAnalyzing(true);
    // Gather all user messages with word-level timestamps
    const userWords = messages
      .filter((msg) => msg.role === "user" && msg.words && msg.words.length > 1)
      .map((msg) => msg.words!);
    // Analyze pauses for each answer
    let allPauses: any[] = [];
    userWords.forEach((words, idx) => {
      const pauses = analyzePauses(words);
      allPauses.push({ answer: idx + 1, pauses });
    });
    setPauseAnalysis(allPauses);
    // Analyze tone for all user answers (concatenated)
    const allText = messages
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content)
      .join("\n");
    const toneResult = await handleAnalyzeTone(allText);
    setTone(toneResult);
    setAnalyzing(false);
    return toneResult; // Return the tone result directly
  }

  // Pause analysis function
  function analyzePauses(
    words: { word: string; start: number; end: number }[],
    threshold = 1.5
  ) {
    let pauses = [];
    for (let i = 1; i < words.length; i++) {
      const gap = words[i].start - words[i - 1].end;
      if (gap > threshold) {
        pauses.push({ from: words[i - 1].word, to: words[i].word, gap });
      }
    }
    return pauses;
  }

  // Tone analysis using service hook
  async function handleAnalyzeTone(text: string): Promise<any> {
    try {
      const { tone } = await analyzeTone({ text });
      if (typeof tone === "string") {
        let str = tone.trim();
        if (str.startsWith("```")) {
          str = str
            .replace(/^```json|^```/i, "")
            .replace(/```$/, "")
            .trim();
        }
        if (str.toLowerCase().startsWith("json")) {
          str = str.replace(/^json/i, "").trim();
        }
        try {
          const parsed = JSON.parse(str);
          if (typeof parsed === "object" && parsed !== null) return parsed;
          return str;
        } catch {
          return str;
        }
      }
      return tone ?? "No tone detected.";
    } catch {
      return "Could not analyze tone.";
    }
  }

  async function generateFeedback(messages: SavedMessage[], toneResult: any) {
    setLoadingFeedback(true);
    const MAX_CHARS = 8000;
    const transcriptText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n")
      .slice(0, MAX_CHARS);

    try {
      const data: any = await generateInterviewFeedback({
        transcript: transcriptText,
      });
      const raw = data?.feedback;
      let feedbackData: any = raw;
      if (typeof raw === "string") {
        try {
          feedbackData = JSON.parse(raw);
        } catch {
          feedbackData = { raw };
        }
      }
      setFeedback(feedbackData);

      // Update interview conducted state to true
      if (interviewId) {
        try {
          await updateInterviewConducted(interviewId);
          console.log("✅ Interview conducted state updated to true");

          // Email report will be sent automatically by the API endpoint
          console.log("📧 Interview report email will be sent automatically");
        } catch (error) {
          console.error("Error updating interview conducted state:", error);
        }
      }

      await saveToSupabase(messages, feedbackData, toneResult);
    } catch {
      const feedbackData = { raw: "Could not generate feedback." };
      setFeedback(feedbackData);
      await saveToSupabase(messages, feedbackData, toneResult);
    }
    setLoadingFeedback(false);
  }

  // Calculate interview duration with improved logic
  let interviewDuration = null;

  const calculateDuration = (startTime: number, endTime: number) => {
    const diff = dayjs(endTime).diff(dayjs(startTime), "minute");
    const seconds = dayjs(endTime).diff(dayjs(startTime), "second") % 60;

    if (diff >= 0 && seconds >= 0) {
      return `${diff}m ${seconds}s`;
    }
    return null;
  };

  if (interviewStartTime) {
    let endTime = null;

    // Try to get end time from the last message timestamp
    if (messages.length > 0 && messages[messages.length - 1].timestamp) {
      endTime = dayjs(messages[messages.length - 1].timestamp).valueOf();
    }
    // Fallback to feedback creation time
    else if (feedback?.createdAt) {
      endTime = dayjs(feedback.createdAt).valueOf();
    }
    // Fallback to current time
    else {
      endTime = Date.now();
    }

    interviewDuration = calculateDuration(interviewStartTime, endTime);

    // If calculation fails, use session duration as fallback
    if (!interviewDuration && sessionStartTime) {
      const sessionEndTime = Date.now();
      const sessionDurationMinutes =
        (sessionEndTime - sessionStartTime) / (1000 * 60);
      if (sessionDurationMinutes > 0) {
        const sessionDiff = Math.floor(sessionDurationMinutes);
        const sessionSeconds = Math.floor(
          (sessionDurationMinutes - sessionDiff) * 60
        );
        interviewDuration = `${sessionDiff}m ${sessionSeconds}s`;
      }
    }
  } else {
    // If no interview start time, try to calculate from session start time
    if (sessionStartTime) {
      const sessionEndTime = Date.now();
      const sessionDurationMinutes =
        (sessionEndTime - sessionStartTime) / (1000 * 60);
      if (sessionDurationMinutes > 0) {
        const sessionDiff = Math.floor(sessionDurationMinutes);
        const sessionSeconds = Math.floor(
          (sessionDurationMinutes - sessionDiff) * 60
        );
        interviewDuration = `${sessionDiff}m ${sessionSeconds}s`;
      }
    }
  }

  // Final fallback: if we still don't have duration, try to estimate from messages
  if (!interviewDuration && messages.length > 0) {
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];

    if (firstMessage.timestamp && lastMessage.timestamp) {
      const startTime = dayjs(firstMessage.timestamp).valueOf();
      const endTime = dayjs(lastMessage.timestamp).valueOf();
      interviewDuration = calculateDuration(startTime, endTime);
    }
  }

  // If we still don't have duration, try to estimate from total time spent
  if (!interviewDuration && interviewId) {
    // This will be calculated and updated in the database when saveToSupabase is called
    console.log(
      "⚠️ Duration not calculated, will use session time as fallback"
    );
  }

  // Detect language from prop or sessionStorage (default to 'en')
  let language = propLanguage || "en";
  if (!propLanguage && typeof window !== "undefined") {
    language = sessionStorage.getItem("interviewLanguage") || "en";
  }

  // Use interviewerConfig for voice/transcriber/model
  const config = interviewerConfig;

  const handleCall = async () => {
    console.log("Starting call with config:", { type, questions, config });
    setInterviewStartTime(Date.now());
    setCallStatus(CallStatus.CONNECTING);
    setLoadingCall(true);
    setConnectionStatus("Initializing interview...");

    try {
      // Validate VAPI configuration
      if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
        throw new Error("VAPI web token is not configured");
      }

      if (type === "generate" && !process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
        throw new Error("VAPI workflow ID is not configured for generate mode");
      }

      setConnectionStatus("Checking microphone permissions...");

      // Check if user has granted microphone permissions
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop()); // Stop the test stream
        console.log("Microphone permission granted");
      } catch (mediaError) {
        console.error("Microphone permission denied:", mediaError);
        throw new Error(
          "Microphone access is required for the interview. Please grant microphone permissions and try again."
        );
      }

      setConnectionStatus("Connecting to interview server...");

      if (type === "generate") {
        console.log("Starting generate call");
        await vapi.start(
          undefined,
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
          {
            variableValues: {
              username: userName,
              userid: userId,
              ...config,
            },
          }
        );
      } else {
        console.log("Starting interview call");
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }
        console.log("Formatted questions:", formattedQuestions);

        await vapi.start(config, {
          variableValues: {
            questions: formattedQuestions,
            ...config,
          },
        });
      }

      console.log("Call started successfully");
      setLoadingCall(false);
      setConnectionStatus("");
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CallStatus.INACTIVE);
      setLoadingCall(false);
      setConnectionStatus("");

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start interview call";
      alert(`Interview Error: ${errorMessage}`);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    setShowAnalysisSpinner(true);
    vapi.stop();
  };

  // Function to save interview data to Supabase
  const saveToSupabase = async (
    messages: SavedMessage[],
    feedback: any,
    toneResult: any
  ) => {
    try {
      // Create transcript text
      const transcriptText = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      // Prepare tone data for storage - store the complete tone object
      let toneDataForStorage = null;
      if (toneResult) {
        if (typeof toneResult === "object" && !Array.isArray(toneResult)) {
          // Store the complete tone object with all fields
          toneDataForStorage = {
            confidence: (toneResult as any).confidence || null,
            tone: (toneResult as any).tone || null,
            energy: (toneResult as any).energy || null,
            summary: (toneResult as any).summary || null,
          };
        } else if (typeof toneResult === "string") {
          // If tone is a string, store it as is
          toneDataForStorage = toneResult;
        } else {
          // Fallback: convert to string
          toneDataForStorage = String(toneResult);
        }
      }

      // Calculate session duration and update cumulative time
      let sessionDurationMinutes = 0;
      let cumulativeTimeUpdate = {};

      if (sessionStartTime) {
        const sessionEndTime = Date.now();
        sessionDurationMinutes =
          (sessionEndTime - sessionStartTime) / (1000 * 60);
        console.log(
          `📊 Session duration: ${sessionDurationMinutes.toFixed(2)} minutes`
        );

        // Update cumulative time tracking
        cumulativeTimeUpdate = {
          last_session_end: new Date().toISOString(),
          total_time_spent_minutes: sessionDurationMinutes, // This will be added to existing total
        };
      }

      // Prepare data for Supabase
      const interviewData = {
        transcript: transcriptText,
        feedback: feedback, // Use extracted name for consistency
        duration: interviewDuration || "N/A",
        tone: toneDataForStorage, // Store the complete tone object
        language: language || "en",
        userId: userId || "anonymous",
        interviewId,
      };

      // Update interview with transcript, feedback, duration, tone, and session tracking
      await updateInterview({
        id: interviewData.interviewId as string,
        payload: {
          transcript: interviewData.transcript,
          feedback: interviewData.feedback,
          duration: interviewData.duration,
          tone: interviewData.tone as any,
          ...cumulativeTimeUpdate,
        },
      });
      console.log("✅ Interview data saved to Supabase successfully");
    } catch (error) {
      console.error("Error saving to Supabase:", error);
    }
  };

  return (
    <>
      <div
        className="call-view"
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        }}
      >
        {/* AI Interviewer Card */}
        <div className="card-interviewer bg-black">
          <div className="avatar bg-black">
            <Image
              src="/logo.svg"
              alt="AI Interviewer Logo"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>TrueChance</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <div className="rounded-full size-[120px] bg-primary-200 flex items-center justify-center text-2xl font-bold text-dark-100">
              {userName.charAt(0).toUpperCase()}
            </div>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
              style={{
                fontFamily:
                  language === "ar"
                    ? '"Cairo", "Host Grotesk", "Inter", "Poppins", "Roboto Mono", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
                    : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              }}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* After interview, show pause and tone analysis and feedback */}
      {showAnalysisSpinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center gap-4 min-w-[320px] relative shadow-xl">
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
            <span className="text-lg font-medium text-white">
              {t("interview.analyzingInterview")}
            </span>
          </div>
        </div>
      )}

      {/* Thank You Card Modal */}
      {showFeedbackCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
          <div
            className="bg-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4 w-full max-w-[90vw] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative shadow-xl animate-fade-in mx-2 sm:mx-4"
            style={{
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            }}
          >
            <div className="text-center mb-3 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4">
                🎉
              </div>
              <span
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 block"
                style={{ color: "#a78bfa" }}
              >
                {t("interview.thankYouTitle")}
              </span>
            </div>
            <div className="text-center mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm md:text-base text-light-200 mb-1 sm:mb-2 block">
                {t("interview.thankYouSubtitle")}:{" "}
                {dayjs(feedback?.createdAt || Date.now()).format(
                  "MMMM D, YYYY h:mm A"
                )}
              </span>
              {interviewDuration && (
                <span className="text-xs sm:text-sm md:text-base text-light-200 mb-2 sm:mb-3 md:mb-4 block">
                  Duration: {interviewDuration}
                </span>
              )}
              <div className="text-sm sm:text-base md:text-lg text-light-100 leading-relaxed px-1 sm:px-2">
                {t("interview.thankYouMessage")}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full justify-center mt-3 sm:mt-4">
              <button
                className="w-full sm:w-auto text-white font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-center bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-200"
                onClick={() => {
                  setLoadingReturnDashboard(true);
                  router.push("/");
                }}
                disabled={loadingReturnDashboard}
              >
                {loadingReturnDashboard ? (
                  <svg
                    aria-hidden="true"
                    className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-200 animate-spin dark:text-gray-600 mr-1 sm:mr-2"
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
                  t("interview.returnToDashboard")
                )}
              </button>

              <button
                className="w-full sm:w-auto text-black font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-center bg-gradient-to-br from-green-400 to-emerald-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-200"
                onClick={() => {
                  router.push(`/interview/${interviewId}/feedback`);
                }}
              >
                View Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-8">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative btn-call"
            onClick={() => {
              setLoadingCall(true);
              handleCall();
            }}
            disabled={loadingCall}
          >
            {loadingCall ? (
              <svg
                aria-hidden="true"
                className="inline w-5 h-5 text-white animate-spin mr-2"
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
              <span className="relative">
                {callStatus === "INACTIVE" || callStatus === "FINISHED"
                  ? t("interview.callButton")
                  : ". . ."}
              </span>
            )}
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            {t("interview.endButton")}
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;

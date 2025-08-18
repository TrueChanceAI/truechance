"use client";
import { useEffect, useState } from "react";

export default function InterviewAnalysisPage() {
  const [pauses, setPauses] = useState<any[]>([]);
  const [tone, setTone] = useState("");
  const [transcript, setTranscript] = useState<any[]>([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    setPauses(JSON.parse(sessionStorage.getItem("interviewPauses") || "[]"));
    setTone(sessionStorage.getItem("interviewTone") || "");
    setTranscript(JSON.parse(sessionStorage.getItem("interviewTranscript") || "[]"));
  }, []);

  useEffect(() => {
    if (transcript.length > 0 && !hasGenerated) {
      setHasGenerated(true);
      generateFeedback(transcript);
    }
    // eslint-disable-next-line
  }, [transcript, hasGenerated]);

  async function generateFeedback(transcript: any[]) {
    setLoading(true);
    const transcriptText = transcript.map((msg) => `${msg.role}: ${msg.content}`).join("\n");
    const res = await fetch("/api/interview-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: transcriptText }),
    });
    if (res.ok) {
      const data = await res.json();
      setFeedback(data.feedback);
    } else {
      setFeedback("Could not generate feedback.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Interview Analysis</h2>
      <div className="mb-4 sm:mb-6">
        <h3 className="font-semibold mb-2 text-lg sm:text-xl">Communication Analysis</h3>
        <div className="mb-3 sm:mb-4">
          <strong className="text-sm sm:text-base">Pauses Detected:</strong>
          <ul className="list-disc ml-4 sm:ml-6 mt-2 space-y-1">
            {pauses.map((ans, idx) => (
              <li key={idx} className="text-sm sm:text-base">
                Answer {ans.answer}: {ans.pauses.length} pause(s)
                {ans.pauses.length > 0 && (
                  <ul className="list-disc ml-4 sm:ml-6 mt-1 space-y-1">
                    {ans.pauses.map((p: any, i: number) => (
                      <li key={i} className="text-xs sm:text-sm">
                        Pause of {p.gap.toFixed(2)}s between "{p.from}" and "{p.to}"
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 sm:mt-4">
          <strong className="text-sm sm:text-base">Tone Analysis:</strong> 
          <span className="text-sm sm:text-base ml-2">{tone}</span>
        </div>
      </div>
      <div className="mb-4 sm:mb-6">
        <h3 className="font-semibold mb-2 text-lg sm:text-xl">Interview Feedback</h3>
        {loading ? (
          <div className="flex items-center gap-2">
            <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#6b7280"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#9333ea"/>
            </svg>
            <p className="text-sm sm:text-base">Generating feedback...</p>
          </div>
        ) : (
          <p className="text-sm sm:text-base leading-relaxed">{feedback}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button 
          className="btn btn-primary w-full sm:w-auto text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-200" 
          onClick={() => window.location.href = "/"}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
} 
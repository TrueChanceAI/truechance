import { IAPIResponse } from "./api";

export interface Interview {
  id: string;
  user_id: string;
  candidate_name: string;
  duration: string;
  language: string;
  transcript: string;
  feedback: string;
  tone: string | null;
  created_at: string;
  Email: string;
  "CV/Resume": string | null;
  skills: string;
  is_conducted: boolean;
  payment_id: string | null;
  interview_questions: string[];
  payment_status: string;
  // New fields for security measures
  total_time_spent_minutes?: number; // Cumulative time spent across all sessions
  last_session_start?: string; // Timestamp of last session start
  last_session_end?: string; // Timestamp of last session end
  session_count?: number; // Number of sessions attempted
  max_allowed_minutes?: number; // Maximum allowed time (default 45 minutes)
}

export interface ICreateInterviewRequest {
  email: string;
  resumeText: string;
  candidateName: string;
  language: string;
  resumeFile: string;
  resumeFileName: string;
  resumeFileType: string;
  authenticatedUserEmail: string;
  interviewQuestions: string[];
}

export interface ICreateInterviewResponse extends IAPIResponse {
  interview: Interview;
}

export interface IGetAnterviewResponse extends IAPIResponse {
  interviews: Interview[];
}

export interface IGetInterviewByIdResponse extends IAPIResponse {
  interview: Interview;
}

export interface IExtractResumeRequest {
  file: File;
  email: string;
}

export interface IExtractResumeResponse extends IAPIResponse {
  text: string;
  name: string;
}

export interface IGenerateQuestionsRequest {
  resume: string;
  language: string;
  candidateName: string;
}

export interface IGenerateQuestionsResponse extends IAPIResponse {
  questions: string[];
}

// Tone analysis
export interface IAnalyzeToneRequest {
  text: string;
}

export type IToneAnalysis =
  | {
      confidence?: number | null;
      tone?: string | null;
      energy?: string | number | null;
      summary?: string | null;
      [key: string]: unknown;
    }
  | string;

export interface IAnalyzeToneResponse extends IAPIResponse {
  tone: IToneAnalysis;
}

// Interview feedback generation
export interface IInterviewFeedbackRequest {
  transcript: string;
}

export interface IInterviewFeedbackResponse extends IAPIResponse {
  feedback: unknown; // API can return stringified JSON or object
}

// Save conducted interview
export interface IUpdateInterviewRequest {
  transcript: string;
  feedback: unknown;
  duration: string | null;
  tone: IToneAnalysis | null;
}

export interface IUpdateInterviewResponse extends IAPIResponse {
  interview: Interview;
}

export interface IUpdateInterviewConductedResponse extends IAPIResponse {
  success: boolean;
}

export type TExtractResumeService = (
  payload: IExtractResumeRequest
) => Promise<IExtractResumeResponse>;

export type TCreateInterviewService = (
  payload: ICreateInterviewRequest
) => Promise<ICreateInterviewResponse>;

export type TGetAllInterviewsService = () => Promise<IGetAnterviewResponse>;
export type TGetInterviewByIdService = (
  id: string
) => Promise<IGetInterviewByIdResponse>;

export type TGenerateQuestionsService = (
  payload: IGenerateQuestionsRequest
) => Promise<IGenerateQuestionsResponse>;

export type TAnalyzeToneService = (
  payload: IAnalyzeToneRequest
) => Promise<IAnalyzeToneResponse>;

export type TInterviewFeedbackService = (
  payload: IInterviewFeedbackRequest
) => Promise<IInterviewFeedbackResponse>;

export type TUpdateInterviewService = (
  id: string,
  payload: IUpdateInterviewRequest
) => Promise<IUpdateInterviewResponse>;

export type TUpdateInterviewConductedService = (
  id: string
) => Promise<IUpdateInterviewConductedResponse>;

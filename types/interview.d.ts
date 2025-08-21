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
  conducted_interview: string;
  payment_id: string | null;
  interview_questions: any;
}

export interface IGetAnterviewResponse extends IAPIResponse {
  interviews: Interview[];
}

export interface IGetInterviewByIdResponse extends IAPIResponse {
  interview: Interview;
}

export type TGetAllInterviewsService = () => Promise<IGetAnterviewResponse>;
export type TGetInterviewByIdService = (
  id: string
) => Promise<IGetInterviewByIdResponse>;

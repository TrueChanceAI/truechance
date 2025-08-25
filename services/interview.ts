import clientApi from "@/lib/api/client";
import {
  TGetAllInterviewsService,
  TGetInterviewByIdService,
  TCreateInterviewService,
  TExtractResumeService,
  TGenerateQuestionsService,
  TAnalyzeToneService,
  TInterviewFeedbackService,
  TUpdateInterviewService,
} from "@/types/interview";

export const getInterviews: TGetAllInterviewsService = async () => {
  const { data } = await clientApi.get("/interviews");

  return data;
};

export const getInterviewById: TGetInterviewByIdService = async (id) => {
  const { data } = await clientApi.get(`/interviews/${id}`);

  return data;
};

export const createInterview: TCreateInterviewService = async (payload) => {
  const { data } = await clientApi.post("/interviews", payload);

  return data;
};

export const extractResume: TExtractResumeService = async ({ file, email }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("email", email);

  const { data } = await clientApi.post("/extract-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const generateQuestions: TGenerateQuestionsService = async (payload) => {
  const { data } = await clientApi.post("/generate-questions", payload);

  return data;
};

export const analyzeTone: TAnalyzeToneService = async (payload) => {
  const { data } = await clientApi.post("/analyze-tone", payload);
  return data;
};

export const generateInterviewFeedback: TInterviewFeedbackService = async (
  payload
) => {
  const { data } = await clientApi.post("/interview-feedback", payload);
  return data;
};

export const updateInterview: TUpdateInterviewService = async (id, payload) => {
  const { data } = await clientApi.put(`/interviews/${id}`, payload);
  return data;
};

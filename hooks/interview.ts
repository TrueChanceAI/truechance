import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInterview,
  extractResume,
  generateQuestions,
  getInterviewById,
  getInterviews,
  analyzeTone,
  generateInterviewFeedback,
  updateInterview,
  updateInterviewConducted,
} from "@/services/interview";
import { toast } from "sonner";
import { IAPIError } from "@/types/api";
import {
  ICreateInterviewResponse,
  IExtractResumeResponse,
  IGenerateQuestionsResponse,
  IAnalyzeToneResponse,
  IInterviewFeedbackResponse,
  IUpdateInterviewResponse,
  IUpdateInterviewConductedResponse,
} from "@/types/interview";
import { queryRetry } from "@/lib/api/client";

export const useGetAllInterviews = () => {
  const { data, error, isError, isPending, isSuccess } = useQuery({
    queryKey: ["interviews"],
    queryFn: getInterviews,
    retry: queryRetry,
  });

  return {
    interviews: data?.interviews,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useGetInterviewById = (id: string) => {
  const { data, error, isError, isPending, isSuccess } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterviewById(id),
    enabled: !!id,
    retry: queryRetry,
  });

  return {
    interview: data?.interview,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();

  const onSuccess = (data: ICreateInterviewResponse) => {
    toast.success(data.message || "Resume Uploaded successfully");
    queryClient.invalidateQueries({ queryKey: ["interviews"] });
  };

  const onError = (error: IAPIError) => {
    toast.error(
      (error?.response as any)?.data?.error ||
        (error?.response as any)?.message ||
        error?.message ||
        "Something went wrong"
    );
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: createInterview,
    onSuccess,
    onError,
  });

  return {
    createInterview: mutateAsync,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useExtractResume = () => {
  const onError = (error: IAPIError) => {
    toast.error(
      (error?.response as any)?.data?.error ||
        (error?.response as any)?.message ||
        error?.message ||
        "Something went wrong"
    );
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: extractResume,
    onError,
  });

  return {
    extractResume: mutateAsync,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useGenerateQuestions = () => {
  const onError = (error: IAPIError) => {
    toast.error(
      (error?.response as any)?.data?.error ||
        (error?.response as any)?.message ||
        error?.message ||
        "Something went wrong"
    );
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: generateQuestions,
    onError,
  });

  return {
    generateQuestions: mutateAsync,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useAnalyzeTone = () => {
  const onError = (error: IAPIError) => {
    toast.error(
      (error?.response as any)?.data?.error ||
        (error?.response as any)?.message ||
        error?.message ||
        "Something went wrong"
    );
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation<
    IAnalyzeToneResponse,
    IAPIError,
    { text: string }
  >({
    mutationFn: analyzeTone,
    onError,
  });

  return {
    analyzeTone: mutateAsync,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useGenerateInterviewFeedback = () => {
  const onError = (error: IAPIError) => {
    toast.error(
      (error?.response as any)?.data?.error ||
        (error?.response as any)?.message ||
        error?.message ||
        "Something went wrong"
    );
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation<
    IInterviewFeedbackResponse,
    IAPIError,
    { transcript: string }
  >({
    mutationFn: generateInterviewFeedback,
    onError,
  });

  return {
    generateInterviewFeedback: mutateAsync,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useUpdateInterview = () => {
  const onError = (error: IAPIError) => {
    toast.error(
      (error?.response as any)?.data?.error ||
        (error?.response as any)?.message ||
        error?.message ||
        "Something went wrong"
    );
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation<
    IUpdateInterviewResponse,
    IAPIError,
    { id: string; payload: any }
  >({
    mutationFn: ({ id, payload }) => updateInterview(id, payload),
    onError,
  });

  return {
    updateInterview: mutateAsync,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

export const useUpdateInterviewConducted = () => {
  const queryClient = useQueryClient();

  const onSuccess = (data: IUpdateInterviewConductedResponse) => {
    toast.success("Interview status updated successfully");
    // Invalidate relevant queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ["interviews"] });
    queryClient.invalidateQueries({ queryKey: ["interview"] });
  };

  const onError = (error: IAPIError) => {
    toast.error(
      (error?.response as any)?.data?.error ||
        (error?.response as any)?.message ||
        error?.message ||
        "Failed to update interview status"
    );
  };

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: updateInterviewConducted,
    onSuccess,
    onError,
  });

  return {
    updateInterviewConducted: mutateAsync,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

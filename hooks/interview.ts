import { useQuery } from "@tanstack/react-query";
import { getInterviewById, getInterviews } from "@/services/interview";

export const useGetAllInterviews = () => {
  const { data, error, isError, isPending, isSuccess } = useQuery({
    queryKey: ["interviews"],
    queryFn: getInterviews,
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
  });

  return {
    interview: data?.interview,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

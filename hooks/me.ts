import { useQuery } from "@tanstack/react-query";
import { getMeService } from "@/services/me";

export const useGetMe = () => {
  const { data, error, isError, isPending, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: getMeService,
  });

  return {
    me: data?.user,
    error,
    isError,
    isLoading: isPending,
    isSuccess,
  };
};

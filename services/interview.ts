import clientApi from "@/lib/api/client";
import {
  TGetAllInterviewsService,
  TGetInterviewByIdService,
} from "@/types/interview";

export const getInterviews: TGetAllInterviewsService = async () => {
  const { data } = await clientApi.get("/interviews");

  return data;
};

export const getInterviewById: TGetInterviewByIdService = async (id) => {
  const { data } = await clientApi.get(`/interviews/${id}`);

  return data;
};

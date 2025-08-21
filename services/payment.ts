import apiClient from "@/lib/api/client";
import type {
  TCheckPaymentStatusService,
  TInitiatePaymentService,
} from "@/types/payment";

export const initiatePayment: TInitiatePaymentService = async (payload) => {
  const { data } = await apiClient.post("/payment/initiate", payload);

  return data;
};

export const checkPaymentStatus: TCheckPaymentStatusService = async (
  paymentId
) => {
  const { data } = await apiClient.get(
    `/payment/status?paymentId=${paymentId}`
  );

  return data;
};

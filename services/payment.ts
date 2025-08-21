import apiClient from "@/lib/api/client";
import type {
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentStatusResponse,
  PaymentOrder,
  PaymentStatus,
} from "@/types/payment";

export class PaymentService {
  /**
   * Initiate a new payment
   */
  static async initiatePayment(
    data: PaymentInitiateRequest
  ): Promise<PaymentInitiateResponse> {
    try {
      const response = await apiClient.post("/payment/initiate", data, {
        headers: {
          "x-forwarded-for": data.userIP,
          "x-real-ip": data.userIP,
          "x-client-ip": data.userIP,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      throw new Error(
        error.response?.data?.error || "Payment initiation failed"
      );
    }
  }

  /**
   * Check payment status
   */
  static async checkPaymentStatus(
    paymentId: string
  ): Promise<PaymentStatusResponse> {
    try {
      const response = await apiClient.get(
        `/payment/status?paymentId=${paymentId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Payment status check failed:", error);
      throw new Error(
        error.response?.data?.error || "Payment status check failed"
      );
    }
  }

  /**
   * Get payment order by ID
   */
  static async getPaymentOrder(paymentId: string): Promise<PaymentOrder> {
    try {
      const response = await apiClient.get(`/payment/order/${paymentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get payment order:", error);
      throw new Error(
        error.response?.data?.error || "Failed to get payment order"
      );
    }
  }

  /**
   * Update payment order status
   */
  static async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    transactionId?: string
  ): Promise<PaymentOrder> {
    try {
      const response = await apiClient.patch(`/payment/order/${paymentId}`, {
        status,
        transaction_id: transactionId,
        updated_at: new Date().toISOString(),
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to update payment status:", error);
      throw new Error(
        error.response?.data?.error || "Failed to update payment status"
      );
    }
  }

  /**
   * Create a new payment order
   */
  static async createPaymentOrder(data: {
    userId: string;
    interviewId: string;
    amount: number;
    currency: string;
    address: any;
  }): Promise<PaymentOrder> {
    try {
      const response = await apiClient.post("/payment/order", {
        user_id: data.userId,
        interview_id: data.interviewId,
        amount: data.amount,
        currency: data.currency,
        status: "pending",
        address: data.address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to create payment order:", error);
      throw new Error(
        error.response?.data?.error || "Failed to create payment order"
      );
    }
  }

  /**
   * Get all payment orders for a user
   */
  static async getUserPaymentOrders(userId: string): Promise<PaymentOrder[]> {
    try {
      const response = await apiClient.get(`/payment/orders?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get user payment orders:", error);
      throw new Error(
        error.response?.data?.error || "Failed to get user payment orders"
      );
    }
  }

  /**
   * Validate payment callback data
   */
  static validatePaymentCallback(paymentId: string): boolean {
    // Basic UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(paymentId);
  }

  /**
   * Map EDFA status to internal status
   */
  static mapEDFAStatus(edfaStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      settled: "completed",
      declined: "declined",
      "3ds": "3ds",
      redirect: "redirect",
      refund: "refund",
      unknown: "unknown",
    };

    return statusMap[edfaStatus.toLowerCase()] || "unknown";
  }
}

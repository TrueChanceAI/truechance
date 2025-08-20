import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { EDFAPayment } from "@/lib/edfaPay";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");
    
    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Get payment order from database
    const { data: payment_order, error: payment_order_error } =
      await supabaseServer
        .from("payment_orders")
        .select("*")
        .eq("id", paymentId)
        .single();

    if (payment_order_error || !payment_order) {
      return NextResponse.json(
        { error: "Payment order not found" },
        { status: 404 }
      );
    }

    // Check payment status with EDFA
    const edfaPay = new EDFAPayment();
    const response = await edfaPay.checkPaymentStatus(
      payment_order.edfa_transaction_id,
      payment_order.amount
    );

    if (response.success) {
      // Return the payment status information
      return NextResponse.json({
        success: true,
        paymentId: paymentId,
        status: response.data?.responseBody?.status || 'unknown',
        order: response.data?.responseBody?.order,
        customer: response.data?.responseBody?.customer,
        payment_id: response.data?.responseBody?.payment_id,
        rrn: response.data?.responseBody?.rrn,
        date: response.data?.responseBody?.date,
        brand: response.data?.responseBody?.brand
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.message,
        paymentId: paymentId
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

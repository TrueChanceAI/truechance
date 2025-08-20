"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  paymentId: string;
  onClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  paymentId,
  onClose,
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isStarting, setIsStarting] = useState(false);

  if (!isOpen) return null;

  const handleStartInterview = async () => {
    setIsStarting(true);

    // Store the payment ID in session storage for the interview
    sessionStorage.setItem("currentPaymentId", paymentId);

    // Small delay for better UX
    setTimeout(() => {
      router.push("/interview");
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4 min-w-[320px] max-w-[400px] shadow-xl">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful! 🎉
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Your interview has been unlocked!
          </p>
        </div>

        {/* Start Interview Button */}
        <button
          onClick={handleStartInterview}
          disabled={isStarting}
          className="w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          style={{ backgroundColor: "#E53935" }}
        >
          {isStarting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Starting...
            </div>
          ) : (
            "Start Interview Now"
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors duration-200 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;

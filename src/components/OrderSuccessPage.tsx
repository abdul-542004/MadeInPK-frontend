import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

interface OrderSuccessPageProps {
  onBackToHome: () => void;
  email?: string;
}

export function OrderSuccessPage({ onBackToHome, email = "customer@example.com" }: OrderSuccessPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative">
            {/* Decorative badge shape */}
            <svg width="100" height="100" viewBox="0 0 100 100" className="text-emerald-500">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="currentColor"
                opacity="0.1"
              />
              {/* Scalloped edge effect */}
              <path
                d="M50 5 L55 15 L65 10 L65 20 L75 20 L70 30 L80 35 L75 45 L80 55 L70 60 L75 70 L65 70 L65 80 L55 75 L50 85 L45 75 L35 80 L35 70 L25 70 L30 60 L20 55 L25 45 L20 35 L30 30 L25 20 L35 20 L35 10 L45 15 Z"
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-emerald-600" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl text-gray-900 mb-3">Your order is placed</h1>
        <p className="text-gray-600 mb-2">Thank you for your payment.</p>
        <p className="text-sm text-gray-500 mb-8">
          Order invoice sent to your email{" "}
          <span className="text-emerald-700">{email}</span>
        </p>

        {/* Back to Home Button */}
        <Button
          onClick={onBackToHome}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50 px-8"
        >
          BACK TO HOME
        </Button>
      </div>
    </div>
  );
}

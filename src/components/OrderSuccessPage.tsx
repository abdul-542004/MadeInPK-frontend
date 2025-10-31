import { useState } from "react";
import { CheckCircle, Star, Loader2, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { reviewService, CreateFeedbackRequest } from "../services/reviewService";
import { MOCK_MODE } from "../lib/mockMode";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface OrderSuccessPageProps {
  orderId?: number;
  email?: string;
}

export function OrderSuccessPage({ orderId, email }: OrderSuccessPageProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    seller_rating: 5,
    seller_comment: '',
    platform_rating: 5,
    platform_comment: '',
    communication_rating: 5,
    product_as_described: true,
    shipping_speed_rating: 5,
  });

  const handleSubmitFeedback = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to submit feedback');
      return;
    }

    if (!orderId) {
      toast.error('Order ID not available');
      return;
    }

    try {
      setSubmittingFeedback(true);

      if (MOCK_MODE) {
        // Mock feedback submission
        console.log('Mock feedback submitted:', feedbackForm);
        toast.success('Thank you for your feedback!');
        setShowFeedbackForm(false);
      } else {
        const feedbackData: CreateFeedbackRequest = {
          order_id: orderId,
          seller_rating: feedbackForm.seller_rating,
          seller_comment: feedbackForm.seller_comment,
          platform_rating: feedbackForm.platform_rating,
          platform_comment: feedbackForm.platform_comment,
          communication_rating: feedbackForm.communication_rating,
          product_as_described: feedbackForm.product_as_described,
          shipping_speed_rating: feedbackForm.shipping_speed_rating,
        };
        await reviewService.createFeedback(feedbackData);
        toast.success('Thank you for your feedback!');
        setShowFeedbackForm(false);
      }
    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const renderStarRating = (
    label: string,
    value: number,
    onChange: (value: number) => void
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                i < value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-gray-600">
          {value} {value === 1 ? 'star' : 'stars'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
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
          {email && (
            <p className="text-sm text-gray-500 mb-6">
              Order invoice sent to your email{" "}
              <span className="text-emerald-700">{email}</span>
            </p>
          )}
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-medium text-gray-900">#{orderId}</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 px-8"
            >
              BACK TO HOME
            </Button>
            {isAuthenticated && orderId && !showFeedbackForm && (
              <Button
                onClick={() => setShowFeedbackForm(true)}
                className="bg-emerald-700 hover:bg-emerald-800 px-8"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Leave Feedback
              </Button>
            )}
          </div>
        </div>

        {/* Feedback Form */}
        {showFeedbackForm && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Share Your Experience</h2>
            <p className="text-gray-600 mb-6">
              Help us improve by sharing your feedback about your order and experience.
            </p>

            <div className="space-y-6">
              {/* Seller Rating */}
              {renderStarRating(
                'Seller Rating',
                feedbackForm.seller_rating,
                (value) => setFeedbackForm({ ...feedbackForm, seller_rating: value })
              )}

              {/* Seller Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Feedback (Optional)
                </label>
                <textarea
                  value={feedbackForm.seller_comment}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, seller_comment: e.target.value })}
                  placeholder="Tell us about your experience with the seller..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
              </div>

              {/* Communication Rating */}
              {renderStarRating(
                'Communication Rating',
                feedbackForm.communication_rating,
                (value) => setFeedbackForm({ ...feedbackForm, communication_rating: value })
              )}

              {/* Shipping Speed Rating */}
              {renderStarRating(
                'Delivery Speed Rating',
                feedbackForm.shipping_speed_rating,
                (value) => setFeedbackForm({ ...feedbackForm, shipping_speed_rating: value })
              )}

              {/* Product As Described */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product As Described
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFeedbackForm({ ...feedbackForm, product_as_described: true })}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      feedbackForm.product_as_described
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackForm({ ...feedbackForm, product_as_described: false })}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      !feedbackForm.product_as_described
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Platform Rating */}
              {renderStarRating(
                'Platform Experience',
                feedbackForm.platform_rating,
                (value) => setFeedbackForm({ ...feedbackForm, platform_rating: value })
              )}

              {/* Platform Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Feedback (Optional)
                </label>
                <textarea
                  value={feedbackForm.platform_comment}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, platform_comment: e.target.value })}
                  placeholder="Tell us about your experience with MadeInPK platform..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback}
                  className="bg-emerald-700 hover:bg-emerald-800 flex-1"
                >
                  {submittingFeedback ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </Button>
                <Button
                  onClick={() => setShowFeedbackForm(false)}
                  variant="outline"
                  disabled={submittingFeedback}
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

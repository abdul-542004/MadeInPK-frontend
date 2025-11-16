import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Star } from 'lucide-react';
import { reviewService, CreateFeedbackRequest } from '../services/reviewService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  orderNumber: string;
  productName: string;
  sellerName: string;
  onSuccess?: () => void;
}

export function FeedbackDialog({ 
  open, 
  onOpenChange, 
  orderId,
  orderNumber,
  productName,
  sellerName,
  onSuccess 
}: FeedbackDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateFeedbackRequest, 'order_id'>>({
    seller_rating: 5,
    seller_comment: '',
    platform_rating: 5,
    platform_comment: '',
    communication_rating: 5,
    product_as_described: true,
    shipping_speed_rating: 5,
  });

  const RatingStars = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                i < value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{value}/5</span>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const feedbackData: CreateFeedbackRequest = {
        order_id: orderId,
        ...formData,
      };
      
      await reviewService.createFeedback(feedbackData);
      toast.success('Thank you for your feedback!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      const errorMessage = error.response?.data?.non_field_errors?.[0] ||
                          error.response?.data?.detail ||
                          error.response?.data?.message ||
                          'Failed to submit feedback';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>
            Order #{orderNumber} - {productName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seller Feedback Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Rate the Seller: {sellerName}</h3>
            
            {/* Seller Rating */}
            <RatingStars
              value={formData.seller_rating}
              onChange={(v) => setFormData({ ...formData, seller_rating: v })}
              label="Overall Seller Rating *"
            />

            {/* Communication Rating */}
            <RatingStars
              value={formData.communication_rating}
              onChange={(v) => setFormData({ ...formData, communication_rating: v })}
              label="Communication *"
            />

            {/* Shipping Speed Rating */}
            <RatingStars
              value={formData.shipping_speed_rating}
              onChange={(v) => setFormData({ ...formData, shipping_speed_rating: v })}
              label="Shipping Speed *"
            />

            {/* Product As Described */}
            <div className="space-y-2">
              <Label>Was the product as described? *</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, product_as_described: true })}
                  className={`px-4 py-2 rounded-md border-2 transition-colors ${
                    formData.product_as_described
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, product_as_described: false })}
                  className={`px-4 py-2 rounded-md border-2 transition-colors ${
                    !formData.product_as_described
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Seller Comment */}
            <div className="space-y-2">
              <Label htmlFor="seller-comment">Comments about the seller (optional)</Label>
              <Textarea
                id="seller-comment"
                value={formData.seller_comment || ''}
                onChange={(e) => setFormData({ ...formData, seller_comment: e.target.value })}
                placeholder="Share your experience with this seller..."
                rows={3}
                className="resize-none"
                maxLength={500}
              />
            </div>
          </div>

          {/* Platform Feedback Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Rate MadeInPK Platform</h3>
            
            {/* Platform Rating */}
            <RatingStars
              value={formData.platform_rating}
              onChange={(v) => setFormData({ ...formData, platform_rating: v })}
              label="Overall Platform Experience *"
            />

            {/* Platform Comment */}
            <div className="space-y-2">
              <Label htmlFor="platform-comment">Comments about MadeInPK (optional)</Label>
              <Textarea
                id="platform-comment"
                value={formData.platform_comment || ''}
                onChange={(e) => setFormData({ ...formData, platform_comment: e.target.value })}
                placeholder="Help us improve our platform..."
                rows={3}
                className="resize-none"
                maxLength={500}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

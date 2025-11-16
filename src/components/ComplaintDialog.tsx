import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { complaintService, CreateComplaintRequest } from '../services/complaintService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: number;
  sellerId?: number;
  productName?: string;
}

export function ComplaintDialog({ 
  open, 
  onOpenChange, 
  orderId, 
  sellerId,
  productName 
}: ComplaintDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateComplaintRequest>({
    category: 'other',
    subject: '',
    description: '',
    order: orderId,
    seller: sellerId,
  });

  const categories = complaintService.getCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await complaintService.createComplaint(formData);
      toast.success('Complaint submitted successfully. Our team will review it shortly.');
      
      // Reset form
      setFormData({
        category: 'other',
        subject: '',
        description: '',
        order: orderId,
        seller: sellerId,
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to submit complaint:', error);
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Complaint</DialogTitle>
          <DialogDescription>
            Tell us about your issue and we'll work to resolve it as soon as possible.
            {productName && <span className="block mt-1">Regarding: <strong>{productName}</strong></span>}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of your issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              maxLength={255}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide detailed information about your complaint..."
              rows={6}
              className="resize-none"
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Info Note */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Our support team will review your complaint and get back to you 
              via email within 24-48 hours. Your complaint number will be provided after submission.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
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
                'Submit Complaint'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

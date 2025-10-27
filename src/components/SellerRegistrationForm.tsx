import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Store, Phone, MapPin, Building2, CreditCard } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SellerRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (sellerData: SellerData) => void;
}

export interface SellerData {
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessDescription: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export function SellerRegistrationForm({ open, onOpenChange, onComplete }: SellerRegistrationFormProps) {
  const [formData, setFormData] = useState<SellerData>({
    businessName: "",
    businessPhone: "",
    businessAddress: "",
    businessDescription: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.businessName || !formData.businessPhone || !formData.businessAddress || !formData.businessDescription) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^3\d{9}$/;
    if (!phoneRegex.test(formData.businessPhone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid Pakistani mobile number (e.g., 300 1234567)");
      return;
    }

    onComplete(formData);
    toast.success("Seller registration successful!");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      businessName: "",
      businessPhone: "",
      businessAddress: "",
      businessDescription: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankName: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-800">
            <Store className="w-6 h-6" />
            Become a Seller
          </DialogTitle>
          <DialogDescription>
            Complete your seller profile to start selling on MadeInPK
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Business Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Building2 className="w-5 h-5" />
              <h3 className="text-emerald-800">Business Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-gray-700">
                Business/Shop Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                placeholder="e.g., Handcrafted Pottery Studio"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPhone" className="text-gray-700">
                Business Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 border rounded-md bg-gray-50 w-20">
                  <span className="text-lg">🇵🇰</span>
                  <span className="text-sm text-gray-600">+92</span>
                </div>
                <Input
                  id="businessPhone"
                  type="tel"
                  placeholder="300 1234567"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  className="flex-1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress" className="text-gray-700">
                Business Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="businessAddress"
                  placeholder="Complete address with city"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDescription" className="text-gray-700">
                Business Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="Tell us about your business, the products you make, and what makes them special..."
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                rows={4}
                required
              />
              <p className="text-xs text-gray-500">
                This will be displayed on your seller profile
              </p>
            </div>
          </div>

          {/* Bank Details (Optional) */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-gray-700">
              <CreditCard className="w-5 h-5" />
              <h3 className="text-gray-800">Bank Details (Optional)</h3>
            </div>
            <p className="text-sm text-gray-500">
              Add your bank details to receive payments directly
            </p>

            <div className="space-y-2">
              <Label htmlFor="bankAccountName" className="text-gray-700">Account Holder Name</Label>
              <Input
                id="bankAccountName"
                placeholder="e.g., Muhammad Ali"
                value={formData.bankAccountName}
                onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber" className="text-gray-700">Account Number</Label>
              <Input
                id="bankAccountNumber"
                placeholder="e.g., 1234567890123456"
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-gray-700">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="e.g., HBL, UBL, MCB"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-emerald-700 hover:bg-emerald-800"
            >
              Complete Registration
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By registering as a seller, you agree to our Terms of Service and Seller Policies
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

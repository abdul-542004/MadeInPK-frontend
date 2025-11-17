import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Store, Phone, MapPin, Building2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAddress } from "../contexts/AddressContext";

interface SellerRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (sellerData: SellerData) => void;
}

export interface SellerData {
  businessName: string;
  businessPhone: string;
  businessAddressId: number | null;  // Changed from businessAddress string
  businessDescription: string;
}

export function SellerRegistrationForm({ open, onOpenChange, onComplete }: SellerRegistrationFormProps) {
  const { addresses, loadProvinces, refreshAddresses } = useAddress();
  const [formData, setFormData] = useState<SellerData>({
    businessName: "",
    businessPhone: "",
    businessAddressId: null,
    businessDescription: "",
  });
  const [showAddressNote, setShowAddressNote] = useState(false);

  useEffect(() => {
    if (open) {
      refreshAddresses();
      loadProvinces();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.businessName || !formData.businessPhone || !formData.businessAddressId || !formData.businessDescription) {
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
  };

  const handleCancel = () => {
    setFormData({
      businessName: "",
      businessPhone: "",
      businessAddressId: null,
      businessDescription: "",
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
              <select
                id="businessAddress"
                value={formData.businessAddressId || ""}
                onChange={(e) => setFormData({ ...formData, businessAddressId: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Select your business address</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street_address}, {addr.city_name}, {addr.province_name}
                  </option>
                ))}
              </select>
              {addresses.length === 0 && (
                <p className="text-xs text-amber-600">
                  No addresses found. Please add an address from your account settings first.
                </p>
              )}
              <p className="text-xs text-gray-500">
                Select the address where your business is located. This helps buyers find products from their region.
              </p>
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

          {/* Important Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-amber-900 text-sm">Important Information</h4>
            <ul className="text-xs text-amber-800 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span><strong>Platform Fee:</strong> We charge a 2% commission on every successful sale</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span><strong>Shipping:</strong> You are responsible for shipping your products to buyers. We do not handle shipping logistics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span><strong>Payments:</strong> Funds are transferred to you after successful delivery and platform fee deduction</span>
              </li>
            </ul>
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
